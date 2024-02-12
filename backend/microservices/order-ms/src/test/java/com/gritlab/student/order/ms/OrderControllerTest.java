package com.gritlab.student.order.ms;

import com.gritlabstudent.order.ms.controller.OrderController;
import com.gritlabstudent.order.ms.models.Order;
import com.gritlabstudent.order.ms.models.Status;
import com.gritlabstudent.order.ms.services.OrderService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Date;

@RunWith(SpringRunner.class)
public class OrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(orderController).build();
    }

    @Test
    public void test_CreateOrder_ReturnsCreated() throws Exception {
        // Given
        Order orderDTO = new Order("1", "user-id", Arrays.asList("product1", "product2"), new Date(), new Date(), Status.CREATED, false, BigDecimal.TEN);
        when(orderService.createOrder(any(Order.class))).thenReturn(orderDTO);

        Order inputOrder = Order.builder()
                .userId("user-id")
                .productIds(Arrays.asList("product1", "product2"))
                .createdAt(new Date())
                .status(Status.CREATED)
                .isInCart(false)
                .total(BigDecimal.TEN)
                .build();

        ObjectMapper objectMapper = new ObjectMapper();
        String orderJson = objectMapper.writeValueAsString(inputOrder);

        // When & Then
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(orderJson))
                .andExpect(status().isCreated());
    }
}