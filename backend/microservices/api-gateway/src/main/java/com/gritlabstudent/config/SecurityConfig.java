package com.gritlabstudent.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.util.pattern.PathPatternParser;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable and configure CORS
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(authorize -> authorize
                        // Publicly accessible paths (no authentication required)
                        .pathMatchers("/api/auth/**").permitAll()

                        // User-specific endpoints
                        .pathMatchers(HttpMethod.POST, "/api/users/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/users", "/api/users/**").permitAll()
                        .pathMatchers(HttpMethod.DELETE, "/api/users/**").permitAll()
                        .pathMatchers(HttpMethod.PUT, "/api/users/**").permitAll()

                        // Product-specific endpoints
                        .pathMatchers(HttpMethod.POST, "/api/products").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                        .pathMatchers(HttpMethod.DELETE, "/api/products/**").permitAll()
                        .pathMatchers(HttpMethod.PUT, "/api/products/**").permitAll()

                        // Media-specific endpoints
                        .pathMatchers(HttpMethod.GET, "/media", "/media/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/media/upload").permitAll()
                        .pathMatchers(HttpMethod.DELETE, "/media/**").permitAll()

                        // kafka related endpoints
                        .pathMatchers(HttpMethod.GET, "/api/products/status/**").permitAll()

                        // Order-specific endpoints
                        .pathMatchers(HttpMethod.POST, "/api/orders").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/orders", "/api/orders/**").permitAll()
                        .pathMatchers(HttpMethod.DELETE, "/api/orders/**").permitAll()
                        .pathMatchers(HttpMethod.PUT, "/api/orders/**").permitAll()
                        .pathMatchers(HttpMethod.PATCH, "/api/orders/**").permitAll()

                        // All other requests require authentication
                        .anyExchange().authenticated());
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://localhost:4200", "https://164.90.180.143:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(new PathPatternParser());
        source.registerCorsConfiguration("/**", configuration); // Apply CORS to all paths
        return source;
    }
    // cors

}
