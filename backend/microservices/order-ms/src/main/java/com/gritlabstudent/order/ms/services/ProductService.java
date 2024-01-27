package com.gritlabstudent.order.ms.services;

import com.gritlabstudent.order.ms.models.ProductDTO;
public interface ProductService {
    ProductDTO getProductById(String productId);
}
