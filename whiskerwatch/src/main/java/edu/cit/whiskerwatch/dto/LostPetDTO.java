package edu.cit.whiskerwatch.dto;

import java.time.LocalDateTime;

public class LostPetDTO {
    private String petName;
    private String description;
    private String lastSeenLocation;
    private LocalDateTime dateLost;
    private Long userId;

    // Getters
    public String getPetName() {
        return petName;
    }

    public String getDescription() {
        return description;
    }

    public String getLastSeenLocation() {
        return lastSeenLocation;
    }

    public LocalDateTime getDateLost() {
        return dateLost;
    }

    public Long getUserId() {
        return userId;
    }

    // Setters
    public void setPetName(String petName) {
        this.petName = petName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLastSeenLocation(String lastSeenLocation) {
        this.lastSeenLocation = lastSeenLocation;
    }

    public void setDateLost(LocalDateTime dateLost) {
        this.dateLost = dateLost;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
