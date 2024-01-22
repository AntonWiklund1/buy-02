package com.gritlabstudent.user.ms.controller;

import com.gritlabstudent.user.ms.models.AuthRequest;
import com.gritlabstudent.user.ms.models.AuthResponse;
import com.gritlabstudent.user.ms.models.User;
import com.gritlabstudent.user.ms.repositories.UserRepository;
import com.gritlabstudent.user.ms.services.JWTService;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Key;
import java.util.Base64;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Handles POST requests for user authentication. This method takes an authentication request,
     * validates the input, checks user credentials, and returns a JWT token upon successful authentication.
     *
     * @param authRequest The request body containing the username and password for authentication.
     * @return ResponseEntity with either an authentication token or an error message.
     */
    @PostMapping
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            // Validate input to ensure non-null and non-empty username and password
            if (authRequest.getUsername() == null || authRequest.getUsername().trim().isEmpty() ||
                    authRequest.getPassword() == null || authRequest.getPassword().trim().isEmpty()) {
                return new ResponseEntity<>("Invalid input", HttpStatus.BAD_REQUEST);
            }

            // Check if the user exists in the repository
            Optional<User> user = userRepository.findByName(authRequest.getUsername());
            if (user.isPresent()) {
                // Verify if the provided password matches the stored one
                if (passwordEncoder.matches(authRequest.getPassword(), user.get().getPassword())) {
                    // Generate JWT token for the authenticated user
                    String userId = user.get().getId();
                    String userRole = user.get().getRole(); // Assuming you have a getRole method
                    String token = jwtService.generateToken(user.get().getName(), userRole);
                    AuthResponse authResponse = new AuthResponse(userId, token);
                    return new ResponseEntity<>(authResponse, HttpStatus.OK);
                } else {
                    // Return error response if password does not match
                    return new ResponseEntity<>("Wrong password", HttpStatus.UNAUTHORIZED);
                }
            } else {
                // Return error response if user is not found
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // Log the exception for debugging
            e.printStackTrace(); // Or use a logger
            // Generic exception handling to return a controlled error response
            return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
