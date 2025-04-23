package edu.cit.whiskerwatch.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lost_pets")
public class LostPetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String petName;
    private String description;
    private String lastSeenLocation;
    private LocalDateTime dateLost;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private UserEntity owner;

    @OneToMany(mappedBy = "lostPet", cascade = CascadeType.ALL)
    @JsonIgnore  // Prevent circular reference by ignoring this field during serialization
    private List<LostPetCommentEntity> comments = new ArrayList<>();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLastSeenLocation() { return lastSeenLocation; }
    public void setLastSeenLocation(String lastSeenLocation) { this.lastSeenLocation = lastSeenLocation; }

    public LocalDateTime getDateLost() { return dateLost; }
    public void setDateLost(LocalDateTime dateLost) { this.dateLost = dateLost; }

    public UserEntity getOwner() { return owner; }
    public void setOwner(UserEntity owner) { this.owner = owner; }

    public List<LostPetCommentEntity> getComments() { return comments; }
    public void setComments(List<LostPetCommentEntity> comments) { this.comments = comments; }
}
