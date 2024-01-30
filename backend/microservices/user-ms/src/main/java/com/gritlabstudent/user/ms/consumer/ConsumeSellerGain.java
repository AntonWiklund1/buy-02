package com.gritlabstudent.user.ms.consumer;

import com.gritlabstudent.user.ms.services.UserService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.gritlabstudent.shared.ms.dtos.SellerGainMessageDTO;

@Service
public class ConsumeSellerGain {

    private final UserService userService;

    public ConsumeSellerGain(UserService userService) {
        this.userService = userService;
    }

    @KafkaListener(topics = "seller-gain-topic", groupId = "user-ms-group")
    public void consumeSellerGain(SellerGainMessageDTO message) {
        try {
            userService.updateSellerEarnings(message.getUserId(), message.getGain());
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
