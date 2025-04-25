package edu.cit.whiskerwatch.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnore // Prevents circular reference in JSON
    private List<PetEntity> pets;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @JsonIgnore // Don't expose password in serialization
    public String getPassword() {
        return password;
    }

    @JsonProperty // Allow password setting from deserialization
    public void setPassword(String password) {
        this.password = passwordEncoder.encode(password);
    }

    @JsonIgnore // Not needed in serialization
    public boolean checkPassword(String rawPassword) {
        return passwordEncoder.matches(rawPassword, this.password);
    }

    // Helper method to get pet count without exposing entire list
    @Transient
    public int getPetCount() {
        return pets != null ? pets.size() : 0;
    }

    // toString without password for security
    @Override
    public String toString() {
        return "UserEntity{" +
               "id=" + id +
               ", firstName='" + firstName + '\'' +
               ", lastName='" + lastName + '\'' +
               ", email='" + email + '\'' +
               ", petCount=" + getPetCount() +
               '}';
    }
}