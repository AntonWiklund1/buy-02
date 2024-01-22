package com.gritlabstudent.product.ms.consumer;

import com.gritlabstudent.product.ms.exceptions.ProductCollectionException;
import com.gritlabstudent.product.ms.models.Product;
import com.gritlabstudent.product.ms.models.ProductCreationRequest;
import com.gritlabstudent.product.ms.models.ProductCreationStatus;
import com.gritlabstudent.product.ms.service.ProductCreationRequestService;
import com.gritlabstudent.product.ms.service.ProductService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

//reads from the user-validation-result-topic topic
@Service
public class UserValidationResultConsumer {

    private final ProductService productService;
    private final ProductCreationRequestService productCreationRequestService;

    public UserValidationResultConsumer(ProductService productService,
            ProductCreationRequestService productCreationRequestService) {
        this.productService = productService;
        this.productCreationRequestService = productCreationRequestService;
    }

    @KafkaListener(topics = "user-validation-result-topic", groupId = "product_creation_group")
    public void receiveUserValidationResult(ConsumerRecord<String, String> record) throws ProductCollectionException {
        String requestId = record.key(); // This is the ProductCreationRequest ID
        String validationResponse = record.value(); // This should be the validation result, not user ID

        System.out.println("Received validation result for request ID: " + requestId);

        Optional<ProductCreationRequest> creationRequestOptional = productCreationRequestService
                .getRequestById(requestId);
        if (creationRequestOptional.isPresent()) {
            ProductCreationRequest creationRequest = creationRequestOptional.get();
            // Assuming validationResponse is "true" or "false" as a String
            boolean isValidUser = Boolean.parseBoolean(validationResponse);

            if (isValidUser) {
                // Validation successful, proceed with product creation
                Product product = creationRequest.getProduct();
                productService.createProduct(product);

                // Update the status of the product creation request to VALIDATED or COMPLETED
                creationRequest.setStatus(ProductCreationStatus.COMPLETED);
                productCreationRequestService.saveRequest(creationRequest);
            } else {
                // Validation failed, update the status accordingly
                creationRequest.setStatus(ProductCreationStatus.REJECTED);
                productCreationRequestService.saveRequest(creationRequest);

                System.out.println("User validation failed for request ID: " + requestId);
            }
        } else {
            System.out.println("Request ID not found: " + requestId);
        }
    }

}
