package com.example.whiskerwatch.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/public").permitAll() // Allow public access
                .anyRequest().authenticated() // Secure other routes
            )
            .formLogin()  // Enable form-based login
            .and()
            .logout().logoutSuccessUrl("/");  // Redirect after logout

        return http.build();
    }
}
