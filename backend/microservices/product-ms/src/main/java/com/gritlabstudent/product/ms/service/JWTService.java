package com.gritlabstudent.product.ms.service;


import com.gritlabstudent.product.ms.models.SimpleUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.function.Function;


@Component
public class JWTService {

    @Value("${JWT_SECRET_KEY}")
    private String encodedSecretKey;
    private Key SECRET;

    @PostConstruct
    public void init() {
        this.SECRET = Keys.hmacShaKeyFor(Base64.getDecoder().decode(encodedSecretKey));
        System.out.println("Current SECRET: " + encodedSecretKey); // This will print the current SECRET
    }
    // Validates a token by checking if it has expired.
    public boolean validateToken(String token) {
        return !isTokenExpired(token);
    }

    // Extracts the expiration date from a token.
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extracts a claim from a token using the provided claims resolver function.
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extracts all claims from a given token.
    private Claims extractAllClaims(String token) {
        //print the token
        System.out.println("Token1: " + token);
        return Jwts.parserBuilder()
                .setSigningKey(SECRET) // Use SECRET directly
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Generates a sign key for the token parsing.


    // Checks if a given token is expired.
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extracts the username from the given token.
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extracts user role from the given token. Modify this method if roles are stored differently.
    public String extractUserRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }


    // Creates UserDetails from JWT claims.
    public UserDetails getUserDetailsFromToken(String token) {
        String username = extractUsername(token);
        String role = extractUserRole(token); // If there's only one role

        // Ensure the role is in the correct format for Spring Security
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        // Convert the role to a GrantedAuthority
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));

        // Create a new SimpleUserDetails with the username and authorities
        return new SimpleUserDetails(username, authorities); // Assuming you don't need the password here
    }

}
