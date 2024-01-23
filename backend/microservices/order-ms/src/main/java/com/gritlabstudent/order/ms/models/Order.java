package com.gritlabstudent.order.ms.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
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
    @NotNull(message = "User ID is required")
    private String userId;

    @NotNull(message = "Product IDs are required")
    private List<String> productIds;

    @PastOrPresent(message = "The created date cannot be in the future")
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private Date createdAt;

    @PastOrPresent(message = "The created date cannot be in the future")
    @JsonFormat(pattern="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private Date updatedAt;

    @NotNull(message = "Payment status cannot be null")
    private Boolean isPaid;

    @NotNull(message = "Delivery status cannot be null")
    private Boolean isDelivered;

    @NotNull(message = "Order status cannot be null")
    private Status status;
}