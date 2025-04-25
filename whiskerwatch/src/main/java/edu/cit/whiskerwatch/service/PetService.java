package edu.cit.whiskerwatch.service;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.PetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

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
        Optional<UserEntity> owner = userRepository.findById(ownerId);
        owner.ifPresent(pet::setOwner);
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
        }).orElseThrow(() -> new RuntimeException("Pet not found"));
    }

    public void deletePet(Long id) {
        petRepository.findById(id).ifPresent(pet -> {
            pet.setOwner(null); // Remove relationship
            petRepository.save(pet); // Ensure update is persisted
            petRepository.delete(pet); // Now delete pet
        });
    }

    public PetEntity addPetWithImage(String petName, String type, String species, String breed, int age, String status,
                                 MultipartFile imageFile, Long ownerId) {
    try {
        // Find owner
        Optional<UserEntity> ownerOpt = userRepository.findById(ownerId);
        if (!ownerOpt.isPresent()) {
            throw new RuntimeException("Owner not found with ID: " + ownerId);
        }

        // Convert MultipartFile to byte[] or store path (this example stores bytes)
        byte[] imageData = imageFile.getBytes();

        // Create PetEntity
        PetEntity pet = new PetEntity();
        pet.setPetName(petName);
        pet.setType(type);
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setAge(age);
        pet.setStatus(status);
        pet.setImage(imageData); // This assumes your PetEntity has a byte[] field named `image`
        pet.setOwner(ownerOpt.get());

        return petRepository.save(pet);
    } catch (Exception e) {
        throw new RuntimeException("Error saving pet with image: " + e.getMessage(), e);
    }
}
}