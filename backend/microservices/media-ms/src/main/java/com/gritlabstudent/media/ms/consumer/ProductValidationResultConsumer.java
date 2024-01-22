package com.gritlabstudent.media.ms.consumer;

import com.gritlabstudent.media.ms.service.FileStorageService;
import com.gritlabstudent.media.ms.service.MediaService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
public class ProductValidationResultConsumer {

    private final Logger logger = LoggerFactory.getLogger(ProductValidationResultConsumer.class);

    // Autowired services
    private final FileStorageService fileStorageService;
    private final MediaService mediaService;

    // Constructor with autowired services
    public ProductValidationResultConsumer(FileStorageService fileStorageService, MediaService mediaService) {
        this.fileStorageService = fileStorageService;
        this.mediaService = mediaService;
    }

    @KafkaListener(topics = "product-validation-result-topic", groupId = "media_creation_group")
    public void receiveProductValidationResult(ConsumerRecord<String, String> record) {
        String productId = record.key();
        String validationResponse = record.value();
        logger.info("Received validation result for Product ID: {} with result: {}", productId, validationResponse);

        if ("Product ID valid".equals(validationResponse)) {
            try {
                Resource fileResource = fileStorageService.retrieveFile(productId);
                MultipartFile multipartFile = convertToMultipartFile(fileResource, productId);

                mediaService.storeFile(multipartFile, productId);
                logger.info("Successfully stored media for Product ID: {}", productId);

                // Optionally, clean up the temporary storage
                fileStorageService.clearTemporaryStorage(productId);
            } catch (Exception e) {
                logger.error("Failed to store media for Product ID: {}", productId, e);
            }
        } else {
            logger.warn("Product ID is invalid: {}", productId);
        }
    }

    private MultipartFile convertToMultipartFile(Resource resource, String fileName) throws IOException {
        try (InputStream inputStream = resource.getInputStream()) {
            return new MockMultipartFile(fileName, fileName, "contentType", inputStream);
        }
    }
}
