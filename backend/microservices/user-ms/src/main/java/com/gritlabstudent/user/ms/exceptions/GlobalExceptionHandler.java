package com.gritlabstudent.user.ms.exceptions;

import com.mongodb.MongoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.validation.ConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = { ConstraintViolationException.class })
    public ResponseEntity<Object> handleConstraintViolationException(ConstraintViolationException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // @ExceptionHandler(value = { Exception.class })
    // public ResponseEntity<Object> handleOtherExceptions(Exception e) {
    // return new ResponseEntity<>("An error occurred", HttpStatus.BAD_REQUEST);
    // }
    @ExceptionHandler(MongoException.class)
    public ResponseEntity<String> handleMongoException(MongoException e) {
        // Log the exception for internal tracking.
        // You can use any logging framework here.
        System.err.println("MongoDB Error: " + e.getMessage());

        return new ResponseEntity<>("Service temporarily unavailable", HttpStatus.SERVICE_UNAVAILABLE);
    }
}
