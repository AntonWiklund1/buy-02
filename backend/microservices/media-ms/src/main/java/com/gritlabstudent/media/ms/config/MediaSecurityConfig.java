package com.gritlabstudent.media.ms.config;

import com.gritlabstudent.media.ms.filter.MediaJWTFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Enable method-level security
public class MediaSecurityConfig {

    @Autowired
    private MediaJWTFilter jwtFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .exceptionHandling(
                        exceptionHandling -> exceptionHandling
                                .authenticationEntryPoint((request, response, authException) -> response
                                        .sendError(HttpServletResponse.SC_UNAUTHORIZED)))
                .authorizeHttpRequests(authorizeRequests -> {
                    try {
                        authorizeRequests
                                .requestMatchers(HttpMethod.GET, "/media/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/media").permitAll()
                                .requestMatchers(HttpMethod.POST, "/media/upload").permitAll()
                                .requestMatchers(HttpMethod.DELETE, "/media/**").permitAll()
                                .anyRequest().authenticated();

                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Build and return the configured HttpSecurity object
        return http.build();
    }
}
