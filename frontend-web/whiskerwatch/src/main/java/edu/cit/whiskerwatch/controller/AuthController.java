package edu.cit.whiskerwatch.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import edu.cit.whiskerwatch.dto.AuthRequest;
import edu.cit.whiskerwatch.dto.AuthResponse;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.UserRepository;
import edu.cit.whiskerwatch.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder; // Inject instead of creating new

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Optional<UserEntity> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            UserEntity user = userOpt.get();

            // Generate the token after successful validation
            String token = jwtUtil.generateToken(user.getId());

            AuthResponse response = new AuthResponse(user.getEmail(), user.getId(), token, user.getFirstName(),
                    user.getLastName());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(null);
    }
}
