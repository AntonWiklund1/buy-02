package com.gritlabstudent.order.ms.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gritlabstudent.order.ms.models.Order;
import com.gritlabstudent.order.ms.models.ProductDTO;
import com.gritlabstudent.order.ms.models.Status;
import com.gritlabstudent.order.ms.models.UserDTO;
import com.gritlabstudent.order.ms.producers.OrderPlacedProducer;
import com.gritlabstudent.order.ms.producers.OrderProductStockProducer;
import com.gritlabstudent.order.ms.producers.OrderValidationProducer;
import com.gritlabstudent.order.ms.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService; // Correctly autowired

    private final UserService userService; // Correctly autowired

    private final OrderPlacedProducer orderPlacedProducer; // Autowired producer

    private final OrderProductStockProducer orderProductStockProducer; // Autowired producer

    // Include ProductService in the constructor parameters
    @Autowired
    public OrderService(OrderRepository orderRepository, ProductService productService, UserService UserService, OrderPlacedProducer orderPlacedProducer, OrderProductStockProducer orderProductStockProducer) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.userService = UserService;
        this.orderPlacedProducer = orderPlacedProducer;
        this.orderProductStockProducer = orderProductStockProducer;
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



    public void addProductToOrder(String orderId, String productId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return;
        }
        order.getProductIds().add(productId);
        order.setUpdatedAt(new Date());
        orderRepository.save(order);
    }

    public void removeProductFromOrder(String orderId, String productId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return;
        }
        order.getProductIds().remove(productId);
        order.setUpdatedAt(new Date());
        orderRepository.save(order);
    }


    //Add product to cart and create a new cart if one does not exist
    public void addProductToCart(String userId, String productId) {
        // Find the existing order which acts as the cart for this user
        Order cartOrder = orderRepository.findByUserIdAndIsInCartTrue(userId);

        if (cartOrder != null) {
            cartOrder.getProductIds().add(productId);
            cartOrder.setUpdatedAt(new Date());
            orderRepository.save(cartOrder);
        } else {
            // Create a new order as a cart and add the product to it
            Order newOrder = Order.builder()
                    .userId(userId)
                    .productIds(new ArrayList<>(Collections.singletonList(productId)))
                    .createdAt(new Date())
                    .updatedAt(new Date())
                    .status(Status.CART) // Assuming Status.CART represents a cart state
                    .isInCart(true)
                    .build();
            orderRepository.save(newOrder);
        }
    }
    public void buyProducts(String orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return;
        }
        try {
            // Properly convert order to JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String orderJson = objectMapper.writeValueAsString(order);

            orderProductStockProducer.sendOrderProductStock(order.getId(), orderJson);

        } catch (JsonProcessingException e) {
            // Handle JSON serialization error
            e.printStackTrace();
        }
    }

    public BigDecimal calculateOrderTotal(String orderId) {
        // Retrieve the order by ID
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        // Sum the total cost of the products in the order
        BigDecimal total = BigDecimal.ZERO;
        for (String productId : order.getProductIds()) {
            // Fetch the product details, such as price, from the product service
            ProductDTO product = productService.getProductById(productId);

            // Calculate the total cost for the product
            BigDecimal productTotal = product.getPrice(); // Assuming each product is only one quantity
            total = total.add(productTotal);
        }

        // Update the order with the total cost
        order.setTotal(total);
        orderRepository.save(order);

        return total;
    }


    //add the OrderTotal to the user totalAmountSpent
    public void processOrder(String orderId, BigDecimal total) {
        Order order = getOrderById(orderId);
        userService.updateUserTotalAmount(order.getUserId(), total);
        // additional order processing logic...
    }


    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public void cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return;
        }
        order.setStatus(Status.CANCELLED);
        order.setUpdatedAt(new Date());
        orderRepository.save(order);
    }

    public String redoOrder(String orderId) {
        //copy order with new id and status and make a new order
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return "Didnt find old order";
        }
        Order newOrder = Order.builder()
                .userId(order.getUserId())
                .productIds(order.getProductIds())
                .createdAt(new Date())
                .updatedAt(new Date())
                .isInCart(false)
                .status(Status.PENDING)
                .build();
        orderRepository.save(newOrder);
        buyProducts(newOrder.getId());
        return newOrder.getId();
    }
}
