package com.gritlabstudent.product.ms.service;

import com.gritlabstudent.product.ms.config.ValidateProduct;
import com.gritlabstudent.product.ms.exceptions.ProductCollectionException;
import com.gritlabstudent.product.ms.models.OrderDTO;
import com.gritlabstudent.product.ms.models.Product;
import com.gritlabstudent.product.ms.producer.SellerGainProducer;
import com.gritlabstudent.product.ms.repositories.ProductRepository;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private SellerGainProducer sellerGainProducer;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    public ProductService(ProductRepository productRepository, SellerGainProducer sellerGainProducer) {
        this.productRepository = productRepository;
        this.sellerGainProducer = sellerGainProducer;
    }

    public void createProduct(Product product) throws ConstraintViolationException, ProductCollectionException {
        ValidateProduct.validateProduct(product);
        productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
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
        return productRepository.findByUserId(userId);
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
                .collect(Collectors.groupingBy(productId -> productId, Collectors.counting()));
        logger.debug("Product count for order: {}", productCount);

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

}
