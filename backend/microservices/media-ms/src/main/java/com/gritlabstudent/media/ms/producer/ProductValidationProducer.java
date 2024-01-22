package com.gritlabstudent.media.ms.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ProductValidationProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public ProductValidationProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendProductForValidation(String productId, String uploadRequestId) {
        System.out.println("Sending validation request for Product ID: " + productId + " with Upload Request ID: " + uploadRequestId);
        kafkaTemplate.send("validate-product-topic", productId, uploadRequestId);
    }

}
