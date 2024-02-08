package com.gritlabstudent.media.ms.controller;

import com.gritlabstudent.media.ms.models.Media;
import com.gritlabstudent.media.ms.producer.ProductValidationProducer;
import com.gritlabstudent.media.ms.service.FileStorageService;
import com.gritlabstudent.media.ms.service.MediaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/media")
public class MediaController {
    @Autowired
    private MediaService mediaService;

    @Autowired
    private ProductValidationProducer productValidationProducer;

    @Autowired
    private FileStorageService fileStorageService;

    private static final Logger log = LoggerFactory.getLogger(MediaController.class);


    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ROLE_SELLER') ")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam("productId") String productId) {
        // Object to hold response data
        Map<String, String> response = new HashMap<>();

        // Check if the file is an image
        String contentType = file.getContentType();
        if (contentType != null && !contentType.startsWith("image/")) {
            response.put("error", "Invalid file type. Only image files are allowed.");
            return ResponseEntity.badRequest().body(response);
        }

        // Check if the file size exceeds 2 MB
        if (file.getSize() > 2097152) { // 2 MB in bytes
            response.put("error", "File size exceeds 2 MB");
            return ResponseEntity.badRequest().body(response);
        }

        // Temporarily store the file
        fileStorageService.storeFileTemporarily(productId, file);

        // Send productId to Kafka topic for validation
        String uploadRequestId = UUID.randomUUID().toString();
        fileStorageService.storeFileTemporarily(uploadRequestId, file);
        productValidationProducer.sendProductForValidation(productId, uploadRequestId);

        // Respond with an accepted status, actual storage will be done once validation is successful
        response.put("message", "File upload request received and is being processed.");
        return ResponseEntity.accepted().body(response);
    }


    // Other REST endpoints as needed

    // Inside MediaController.java
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Media>> getMediaForProduct(@PathVariable String productId) {
        List<Media> mediaFiles = mediaService.getMediaByProductId(productId);
        if (mediaFiles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(mediaFiles, HttpStatus.OK);
    }

    @DeleteMapping("/product/{productId}")
    @PreAuthorize("hasAuthority('ROLE_SELLER') ")
    public ResponseEntity<?> deleteMediaForProduct(@PathVariable String productId) {
        try {
            mediaService.deleteMediaByProductId(productId);
            String message = "Media deleted for the product with ID: " + productId;
            return ResponseEntity.ok().body(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred: " + e.getMessage());
        }
    }

    private final String mediaPath = Paths.get("media").toAbsolutePath().toString();

    @GetMapping("/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource file = new FileSystemResource(Paths.get(mediaPath, filename));
        if (!file.exists() || !file.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(file);
    }

    // serve files form /media/avatars
    @GetMapping("/avatars/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveAvatar(@PathVariable String filename) {
        Path filePath = Paths.get(mediaPath, "avatars", filename);
        log.info("Serving file: {}", filePath);
        Resource file = new FileSystemResource(filePath);
        if (!file.exists() || !file.isReadable()) {
            log.warn("File not found or not readable: {}", filePath);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(file);
    }

    @KafkaListener(topics = "product_deletion")
    public void listenUserDeletion(String id) {
        try {
            mediaService.deleteMediaByProductId(id);
        } catch (Exception e) {
        }
    }

}
