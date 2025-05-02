package edu.cit.whiskerwatch.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .csrf(csrf -> csrf.disable()) // Disable CSRF for API calls
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login", "/api/users/createUser").permitAll() // Allow login & user
                                                                                                 // registration
                        .requestMatchers("/uploads/**").permitAll() // Allow access to static files
                        .requestMatchers("/files/**").permitAll() // Allow access to static files
                        .requestMatchers("/api/pets/**").permitAll() // Allow access to pets API
                        .requestMatchers("/api/adoptions/**").permitAll() // Allow all adoption-related requests
                        .requestMatchers("/api/favorites/**").permitAll() // Allow favorites-related requests
                        .requestMatchers("/api/lost-and-found/**").permitAll() // correct with hyphens
                        .requestMatchers("/api/users/getUserById/**").permitAll()
                        .requestMatchers("/api/messages/**").authenticated()

                        .anyRequest().authenticated() // Ensure other endpoints require authentication
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter for secured
                                                                                         // requests

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173", // For frontend (if you're running a local React app)
                "http://localhost:5174",
                "http://localhost:3000", // For frontend (if you're running a local React app)
                "http://10.0.2.2:8080", // Add Android emulator access
                "http://ec2-35-168-15-40.compute-1.amazonaws.com" // -Copied from deployed main branch
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true); // Allow credentials like JWT tokens

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
