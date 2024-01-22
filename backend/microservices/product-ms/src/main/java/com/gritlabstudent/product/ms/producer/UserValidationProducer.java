package com.gritlabstudent.product.ms.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserValidationProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public UserValidationProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendUserIdForValidation(String requestId, String userId) {
        kafkaTemplate.send("validate-user-topic", requestId, userId);
    }

}