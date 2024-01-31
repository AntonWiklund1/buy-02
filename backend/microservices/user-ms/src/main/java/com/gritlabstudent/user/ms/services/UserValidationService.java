package com.gritlabstudent.user.ms.services;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserValidationService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final UserService userService;

    public UserValidationService(KafkaTemplate<String, String> kafkaTemplate, UserService userService) {
        this.kafkaTemplate = kafkaTemplate;
        this.userService = userService;
    }

    @KafkaListener(topics = "validate-user-topic", groupId = "user_validation_group")
    public void listenForUserValidation(ConsumerRecord<String, String> record) {
        String requestId = record.key(); // This is the ProductCreationRequest ID
        String userId = record.value(); // This is the User ID
        System.out.println("Received record with key: " + requestId + ", and value: " + userId);

        boolean isValidUser = userService.checkUserExistence(userId);
        // Send back the validation result with the requestId as the key
        kafkaTemplate.send("user-validation-result-topic", requestId, String.valueOf(isValidUser));
    }
}
