package com.gritlabstudent.order.ms.models;

import lombok.Data;

import java.math.BigDecimal;


@Data
public class ProductDTO {
    private String id;
    private String name;
    private BigDecimal price;
    // ... other product properties as needed

    // Getters and setters
}
