package com.gritlabstudent.product.ms.controller;

import com.gritlabstudent.product.ms.exceptions.ProductCollectionException;
import com.gritlabstudent.product.ms.models.Product;
import com.gritlabstudent.product.ms.models.ProductCreationRequest;
import com.gritlabstudent.product.ms.models.ProductCreationStatus;
import com.gritlabstudent.product.ms.producer.UserValidationProducer;
import com.gritlabstudent.product.ms.service.ProductCreationRequestService;
import com.gritlabstudent.product.ms.service.ProductService;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final UserValidationProducer userValidationProducer;
    private final ProductCreationRequestService productCreationRequestService;

    public ProductController(ProductService productService,
            UserValidationProducer userValidationProducer,
            ProductCreationRequestService productCreationRequestService) {
        this.productService = productService;
        this.userValidationProducer = userValidationProducer;
        this.productCreationRequestService = productCreationRequestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        // Generate UUID for the product ID
        String productId = product.uuidGenerator();
        product.setProductid(productId);

        // Create and save the product creation request
        ProductCreationRequest request = new ProductCreationRequest(product, ProductCreationStatus.PENDING_VALIDATION);
        request = productCreationRequestService.saveRequest(request);
        String requestId = request.getId();
        String userId = product.getUserId();

        // Send user ID for validation
        userValidationProducer.sendUserIdForValidation(requestId, userId);

        // Return a response with a status check URL and expected timeframe
        URI statusCheckUri = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/products/status/{requestId}")
                .buildAndExpand(requestId).toUri();

        Map<String, Object> response = new HashMap<>();
        response.put("productId", productId);
        response.put("message", "Product creation request received, pending user validation.");
        response.put("requestId", requestId);
        response.put("statusCheckUrl", statusCheckUri.toString());
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @GetMapping("/status/{requestId}")
    public ResponseEntity<?> checkProductCreationStatus(@PathVariable String requestId) {
        // Fetch the product creation request status from your service layer
        Optional<ProductCreationRequest> productCreationRequest = productCreationRequestService
                .getRequestById(requestId);

        if (productCreationRequest.isEmpty()) {
            // If the request ID does not exist, return a Not Found response
            return ResponseEntity.notFound().build();
        }

        // Assuming the ProductCreationRequest entity has a getStatus method
        ProductCreationStatus status = productCreationRequest.get().getStatus();

        // Build the response based on the status
        Map<String, Object> response = new HashMap<>();
        response.put("requestId", requestId);
        response.put("status", status);

        // You can also include additional information based on the status
        switch (status) {
            case PENDING_VALIDATION:
                response.put("message", "Your product creation request is pending validation.");
                break;
            case VALIDATED:
                response.put("message", "Your product creation request has been validated and is being processed.");
                break;
            case COMPLETED:
                response.put("message", "Your product has been successfully created.");
                // Include the product details if needed
                break;
            case REJECTED:
                response.put("message", "Your product creation request was rejected.");
                // Include rejection reasons if applicable
                break;
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping()
    public ResponseEntity<?> getAllProducts() {
        try {
            Iterable<Product> products = productService.getAllProducts();
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProductsByUser(@PathVariable String userId) {
        try {
            if (!isValidInput(userId)) {
                return new ResponseEntity<>("Invalid user ID", HttpStatus.BAD_REQUEST);
            }
            Iterable<Product> products = productService.getProductsByUserId(userId);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> updateProduct(@PathVariable("id") String id, @RequestBody Product product) {
        try {
            productService.updateProduct(id, product);
            return new ResponseEntity<>("Updated product with ID " + id, HttpStatus.OK);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") String id) {
        try {
            productService.deleteProduct(id);
            return new ResponseEntity<>("Successfully deleted product with ID " + id, HttpStatus.OK);
        } catch (ProductCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id") String id) {
        Product product = productService.getProductById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    private boolean isValidInput(String input) {
        return input != null && !input.isEmpty() && !input.contains("$") && !input.contains("{")
                && !input.contains("}");
    }

    @KafkaListener(topics = "user_deletion")
    public void listenUserDeletion(String userId) {
        try {
            productService.deleteProductsByUserId(userId);
        } catch (Exception e) {
            // for errors
        }
    }
}