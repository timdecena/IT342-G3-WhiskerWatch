package edu.cit.whiskerwatch.service;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.PetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PetService {
    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PetEntity> getAllPets() {
        return petRepository.findAll();
    }

    public Optional<PetEntity> getPetById(Long id) {
        return petRepository.findById(id);
    }

    public List<PetEntity> getPetsByOwnerId(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public PetEntity addPet(PetEntity pet, Long ownerId) {
        UserEntity owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + ownerId));
        pet.setOwner(owner);
        return petRepository.save(pet);
    }

    public PetEntity updatePet(Long id, PetEntity updatedPet) {
        return petRepository.findById(id).map(pet -> {
            pet.setPetName(updatedPet.getPetName());
            pet.setType(updatedPet.getType());
            pet.setSpecies(updatedPet.getSpecies());
            pet.setBreed(updatedPet.getBreed());
            pet.setAge(updatedPet.getAge());
            pet.setStatus(updatedPet.getStatus());
            return petRepository.save(pet);
        }).orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
    }

    public void deletePet(Long id) {
        petRepository.findById(id).ifPresent(pet -> {
            pet.setOwner(null);
            petRepository.save(pet);
            petRepository.delete(pet);
        });
    }

    public PetEntity addPetWithImage(String petName, String type, String species, String breed,
                                   int age, String status, MultipartFile imageFile, Long ownerId) 
                                   throws IOException {
        UserEntity owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + ownerId));

        String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        Path imagePath = Paths.get("uploads", fileName);
        Files.createDirectories(imagePath.getParent());
        Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        PetEntity pet = new PetEntity();
        pet.setPetName(petName);
        pet.setType(type);
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setAge(age);
        pet.setStatus(status);
        pet.setImage("/uploads/" + fileName);
        pet.setOwner(owner);

        return petRepository.save(pet);
    }
}