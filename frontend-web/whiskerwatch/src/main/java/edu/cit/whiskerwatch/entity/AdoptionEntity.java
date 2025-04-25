package edu.cit.whiskerwatch.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

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


    // 🆕 Additional form fields from the adopter
    private String adopterName;
    private String adopterContact;
    private String messageToOwner;
   

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

    public String getAdopterName() { return adopterName; }
    public void setAdopterName(String adopterName) { this.adopterName = adopterName; }

    public String getAdopterContact() { return adopterContact; }
    public void setAdopterContact(String adopterContact) { this.adopterContact = adopterContact; }

    public String getMessageToOwner() { return messageToOwner; }
    public void setMessageToOwner(String messageToOwner) { this.messageToOwner = messageToOwner; }

 
}
