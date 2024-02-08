package com.gritlabstudent.media.ms.service;

import com.gritlabstudent.media.ms.models.Media;
import com.gritlabstudent.media.ms.repositories.MediaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class MediaService {
    private static final Logger log = LoggerFactory.getLogger(MediaService.class);

    @Autowired
    private MediaRepository mediaRepository;


    private final Path rootLocation;

    public MediaService(@Value("${media.storage.location}") String storageLocation) {

        this.rootLocation = Paths.get(storageLocation.replace("file:", ""));
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }
    public Media storeFile(MultipartFile file, String productId) throws IOException {

        deleteMediaByProductId(productId);
        // Generate a unique file name using UUID
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID() + fileExtension;

        // Store the file on the server with the new unique file name
        Files.copy(file.getInputStream(), this.rootLocation.resolve(uniqueFileName));

        // Create a new media object and save it to the database
        Media media = new Media();
        media.setImagePath(this.rootLocation.resolve(uniqueFileName).toString());
        media.setProductId(productId);

        return mediaRepository.save(media);
    }

    // get media by product id
    public List<Media> getMediaByProductId(String productId) {
        return mediaRepository.findByProductId(productId);
    }

    // delete media by product id
    public void deleteMediaByProductId(String productId) {
        // Find all media entries for the product ID
        List<Media> mediaFiles = mediaRepository.findByProductId(productId);
    
        // Loop through the media files and delete each one
        for (Media media : mediaFiles) {
            Path fileToDeletePath = rootLocation.resolve(media.getImagePath().replace("media/", ""));
            try {
                Files.deleteIfExists(fileToDeletePath);
                // Log the deletion
                log.info("Deleted file: " + fileToDeletePath);
            } catch (IOException e) {
                // Log any errors
                log.error("Failed to delete file: " + fileToDeletePath, e);
            }
        }
    
        // Now delete the records from the database
        mediaRepository.deleteByProductId(productId);
    }

    // download media by product id
    public Path downloadMediaByProductId(String productId) throws FileNotFoundException, MalformedURLException {
        List<Media> mediaFiles = mediaRepository.findByProductId(productId);

        for (Media media : mediaFiles) {
            Path fileToDownloadPath = null;
            try {
                fileToDownloadPath = rootLocation.resolve(media.getImagePath().replace("media/", ""));
                log.info("Downloading file: " + fileToDownloadPath);
                return fileToDownloadPath;
            } catch (Exception e) {
                log.error("Failed to download file: " + fileToDownloadPath, e);
            }

        }
        throw new FileNotFoundException("File not found");
    }

    public Iterable<Media> getMediaByUserId(String userId) {
        return mediaRepository.findByUserId(userId);
    }
    public void deleteMediaByUserId(String userId) {
        Iterable<Media> products = getMediaByUserId(userId);
        products.forEach(product -> mediaRepository.delete(product));
    }
}