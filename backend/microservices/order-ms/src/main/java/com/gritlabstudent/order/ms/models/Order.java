package com.gritlabstudent.order.ms.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

import java.util.Date;
import java.util.List;

@Document(collection = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Order {
    @Id
    private String id;
    @NotBlank(message = "User ID is required")
    private String userId;

    @Size(min = 1, message = "At least one product ID is required")
    private List<String> productIds;

    @PastOrPresent(message = "The created date cannot be in the future")
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private Date createdAt;

    @PastOrPresent(message = "The created date cannot be in the future")
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private Date updatedAt;

    @NotNull(message = "Order status cannot be null")
    private Status status;

    private Boolean isInCart;

    private BigDecimal total;
}