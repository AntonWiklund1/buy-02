package com.gritlabstudent.order.ms.services;

import com.gritlabstudent.order.ms.models.ProductDTO;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ProductServiceImpl implements ProductService {

    private final RestTemplate restTemplate;
    private final String productMsBaseUrl;

    public ProductServiceImpl(RestTemplateBuilder restTemplateBuilder, @Value("${productms.baseurl}") String productMsBaseUrl) {
        this.restTemplate = restTemplateBuilder.build();
        this.productMsBaseUrl = productMsBaseUrl;
    }

    @Override
    public ProductDTO getProductById(String productId) {
        ResponseEntity<ProductDTO> response =
                restTemplate.getForEntity(productMsBaseUrl + "/products/" + productId, ProductDTO.class);
        return response.getBody();
    }
}
