package com.gritlabstudent.order.ms.consumer;

import com.gritlabstudent.order.ms.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class ConsumeStockConfirmation {

    private final OrderService orderService;

    private static final Logger logger = LoggerFactory.getLogger(ConsumeStockConfirmation.class);

    @Autowired
    public ConsumeStockConfirmation(OrderService orderService) {
        this.orderService = orderService;
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
            // Process the confirmed stock
            //orderService.processConfirmedOrder(orderId);
        } else if ("DENIED".equals(status)) {
            System.out.println("Order denied: " + orderId);
            // Handle the denied stock
        } else {
            // Handle the case where the message does not have the expected format
            logger.error("The message does not have the expected format: {}", message);
        }
        } else {
            // Handle unknown status
            System.out.println("Unknown status received in stock confirmation: ");
        }
    }
}
