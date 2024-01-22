package com.gritlabstudent.product.ms.models;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;

    @NotBlank(message = "Product name cannot be empty")
    private String name;

    @NotBlank(message = "Product description cannot be empty")
    private String description;

    @NotNull(message = "Product price cannot be null")
    @DecimalMin(value = "0.0", message = "Product price must be greater than or equal to 0")
    private Double price;

    @NotNull(message = "Product quantity cannot be null")
    @Min(value = 0, message = "Product quantity must be greater than or equal to 0")
    private int quantity;

    @NotBlank(message = "Product userId cannot be empty")
    private String userId;

    public void setUserId(String userId) {
        // Trim the userId before setting it
        this.userId = userId != null ? userId.trim() : null;
    }

    public String uuidGenerator() {
        // Implement logic to generate a unique product ID, e.g., using UUID
        return UUID.randomUUID().toString();
    }

    // Getters and Setters
    public void setProductid(String id) {
        this.id = id;
    }

    public String getProductId() {
        return id;
    }

}