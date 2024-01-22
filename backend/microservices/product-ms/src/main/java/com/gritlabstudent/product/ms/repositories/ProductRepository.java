package com.gritlabstudent.product.ms.repositories;

import com.gritlabstudent.product.ms.models.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    @Query("{'id': ?0}")
    Optional<Product> findByProduct(Product product);

    @Query("{'userId': ?0}")
    List<Product> findByUserId(String userId);

}