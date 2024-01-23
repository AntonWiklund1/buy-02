package com.gritlabstudent.order.ms.services;

import com.gritlabstudent.order.ms.models.Order;
import com.gritlabstudent.order.ms.models.Status;
import com.gritlabstudent.order.ms.repositories.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final OrderRepository orderRepository;

    public DatabaseSeeder(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (orderRepository.count() == 0) {
            // Create and save a few orders
            Order order1 = Order.builder()
                    .userId("1")
                    .productIds(Arrays.asList("p2", "p3"))
                    .createdAt(new Date())
                    .updatedAt(new Date())
                    .isPaid(false)
                    .isDelivered(false)
                    .status(Status.CREATED)
                    .build();

            orderRepository.save(order1);
        }
    }
}
