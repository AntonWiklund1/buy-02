package com.gritlabstudent.order.ms.controller;

import com.gritlabstudent.order.ms.models.Order;
import com.gritlabstudent.order.ms.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable String userId) {
        return orderService.getOrdersByUserId(userId);
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable String id) {
        return orderService.getOrderById(id);
    }

    @PostMapping("/")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody Order order) {
        Order newOrder = orderService.createOrder(order);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable String id, @Valid @RequestBody Order order) {
        Order updatedOrder = orderService.updateOrder(id, order);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<String> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return new ResponseEntity<>("Order deleted successfully", HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<String> deleteOrdersByUserId(@PathVariable String userId) {
        orderService.deleteOrdersByUserId(userId);
        return new ResponseEntity<>("Orders deleted successfully", HttpStatus.OK);
    }

    @PostMapping("/buy/{orderId}")
    public ResponseEntity<String> buyProducts(@PathVariable String orderId) {
        orderService.buyProducts(orderId);
        return new ResponseEntity<>("Products bought successfully: " + orderId, HttpStatus.OK);
    }

    @PostMapping("/{orderId}/{productId}")
    public ResponseEntity<String> addProductToOrder(@PathVariable String orderId, @PathVariable String productId) {
        orderService.addProductToOrder(orderId, productId);
        return new ResponseEntity<>("Product added successfully: " + productId, HttpStatus.OK);
    }

    @PostMapping("/{userId}/cart/{productId}")
    public ResponseEntity<String> addProductToCart(@PathVariable String userId, @PathVariable String productId) {
        orderService.addProductToCart(userId, productId);
        return new ResponseEntity<>("Product added successfully to the cart for user: " + userId, HttpStatus.OK);
    }


    @DeleteMapping("/{orderId}/{productId}")
    public ResponseEntity<String> removeProductFromOrder(@PathVariable String orderId, @PathVariable String productId) {
        orderService.removeProductFromOrder(orderId, productId);
        return new ResponseEntity<>("Product removed successfully: " + productId, HttpStatus.OK);
    }
}
