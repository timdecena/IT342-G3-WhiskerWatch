package edu.cit.whiskerwatch.dto;

public class AuthResponse {
    private String email;
    private Long userId;
    private String token;
    private String firstName;
    private String lastName;

    public AuthResponse(String email, Long userId, String token, String firstName, String lastName) {
        this.email = email;
        this.userId = userId;
        this.token = token;
        this.firstName = firstName;
        this.lastName = lastName;
        
    }

    public String getEmail() {
        return email;
    }

    public Long getUserId() {
        return userId;
    }

    public String getToken() {
        return token;
    }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
}
