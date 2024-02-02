package com.gritlabstudent.order.ms.producers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderProductStockProducer {
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public void orderProductStockProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrderProductStock(String requestId, String Order) {
        System.out.println("Producing order-product-stock-topic");
        kafkaTemplate.send("order-product-stock-topic", requestId, Order);
    }
}
