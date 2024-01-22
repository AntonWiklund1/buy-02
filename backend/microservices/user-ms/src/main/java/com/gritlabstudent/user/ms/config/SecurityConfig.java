package com.gritlabstudent.user.ms.config;

import com.gritlabstudent.user.ms.filter.JWTFilter;
import com.gritlabstudent.user.ms.services.UserInfoDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// The @Configuration annotation indicates that this class contains Spring configuration
// The @EnableWebSecurity annotation enables Spring Security
// The @EnableMethodSecurity annotation enables Spring Security method-level security
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
// The SecurityConfig class is annotated with @Configuration, @EnableWebSecurity, and @EnableMethodSecurity.
public class SecurityConfig {


        // The JWTFilter bean is used to validate the JWT in the Authorization header
        // and set the user in the SecurityContext if the token is valid
        @Autowired
        private JWTFilter jwtFilter;

        // The UserDetailsService bean is used to retrieve user details from the database
        // and return a UserDetails object that Spring Security can use for authentication and validation
        @Bean
        public UserDetailsService userDetailService() {
                return new UserInfoDetailsService();
        }

        // the SecurityFilterChain bean is used to configure the security filters
        // that are applied to secure your application
        // The SecurityFilterChain bean is created by the Spring Security auto-configuration
        // and is used to configure the security filters that are applied to secure your application.
        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configure the SecurityFilterChain, which defines security settings for your application
        // Disable Cross-Site Request Forgery (CSRF) protection
        http.csrf(csrf -> csrf.disable())

                // Handle exceptions related to authentication
                .exceptionHandling(
                        exceptionHandling -> exceptionHandling
                .authenticationEntryPoint((request, response, authException) ->
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED)))

                // Authorize HTTP requests based on their URL paths
                .authorizeHttpRequests(
                        authorize -> authorize
                                .requestMatchers("/api/users").permitAll()
                                .requestMatchers("/api/users/{id}").permitAll()
                                .requestMatchers("/api/users/**").permitAll()
                                .requestMatchers("/api/auth").permitAll()
                                .anyRequest().authenticated())

                // Set the AuthenticationProvider for user authentication
                .authenticationProvider(authenticationProvider())

                // Configure session management and set it to be stateless
                .sessionManagement(
                        sessionManagement -> sessionManagement.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))

                // Add the JWTFilter before the UsernamePasswordAuthenticationFilter in the filter chain
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                // Build and return the configured HttpSecurity object
                return http.build();

        }

        // The password encoder bean is used to encrypt the password before saving it to the database
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        // The authentication provider bean is used to authenticate users with the database
        // and set the PasswordEncoder to be used
        @Bean
        public AuthenticationProvider authenticationProvider() {
                DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
                authProvider.setUserDetailsService(userDetailService());
                authProvider.setPasswordEncoder(passwordEncoder());
                return authProvider;
        }


        // The AuthenticationManager bean is used to authenticate users with the database
        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

}
