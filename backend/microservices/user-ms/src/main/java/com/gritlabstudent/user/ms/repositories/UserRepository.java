package com.gritlabstudent.user.ms.repositories;

import com.gritlabstudent.user.ms.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByName(String username);

    Optional<User> findByEmail(String email);

    // get all emails from the database
    default List<String> findAllEmails() {
        return findAll().stream().map(User::getEmail).collect(Collectors.toList());
    }
}
