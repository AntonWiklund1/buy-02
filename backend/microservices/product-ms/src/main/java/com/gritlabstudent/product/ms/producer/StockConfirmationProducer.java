package com.gritlabstudent.product.ms.producer;

import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class StockConfirmationProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public StockConfirmationProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendStockConfirmation(String orderId, String status) {
        String message = orderId + ":" + status;
        kafkaTemplate.send("stock-confirmation-topic", message);
    }
}
