package com.gritlabstudent.media.ms.repositories;

import com.gritlabstudent.media.ms.models.Media;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends MongoRepository<Media, String> {
    List<Media> findByProductId(String productId);

    void deleteByProductId(String productId);

    @Query("{'userId': ?0}")
    List<Media> findByUserId(String userId);
}