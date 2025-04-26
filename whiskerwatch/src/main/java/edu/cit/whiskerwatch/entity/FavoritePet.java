package edu.cit.whiskerwatch.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "favorite_pets")
public class FavoritePet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private PetEntity pet;

    // Constructors
    public FavoritePet() {}

    public FavoritePet(UserEntity user, PetEntity pet) {
        this.user = user;
        this.pet = pet;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public PetEntity getPet() {
        return pet;
    }

    public void setPet(PetEntity pet) {
        this.pet = pet;
    }
}