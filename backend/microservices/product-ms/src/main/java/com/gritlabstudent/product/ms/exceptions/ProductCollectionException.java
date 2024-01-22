package com.gritlabstudent.product.ms.exceptions;

import java.io.Serial;

public class ProductCollectionException extends Exception {
    @Serial
    private static final long serialVersionUID = 1L;

    public ProductCollectionException(String message) {
        super(message);
    }

    public static String NotFoundException(String id) {
        return "Product with " + id + " not found!";
    }

    public static String ProductAlreadyExistException() {
        return "Product already exist!";
    }

    public static String NoChangesMadeException() {
        return "No changes to update!";
    }

    public static String UserNotFoundException() {
        return "User not found!";
    }

    public static String NullException() {
        return " cannot be empty!";
    }
}