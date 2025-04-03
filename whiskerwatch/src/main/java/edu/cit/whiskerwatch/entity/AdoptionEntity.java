package edu.cit.whiskerwatch.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "adoptions")
public class AdoptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pet_id", nullable = false)
    private PetEntity pet;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "adopter_id", nullable = false)
    private UserEntity adopter;

    private LocalDateTime adoptionDate;
    private String status; // Pending, Approved, Rejected

    // Constructors
    public AdoptionEntity() {}

    public AdoptionEntity(PetEntity pet, UserEntity adopter, LocalDateTime adoptionDate, String status) {
        this.pet = pet;
        this.adopter = adopter;
        this.adoptionDate = adoptionDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PetEntity getPet() { return pet; }
    public void setPet(PetEntity pet) { this.pet = pet; }

    public UserEntity getAdopter() { return adopter; }
    public void setAdopter(UserEntity adopter) { this.adopter = adopter; }

    public LocalDateTime getAdoptionDate() { return adoptionDate; }
    public void setAdoptionDate(LocalDateTime adoptionDate) { this.adoptionDate = adoptionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
