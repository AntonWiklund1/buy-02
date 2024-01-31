package com.gritlabstudent.product.ms.producer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class SellerGainProducer {

    private final KafkaTemplate<String, Map<String, String>> kafkaTemplate;

    @Autowired
    public SellerGainProducer(KafkaTemplate<String, Map<String, String>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendSellerGain(String userId, BigDecimal gain) {
        Map<String, String> message = new HashMap<>();
        message.put("userId", userId);
        message.put("gain", gain.toString());
        kafkaTemplate.send("seller-gain-topic", message);
    }
}
