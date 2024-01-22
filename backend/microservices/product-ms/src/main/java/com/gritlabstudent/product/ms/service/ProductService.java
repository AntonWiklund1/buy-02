package com.gritlabstudent.product.ms.service;

import com.gritlabstudent.product.ms.config.ValidateProduct;
import com.gritlabstudent.product.ms.exceptions.ProductCollectionException;
import com.gritlabstudent.product.ms.models.Product;
import com.gritlabstudent.product.ms.repositories.ProductRepository;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
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
}
