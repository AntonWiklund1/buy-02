package com.gritlabstudent.order.ms;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
@SpringBootApplication
@EnableKafka
public class OrderMsApplication {
    public static void main(String[] args) {
        org.springframework.boot.SpringApplication.run(OrderMsApplication.class, args);
    }
}
