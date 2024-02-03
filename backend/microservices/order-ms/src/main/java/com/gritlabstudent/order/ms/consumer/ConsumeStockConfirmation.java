package com.gritlabstudent.order.ms.consumer;

import com.gritlabstudent.order.ms.models.OrderConfirmationMessage;
import com.gritlabstudent.order.ms.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class ConsumeStockConfirmation {

    private final SimpMessagingTemplate messagingTemplate;


    private static final Logger logger = LoggerFactory.getLogger(ConsumeStockConfirmation.class);

    @Autowired
    public ConsumeStockConfirmation(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "stock-confirmation-topic", groupId = "order-service-group")
    public void listenToStockConfirmation(String message) {
        // Assuming message is a simple String in format "orderId:status"
        String[] parts = message.split(":");
        if (parts.length >= 2) {
            String orderId = parts[0];
            String status = parts[1];
            // Process the message...
            if ("CONFIRMED".equals(status)) {
                System.out.println("Order confirmed: " + orderId);
                messagingTemplate.convertAndSend("/topic/order-confirmation", new OrderConfirmationMessage(orderId, "CONFIRMED"));
            } else if ("DENIED".equals(status)) {
                messagingTemplate.convertAndSend("/topic/order-confirmation", new OrderConfirmationMessage(orderId, "DENIED"));
                System.out.println("Order denied: " + orderId);
            } else {
                logger.error("The message does not have the expected format: {}", message);
            }
        } else {
            // Handle unknown status
            System.out.println("Unknown status received in stock confirmation: ");
        }
    }
}
