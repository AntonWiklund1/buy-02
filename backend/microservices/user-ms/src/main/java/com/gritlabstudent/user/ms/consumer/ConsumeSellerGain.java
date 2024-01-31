package com.gritlabstudent.user.ms.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gritlabstudent.user.ms.services.UserService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;

@Service
public class ConsumeSellerGain {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    public ConsumeSellerGain(UserService userService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "seller-gain-topic", groupId = "user-ms-group")
    public void consumeSellerGain(String messageJson) {
        try {
            Map<String, String> message = objectMapper.readValue(messageJson, new TypeReference<Map<String, String>>() {});
            String userId = message.get("userId");
            String gainStr = message.get("gain");
            BigDecimal gain = new BigDecimal(gainStr);

            userService.updateSellerEarnings(userId, gain);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
