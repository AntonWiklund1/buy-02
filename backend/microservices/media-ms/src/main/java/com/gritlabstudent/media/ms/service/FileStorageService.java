package com.gritlabstudent.media.ms.service;

import com.gritlabstudent.media.ms.exceptions.StorageException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {
    private final Path rootLocation = Paths.get("temp");

    public void storeFileTemporarily(String productId, MultipartFile file) {
        try {
            Path destinationFile = rootLocation.resolve(Paths.get(productId))
                    .normalize().toAbsolutePath();
            if (!destinationFile.getParent().equals(rootLocation.toAbsolutePath())) {
                // This is a security check
                throw new StorageException("Cannot store file outside current directory.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    public Resource retrieveFile(String productId) throws FileNotFoundException {
        try {
            Path file = rootLocation.resolve(productId);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new FileNotFoundException("Could not read file: " + productId);
            }
        } catch (MalformedURLException e) {
            throw new FileNotFoundException("Could not read file: " + productId + " - " + e.getMessage());
        }
    }


    // Method to clear the file from storage
    public void clearTemporaryStorage(String productId) {
        try {
            Path file = rootLocation.resolve(productId);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file.", e);
        }
    }
}

