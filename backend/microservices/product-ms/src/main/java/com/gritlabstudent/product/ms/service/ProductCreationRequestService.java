package com.gritlabstudent.product.ms.service;

import com.gritlabstudent.product.ms.models.ProductCreationRequest;
import com.gritlabstudent.product.ms.repositories.ProductCreationRequestRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductCreationRequestService {

    private final ProductCreationRequestRepository repository;

    public ProductCreationRequestService(ProductCreationRequestRepository repository) {
        this.repository = repository;
    }

    public ProductCreationRequest saveRequest(ProductCreationRequest request) {
        ProductCreationRequest savedRequest = repository.save(request);
        System.out.println("Saved ProductCreationRequest with ID: " + savedRequest.getId());
        return savedRequest;
    }

    public Optional<ProductCreationRequest> getRequestById(String id) {
        System.out.println("Fetching ProductCreationRequest with ID: " + id);
        return repository.findById(id);
    }

}
