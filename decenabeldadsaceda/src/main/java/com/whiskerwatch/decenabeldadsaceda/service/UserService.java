package com.whiskerwatch.decenabeldadsaceda.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.whiskerwatch.decenabeldadsaceda.entity.UserEntity;
import com.whiskerwatch.decenabeldadsaceda.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserEntity> getUserById(int id) {
        return userRepository.findById(id);
    }

    public UserEntity createUser(UserEntity user) {
        return userRepository.save(user);
    }

    public UserEntity updateUser(int id, UserEntity updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setFirstname(updatedUser.getFirstname());
            user.setLastname(updatedUser.getLastname());
            user.setUsername(updatedUser.getUsername());
            user.setPassword(updatedUser.getPassword());
            user.setAddress(updatedUser.getAddress());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }
}
