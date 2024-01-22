package com.gritlabstudent.product.ms.repositories;

import com.gritlabstudent.product.ms.models.ProductCreationRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCreationRequestRepository extends MongoRepository<ProductCreationRequest, String> {
    // You can define custom database queries here if needed
}
