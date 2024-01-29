package com.gritlabstudent.user.ms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gritlabstudent.user.ms.exceptions.UserCollectionException;
import com.gritlabstudent.user.ms.models.AmountDTO;
import com.gritlabstudent.user.ms.models.User;
import com.gritlabstudent.user.ms.models.UserDTO;
import com.gritlabstudent.user.ms.services.KafkaService;
import com.gritlabstudent.user.ms.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/users") // The base URL for this controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    private KafkaService KafkaService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        try {
            System.out.println("we are here User: " + user);
            userService.createUser(user);
            var userDTO = userService.getUserById(user.getId());
            return new ResponseEntity<UserDTO>(userDTO, HttpStatus.CREATED);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (UserCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred", HttpStatus.BAD_REQUEST);
        }
    }

    private String convertUserToJson(User user) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(user);
        } catch (IOException e) {
            // Handle the exception, maybe log it and/or throw a custom exception
            e.printStackTrace();
            return null;
        }
    }

    // Read All Users
    @GetMapping
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_SELLER')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Read User by Id
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_SELLER')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        UserDTO userDTO = userService.getUserById(id);
        if (userDTO != null) {
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Update User
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER') or hasRole('ROLE_CLIENT')")
    public ResponseEntity<?> updateUserById(@PathVariable("id") String id, @RequestBody User user) {
        if (user.getRole().equals("ROLE_CLIENT")) {
            String userId = user.getId();
            if (!userId.equals(id)) {
                return new ResponseEntity<>("You can only update your own profile", HttpStatus.UNAUTHORIZED);
            }
        }
        try {
            userService.updateUser(id, user);
            return new ResponseEntity<>("Update User with id " + id, HttpStatus.OK);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete User
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_SELLER') or hasRole('ROLE_CLIENT')")
    public ResponseEntity<?> deleteUserById(@PathVariable("id") String id) {
        UserDTO userDTO = userService.getUserById(id);
        if (userDTO != null) {
            String role = userDTO.getRole();
            if (role.equals("ROLE_CLIENT")) {
                String userId = userDTO.getId();
                if (!userId.equals(id)) {
                    return new ResponseEntity<>("You can only delete your own profile", HttpStatus.UNAUTHORIZED);
                }
            }
        }
        try {
            userService.deleteUser(id);
            String topic = "user_deletion";
            String payload = id;
            KafkaService.sendToTopic(topic, payload);
            return new ResponseEntity<>("Successfully deleted user with id " + id, HttpStatus.OK);
        } catch (UserCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/avatar")
    @PreAuthorize("hasRole('ROLE_SELLER')")
    public ResponseEntity<?> uploadAvatar(@PathVariable String id, @RequestParam("avatar") MultipartFile avatarFile) {
        // Validate file size
        final long MAX_SIZE = 2 * 1024 * 1024; // 2 MB
        if (avatarFile.getSize() > MAX_SIZE) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body("File size should not exceed 2 MB");
        }

        // Validate MIME type to only allow image uploads
        String mimeType = avatarFile.getContentType();
        if (mimeType == null || !mimeType.startsWith("image")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body("Only image files are allowed");
        }

        // If file size and MIME type are valid, proceed with upload
        try {
            String avatarUrl = userService.uploadUserAvatar(id, avatarFile);
            // Assuming `uploadUserAvatar` returns the URL to the uploaded avatar
            return ResponseEntity.ok(avatarUrl); // Return the URL in the response body

        } catch (IOException e) {
            return new ResponseEntity<>("Could not upload the file: " + avatarFile.getOriginalFilename(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (UserCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/avatar")
    @PreAuthorize("hasRole('ROLE_SELLER') or hasRole('ROLE_CLIENT')")
    public ResponseEntity<?> getUserAvatar(@PathVariable String id) {
        try {
            UserDTO userDTO = userService.getUserById(id); // This method returns a UserDTO
            if (userDTO != null) {
                String avatarPath = userDTO.getAvatarImagePath();
                if (avatarPath != null && !avatarPath.isEmpty()) {
                    return ResponseEntity.ok().body(avatarPath);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Avatar not set for user");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the avatar path");
        }
    }

    //update total amount spent
    @PostMapping("/{id}/updateTotalAmount")
    public ResponseEntity<?> updateUserTotalAmount(@PathVariable String id, @RequestBody AmountDTO amountDTO) {
        try {
            userService.updateUserTotalAmount(id, amountDTO.getAmount());
            return new ResponseEntity<>("Update User with id " + id, HttpStatus.OK);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
