package com.gritlabstudent.product.ms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.gritlabstudent.product.ms.config.ValidateProduct;
import com.gritlabstudent.product.ms.exceptions.ProductCollectionException;
import com.gritlabstudent.product.ms.models.OrderDTO;
import com.gritlabstudent.product.ms.models.Product;
import com.gritlabstudent.product.ms.producer.SellerGainProducer;
import com.gritlabstudent.product.ms.producer.StockConfirmationProducer;
import com.gritlabstudent.product.ms.repositories.ProductRepository;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//import objectmapper
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private SellerGainProducer sellerGainProducer;

    private StockConfirmationProducer stockConfirmationProducer;

    private final ObjectMapper objectMapper;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    public ProductService(ProductRepository productRepository, SellerGainProducer sellerGainProducer , ObjectMapper objectMapper, StockConfirmationProducer stockConfirmationProducer) {
        this.productRepository = productRepository;
        this.sellerGainProducer = sellerGainProducer;
        this.objectMapper = objectMapper;
        this.stockConfirmationProducer = stockConfirmationProducer;

    }

    public void createProduct(Product product) throws ConstraintViolationException, ProductCollectionException {
        ValidateProduct.validateProduct(product);
        productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "totalAmountSold"));
    }

    public Product getProductById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    public void updateProduct(String id, Product product) throws ProductCollectionException {
        Optional<Product> productOptional = productRepository.findById(id);

        ValidateProduct.validateProduct(product);

        // Here, you would make an API call to User service if user validation is necessary

        if (productOptional.isPresent()) {
            // Update product details
            Product productUpdate = productOptional.get();
            productUpdate.setName(product.getName());
            productUpdate.setDescription(product.getDescription());
            productUpdate.setPrice(product.getPrice());
            productUpdate.setQuantity(product.getQuantity());
            // Keep or remove the following line based on your architecture
            productUpdate.setUserId(product.getUserId());
            productRepository.save(productUpdate);
        } else {
            throw new ProductCollectionException(ProductCollectionException.NotFoundException(id));
        }
    }

    public void deleteProduct(String id) throws ProductCollectionException {
        Optional<Product> productOptional = productRepository.findById(id);
        if (!productOptional.isPresent()) {
            throw new ProductCollectionException(ProductCollectionException.NotFoundException(id));
        } else {
            kafkaTemplate.send("product_deletion", id);
            productRepository.deleteById(id);
        }
    }

    public Iterable<Product> getProductsByUserId(String userId) {
    Sort sort = Sort.by(Sort.Direction.DESC, "totalAmountSold");
    return productRepository.findByUserId(userId, sort);
}
    public void deleteProductsByUserId(String userId) {

        Iterable<Product> products = getProductsByUserId(userId);

        products.forEach(product -> {
            // Send a message to Kafka with the product ID
            kafkaTemplate.send("product_deletion", product.getProductId());

            // Delete the product
            productRepository.delete(product);
        });
    }


    public boolean checkProductExists(String productId) {
        return productRepository.existsById(productId);
    }

    public void processOrder(OrderDTO order) {
        logger.info("Processing order with ID: {}", order.getId());

        // Count the occurrences of each productId in the order
        Map<String, Long> productCount = order.getProductIds().stream()
                .filter(productId -> productId != null)
                .collect(Collectors.groupingBy(productId -> productId, Collectors.counting()));
        logger.debug("Product count for order: {}", productCount);


        // Loop to update product quantities based on the productCount map
        productCount.forEach((productId, count) -> {
            productRepository.findById(productId).ifPresent(product -> {
                product.setQuantity(product.getQuantity() - count.intValue());
                product.setTotalAmountSold(product.getTotalAmountSold() + count.intValue());
                productRepository.save(product);
                logger.info("Updated quantity for product ID {}: new quantity {}", productId, product.getQuantity());
            });
        });

        // Retrieve product details based on productIds in the order
        List<Product> products = productRepository.findAllById(order.getProductIds());
        logger.debug("Retrieved products details for order: {}", products);

        // Calculate gains per seller
        Map<String, BigDecimal> sellerGains = calculateGainsPerSeller(products, productCount);
        logger.info("Calculated seller gains for order: {}", sellerGains);

        // Update the product details (e.g., reduce stock)
        updateProductDetails(products, productCount);
        logger.info("Updated product details for order");



        sellerGains.forEach((userId, gain) -> {

            sellerGainProducer.sendSellerGain(userId, gain);
            logger.info("Sent seller gain to Kafka for sellerId {}: {}", userId, gain);
        });

    }

    private Map<String, BigDecimal> calculateGainsPerSeller(List<Product> products, Map<String, Long> productCount) {
        logger.debug("Calculating gains per seller");
        Map<String, BigDecimal> sellerGains = new HashMap<>();
        for (Product product : products) {
            Long count = productCount.get(product.getId());
            if (count != null) {
                BigDecimal gain = BigDecimal.valueOf(product.getPrice()).multiply(BigDecimal.valueOf(count));
                String sellerId = product.getUserId();
                sellerGains.merge(sellerId, gain, BigDecimal::add);
                logger.debug("Seller ID: {} - Gain: {}", sellerId, gain);
            }
        }
        return sellerGains;
    }

    private void updateProductDetails(List<Product> products, Map<String, Long> productCount) {
        // Your existing logic to update product details
        logger.debug("Updating product details");

    }

    public void checkInStock(String orderJson) {
        logger.info("Checking stock for order: {}", orderJson);
        try {
            OrderDTO order = objectMapper.readValue(orderJson, OrderDTO.class);
            boolean allProductsInStock = true;

            for (String productId : order.getProductIds()) {
                Optional<Product> productOpt = productRepository.findById(productId);
                if (!productOpt.isPresent() || productOpt.get().getQuantity() < 1) {
                    allProductsInStock = false;
                    break;
                }
            }

            if (allProductsInStock) {
                // If all products are in stock, send a confirmation message back to order-ms
                logger.info("All products are in stock for order ID: {}", order.getId());
                stockConfirmationProducer.sendStockConfirmation(order.getId(), "CONFIRMED");
            } else {
                // If not all products are in stock, send a denial message back to order-ms
                logger.info("Not all products are in stock for order ID: {}", order.getId());
                stockConfirmationProducer.sendStockConfirmation(order.getId(), "DENIED");
            }
        } catch (IOException e) {
            logger.error("Error deserializing order JSON", e);
            // Handle the exception, possibly send a failure message back to order-ms
        }
    }

}
