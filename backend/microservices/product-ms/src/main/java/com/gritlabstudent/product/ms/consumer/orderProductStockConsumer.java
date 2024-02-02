package com.gritlabstudent.product.ms.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gritlabstudent.product.ms.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class orderProductStockConsumer {

    private final ProductService productService;
    private final ObjectMapper objectMapper;


    @Autowired
    public orderProductStockConsumer(ProductService productService, ObjectMapper objectMapper) {
        this.productService = productService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "order-product-stock-topic", groupId = "product-ms-group")
    public void consumeOrderProductStockEvent(String order) {
        System.out.println("Consuming order-product-stock-topic");
        productService.checkInStock(order);
    }


}
