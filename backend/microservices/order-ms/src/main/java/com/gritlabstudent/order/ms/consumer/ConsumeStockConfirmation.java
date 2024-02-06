package com.gritlabstudent.order.ms.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gritlabstudent.order.ms.models.Order;
import com.gritlabstudent.order.ms.producers.OrderPlacedProducer;
import com.gritlabstudent.order.ms.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class ConsumeStockConfirmation {

    private final OrderService orderService;

    private final OrderPlacedProducer orderPlacedProducer;

    private static final Logger logger = LoggerFactory.getLogger(ConsumeStockConfirmation.class);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ConsumeStockConfirmation(OrderService orderService, SimpMessagingTemplate messagingTemplate, OrderPlacedProducer orderPlacedProducer) {
        this.orderService = orderService;
        this.messagingTemplate = messagingTemplate;
        this.orderPlacedProducer = orderPlacedProducer;
    }

    @KafkaListener(topics = "stock-confirmation-topic", groupId = "order-service-group")
    public void listenToStockConfirmation(String message) {
        String[] parts = message.split(":");
        if (parts.length >= 2) {
            String orderId = parts[0];
            String status = parts[1];
            if ("CONFIRMED".equals(status)) {
                try {
                    // Get the order object by ID
                    Order order = orderService.getOrderById(orderId);
                    // Properly convert order object to JSON string
                    String orderJson = objectMapper.writeValueAsString(order);

                    logger.info("Order confirmed: {}", orderId);
                    logger.info("Order details: {}", orderJson);
                    orderPlacedProducer.sendOrderPlaced(orderId, orderJson);

                    messagingTemplate.convertAndSend("/topic/orderUpdate", "Order confirmed: " + orderId);
                    System.out.println("Order confirmed: " + orderId);
                } catch (JsonProcessingException e) {
                    logger.error("Error serializing order to JSON", e);
                }
            } else if ("DENIED".equals(status)) {
                messagingTemplate.convertAndSend("/topic/orderUpdate", "Order denied: " + orderId);
                System.out.println("Order denied: " + orderId);
            } else {
                logger.error("The message does not have the expected format: {}", message);
            }
        } else {
            System.out.println("Unknown status received in stock confirmation: ");
        }
    }
}
