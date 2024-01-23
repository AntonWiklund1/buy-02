package com.gritlabstudent.order.ms.services;

import com.gritlabstudent.order.ms.models.Order;
import com.gritlabstudent.order.ms.models.Status;
import com.gritlabstudent.order.ms.producers.OrderValidationProducer;
import com.gritlabstudent.order.ms.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderValidationProducer orderValidationProducer;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderValidationProducer orderValidationProducer) {
        this.orderRepository = orderRepository;
        this.orderValidationProducer = orderValidationProducer;
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

    public Order updateOrder(String id, Order order) {
        Order orderToUpdate = orderRepository.findById(id).orElse(null);
        if (orderToUpdate == null) {
            return null;
        }

        orderToUpdate.setUserId(order.getUserId());
        orderToUpdate.setProductIds(order.getProductIds());
        orderToUpdate.setUpdatedAt(new Date());
        orderToUpdate.setStatus(order.getStatus());
        return orderRepository.save(orderToUpdate);
    }

    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }

    public void deleteOrdersByUserId(String userId) {
        orderRepository.deleteByUserId(userId);
    }

    public void buyProducts(String orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return;
        }
        order.setStatus(Status.PENDING);
        order.setUpdatedAt(new Date());
        orderRepository.save(order);
    }
}
