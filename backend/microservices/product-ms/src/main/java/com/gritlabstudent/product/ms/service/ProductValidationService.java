package com.gritlabstudent.product.ms.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;


@Service
public class ProductValidationService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    // Assume ProductService is a class that contains the method to check product existence.
    @Autowired
    private ProductService productService;

    @KafkaListener(topics = "validate-product-topic", groupId = "product_validation_group")
    public void listenForProduct(ConsumerRecord<String, String> record) {
        String productId = record.key(); // This should be the productId

        // Implement the logic to check if the product exists.
        boolean isValid = productService.checkProductExists(productId);

        if (isValid){
            System.out.println("Product ID is valid: " + productId);
        } else {
            System.out.println("Product ID is invalid: " + productId);
        }

        // Construct a message. This could be a simple String or a more complex object serialized to JSON.
        String validationResponse = isValid ? "Product ID valid" : "Product ID invalid";
        System.out.println("Sending validation response for Product ID: " + productId + " with result: " + validationResponse);
        // Send the validation response.
        kafkaTemplate.send("product-validation-result-topic", productId, validationResponse);

    }
}
