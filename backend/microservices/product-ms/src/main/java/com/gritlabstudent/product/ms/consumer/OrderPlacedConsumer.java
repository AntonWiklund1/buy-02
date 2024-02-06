package com.gritlabstudent.product.ms.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gritlabstudent.product.ms.exceptions.ProductCollectionException;
import com.gritlabstudent.product.ms.models.OrderDTO;
import com.gritlabstudent.product.ms.service.ProductService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class OrderPlacedConsumer {

    private final ProductService productService;
    private final ObjectMapper objectMapper;

    private static final Logger logger = LoggerFactory.getLogger(OrderPlacedConsumer.class);

    @Autowired
    public OrderPlacedConsumer(ProductService productService, ObjectMapper objectMapper) {
        this.productService = productService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "order-placed-topic", groupId = "product-ms-group")
    public void consumeOrderPlacedEvent(ConsumerRecord<String, String> consumerRecord) {
        String orderJson = consumerRecord.value();
        try {
            // Deserialize the JSON string to an Order object
            OrderDTO order = objectMapper.readValue(orderJson, OrderDTO.class);

            // Perform the business logic with the deserialized order object
            productService.processOrder(order);
        } catch (IOException e) {
            // Log the exception
            logger.error("Error deserializing order JSON: " + e.getMessage(), e);

            // Handle the exception properly, which may include sending an error message or taking corrective action
        }
    }
}

