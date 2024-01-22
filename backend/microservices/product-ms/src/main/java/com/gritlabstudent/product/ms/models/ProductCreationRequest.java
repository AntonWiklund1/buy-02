package com.gritlabstudent.product.ms.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document
public class ProductCreationRequest {

    // This is the getId() method that your controller is calling
    @Setter
    @Id
    private String id;
    // This is the getProduct() method that your controller is calling
    private Product product;
    @Setter
    private ProductCreationStatus status;

    // Constructors, getters, and setters

    public ProductCreationRequest(Product product, ProductCreationStatus status) {
        this.product = product;
        this.status = status;
    }

    // ... other fields, constructors, getters and setters ...

    // ... other getters and setters ...
}
