package com.gritlabstudent.user.ms.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
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


    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the expiration date from a token.
     *
     * @param token the token from which to extract the expiration date
     * @return the expiration date extracted from the token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a claim from a token using the provided claims resolver function.
     *
     * @param token          the token from which to extract the claim
     * @param claimsResolver the function used to extract the claim from the token's
     *                       claims
     * @return the extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from a given token.
     *
     * @param token the token from which to extract the claims
     * @return the extracted claims
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET) // Use SECRET directly
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    /**
     * Checks if a given token is expired.
     *
     * @param token the token to be checked
     * @return true if the token is expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Validates a token by comparing the username extracted from the token
     * with the username from the user details and checking if the token
     * has expired.
     *
     * @param token       the token to validate
     * @param userDetails the user details object containing the username
     * @return true if the token is valid, false otherwise
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Generates a token for the given user name.
     *
     * @param userName the user name for which to generate the token
     * @return the generated token
     * @implNote each token is consist of (Header[used algo], Payload[data], Verify
     * Signature[Secret code]) which is known as claims in jwt.
     * @implSpec This method generates a token for the given user name using the JWT
     * (JSON Web Token) standard.
     */
    public String generateToken(String userName, String userRole) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", userRole);
        return createToken(claims, userName);
    }

    /**
     * Creates a JWT token with the provided claims, username, and secret.
     *
     * @param claims   a map containing the claims to be included in the token
     * @param userName the username to be included in the token
     * @return the generated JWT token
     */
    private String createToken(Map<String, Object> claims, String userName) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(userName)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
            .signWith(SECRET, SignatureAlgorithm.HS256).compact(); // Use SECRET directly
    }

    /**
     * Generates a sign key for the Java function.
     *
     * @return The generated sign key.
     */
    private Key getSignKey(String secret) {
        System.out.println("Current SECRET: " + secret); // This will print the current SECRET
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}