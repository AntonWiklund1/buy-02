package com.gritlabstudent.order.ms.producers;

import com.gritlabstudent.order.ms.models.Order;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderValidationProducer {
    private KafkaTemplate<String, String> kafkaTemplate;

    public void orderValidationProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrderForValidation(String requestId, String Order) {
        kafkaTemplate.send("validate-order-topic", requestId, Order);
    }
}
