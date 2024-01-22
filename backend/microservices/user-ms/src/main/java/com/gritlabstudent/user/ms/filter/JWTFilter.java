package com.gritlabstudent.user.ms.filter;

import com.gritlabstudent.user.ms.services.JWTService;
import com.gritlabstudent.user.ms.services.UserInfoDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserInfoDetailsService userInfoDetailsService;

    public static class InvalidTokenException extends RuntimeException {
        public InvalidTokenException(String message) {
            super(message);
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            handleRequest(request, response, filterChain);
        } catch (Exception e) {
            handleException(response, e);
        }
    }

    private void handleRequest(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (isBearerToken(authHeader)) {
            String jwt = authHeader.substring(7); // Remove "Bearer "
            handleBearerToken(jwt, request);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isBearerToken(String authHeader) {
        return authHeader != null && authHeader.startsWith("Bearer ");
    }

    private void handleBearerToken(String jwt, HttpServletRequest request) {
        String username = jwtService.extractUsername(jwt);
        if (username == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            return;
        }

        UserDetails userDetails = getUserDetailsOrThrow(username);
        if (!jwtService.validateToken(jwt, userDetails)) {
            throw new InvalidTokenException("Invalid token");
        }

        populateSecurityContext(userDetails, request);
    }

    private UserDetails getUserDetailsOrThrow(String username) {
        try {
            return userInfoDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            throw new IllegalStateException("User not found", e);
        }
    }

    private void populateSecurityContext(UserDetails userDetails, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private void handleException(HttpServletResponse response, Exception e) throws IOException {
        if (e instanceof IllegalStateException || e instanceof InvalidTokenException) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
        } else {
            response.sendError(HttpStatus.BAD_REQUEST.value(), "An error occurred");
        }
    }
}
