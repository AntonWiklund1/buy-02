package com.gritlabstudent.order.ms.consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;

public class OrderValidationResultConsumer {
    @KafkaListener(topics = "validate-order-topic")
    public void validateOrder(ConsumerRecord<String, String> record) {
        String requestId = record.key();
        String order = record.value();
        System.out.println("Received order for validation with request ID: " + requestId);
        System.out.println("Order: " + order);

    }
}
