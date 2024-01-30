package com.gritlabstudent.product.ms.producer;

import com.gritlabstudent.shared.ms.dtos.SellerGainMessageDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class SellerGainProducer {

    private final KafkaTemplate<String, SellerGainMessageDTO> kafkaTemplate;

    @Autowired
    public SellerGainProducer(@Qualifier("dtoKafkaTemplate") KafkaTemplate<String, SellerGainMessageDTO> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendSellerGain(String userId, BigDecimal gain) {
        SellerGainMessageDTO message = new SellerGainMessageDTO(userId, gain);
        kafkaTemplate.send("seller-gain-topic", userId, message);
    }
}

