package com.gritlabstudent.product.ms.config;

import com.gritlabstudent.product.ms.exceptions.ProductCollectionException;
import com.gritlabstudent.product.ms.models.Product;

public class ValidateProduct {
    public static void validateProduct(Product product) throws ProductCollectionException {
        if (product.getName() != null) {
            product.setName(product.getName().trim());
            System.out.println("product name: " + product.getName());
        } else {
            throw new ProductCollectionException("Product name" + ProductCollectionException.NullException());
        }
        // if product.getDescription() is not null, trim, else throw exception
        if (product.getDescription() != null) {
            product.setDescription(product.getDescription().trim());
            System.out.println("product description: " + product.getDescription());
        } else {
            throw new ProductCollectionException("Product description" + ProductCollectionException.NullException());
        }
        // if product.getPrice() is not null, trim, else throw exception
        if (product.getUserId() != null) {
            product.setUserId(product.getUserId().trim()); // Trim the ID field as well
            System.out.println("product userId: " + product.getUserId());
        } else {
            throw new ProductCollectionException("Product userId" + ProductCollectionException.NullException());
        }
    }
}