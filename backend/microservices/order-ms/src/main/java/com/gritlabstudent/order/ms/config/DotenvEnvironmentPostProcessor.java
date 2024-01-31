package com.gritlabstudent.order.ms.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String DOTENV_FILE_NAME = ".env";
    private static final String TARGET_DIRECTORY = "target";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Path rootPath = Paths.get("").toAbsolutePath(); // Current module root (media-ms)
        Path dotenvFilePath = rootPath.resolve(TARGET_DIRECTORY).resolve(DOTENV_FILE_NAME); // Path to .env in target directory

        if (Files.exists(dotenvFilePath)) {
            System.out.println("Loading .env file from: " + dotenvFilePath);
            FileSystemResource resource = new FileSystemResource(dotenvFilePath.toString());
            try {
                Properties dotenvProperties = PropertiesLoaderUtils.loadProperties(resource);
                environment.getPropertySources().addFirst(new PropertiesPropertySource("dotenvProperties", dotenvProperties));
            } catch (IOException e) {
                throw new RuntimeException("Could not load .env file from " + dotenvFilePath, e);
            }
        } else {
            System.out.println("Could not find .env file at: " + dotenvFilePath);
        }
    }
}

