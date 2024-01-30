package com.gritlabstudent.order.ms.producers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderPlacedProducer {

    private KafkaTemplate<String, String> kafkaTemplate;


    @Autowired
    public void orderPlacedProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrderPlaced(String requestId, String Order) {
        kafkaTemplate.send("order-placed-topic", requestId, Order);
    }
}
