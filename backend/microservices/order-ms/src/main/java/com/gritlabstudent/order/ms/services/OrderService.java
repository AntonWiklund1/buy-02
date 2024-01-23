package com.gritlabstudent.order.ms.services;

import com.gritlabstudent.order.ms.models.Order;
import com.gritlabstudent.order.ms.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getOrdersByUserId(String userId) {
        // Assuming you have a custom method in your repository to find by userId
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order createOrder(Order order) {
        order.setCreatedAt(new Date());
        order.setUpdatedAt(new Date());
        return orderRepository.save(order);
    }
}
