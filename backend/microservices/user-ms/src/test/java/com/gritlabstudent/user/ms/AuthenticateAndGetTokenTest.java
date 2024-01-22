package com.gritlabstudent.user.ms;

import com.gritlabstudent.user.ms.controller.AuthController;
import com.gritlabstudent.user.ms.models.AuthRequest;
import com.gritlabstudent.user.ms.models.AuthResponse;
import com.gritlabstudent.user.ms.models.User;
import com.gritlabstudent.user.ms.repositories.UserRepository;
import com.gritlabstudent.user.ms.services.JWTService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

public class AuthenticateAndGetTokenTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JWTService jwtService;

    @InjectMocks
    private AuthController authController;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void test_returns_jwt_token() throws Exception {
        AuthRequest authRequest = new AuthRequest("username", "password");
        User user = new User("1", "username", "email", "password", "ROLE_CLIENT", "avatarImagePath");
        when(userRepository.findByName(authRequest.getUsername())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(authRequest.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtService.generateToken(user.getName(), user.getRole())).thenReturn("jwt_token");

        ResponseEntity<?> response = authController.authenticateAndGetToken(authRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Correctly handle the response body as AuthResponse
        AuthResponse authResponse = (AuthResponse) response.getBody();
        assertNotNull("Response body should not be null", authResponse);

        String token = authResponse.getToken();  // Replace this with the correct getter method for token

        assertEquals("jwt_token", token);
    }

    @Test
    public void test_returns_404_when_user_not_found() {
        AuthRequest authRequest = new AuthRequest("nonexistentUser", "password");
        when(userRepository.findByName(authRequest.getUsername())).thenReturn(Optional.empty());

        ResponseEntity<?> response = authController.authenticateAndGetToken(authRequest);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void test_returns_401_when_password_is_incorrect() {
        AuthRequest authRequest = new AuthRequest("username", "password");
        User user = new User("1", "username", "email", "password", "ROLE_CLIENT", "avatarImagePath");
        when(userRepository.findByName(authRequest.getUsername())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(authRequest.getPassword(), user.getPassword())).thenReturn(false);

        ResponseEntity<?> response = authController.authenticateAndGetToken(authRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    public void test_returns_401_when_password_is_null() {
        AuthRequest authRequest = new AuthRequest("username", null);
        User user = new User("1", "username", "email", "password", "ROLE_CLIENT", "avatarImagePath");
        when(userRepository.findByName(authRequest.getUsername())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(authRequest.getPassword(), user.getPassword())).thenReturn(false);

        ResponseEntity<?> response = authController.authenticateAndGetToken(authRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }


}
