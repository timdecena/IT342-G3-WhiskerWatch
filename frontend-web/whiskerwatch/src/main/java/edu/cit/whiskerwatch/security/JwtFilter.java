package edu.cit.whiskerwatch.security;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {

    String path = request.getRequestURI();

    // List of endpoints that do NOT require JWT validation
    if (isPublicPath(path)) {
        chain.doFilter(request, response);
        return;
    }

    String header = request.getHeader("Authorization");

    if (header == null || !header.startsWith("Bearer ")) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
    }

    String token = header.substring(7);
    try {
        Long userId = jwtUtil.extractUserId(token);
        Optional<UserEntity> userOpt = userRepository.findById(userId);

        if (userOpt.isPresent() && jwtUtil.validateToken(token)) {
            UserEntity user = userOpt.get();
            UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(user, null, 
                    Collections.singletonList(() -> "ROLE_USER"));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    } catch (ExpiredJwtException | SignatureException e) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
    }

    chain.doFilter(request, response);
}

private boolean isPublicPath(String path) {
    return path.equals("/") ||
           path.startsWith("/api/auth/login") ||
           path.startsWith("/api/users/createUser") ||
           path.startsWith("/uploads/") ||
           path.startsWith("/files/") ||
           path.startsWith("/api/pets/") ||
           path.startsWith("/api/adoptions/") ||
           path.startsWith("/api/favorites/") ||
           path.startsWith("/api/lost-and-found/") ||
           path.startsWith("/api/users/getUserById/") ||
           path.startsWith("/v3/api-docs") ||
           path.startsWith("/swagger-ui") ||
           path.equals("/swagger-ui.html");
}
}