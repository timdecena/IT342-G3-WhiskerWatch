package edu.cit.whiskerwatch.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserEntity> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public UserEntity createUser(UserEntity user) {
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<UserEntity> updateUser(Long id, UserEntity updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setEmail(updatedUser.getEmail());

            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
                existingUser.setPassword(encodedPassword);
            }

            return userRepository.save(existingUser);
        });
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}