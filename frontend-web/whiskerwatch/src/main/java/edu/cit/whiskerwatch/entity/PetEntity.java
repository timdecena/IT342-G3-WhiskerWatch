package edu.cit.whiskerwatch.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pets")
public class PetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String petName;
    private String type;   // Type of animal (dog, cat, etc.)
    private String species;
    private String breed;
    private int age;
    private String status; // Available / Adopted

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData; // Ensure this is mapped correctly

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE})
    @JoinColumn(name = "owner_id", referencedColumnName = "id", nullable = true)
    private UserEntity owner;

    // Constructors
    public PetEntity() {
    }

    public PetEntity(String petName, String type, String species, String breed, int age, String status, byte[] imageData, UserEntity owner) {
        this.petName = petName;
        this.type = type;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.status = status;
        this.imageData = imageData;
        this.owner = owner;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public byte[] getImage() {
        return imageData;
    }

    public void setImage(byte[] imageData) {
        this.imageData = imageData;
    }

    public UserEntity getOwner() {
        return owner;
    }

    public void setOwner(UserEntity owner) {
        this.owner = owner;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }
}
