package com.gritlabstudent.order.ms.repositories;

import com.gritlabstudent.order.ms.models.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByUserId(String userId);

    void deleteByUserId(String userId);
}
