package edu.cit.whiskerwatch.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.PetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    // Ensure the uploads directory exists
    static {
        try {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to create uploads directory", e);
        }
    }

    // Fetch all pets
    public List<PetEntity> getAllPets() {
        return petRepository.findAll();
    }

    // Fetch a pet by its ID
    public Optional<PetEntity> getPetById(Long id) {
        return petRepository.findById(id);
    }

    // Fetch all pets by their owner's ID
    public List<PetEntity> getPetsByOwnerId(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    // Add a new pet, including the owner's ID and an image
    public PetEntity addPet(PetEntity pet, Long ownerId, MultipartFile image) throws IOException {
        // Find the owner by ID
        Optional<UserEntity> owner = userRepository.findById(ownerId);
        if (owner.isPresent()) {
            pet.setOwner(owner.get());
        } else {
            throw new RuntimeException("Owner not found with ID: " + ownerId);
        }
    
        // Process the image if it's not empty
        if (image != null && !image.isEmpty()) {
            try {
                // Generate a unique filename for the image
                String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
    
                // Define the path where the image will be saved
                Path imagePath = Paths.get("uploads/" + filename);
    
                // Copy the image data to the file system
                Files.copy(image.getInputStream(), imagePath);
    
                // Save the filename (not the file itself) to the database
                pet.setImage(filename); 
            } catch (IOException e) {
                throw new RuntimeException("Failed to process image file", e);
            }
        }
    
        // Ensure location fields are set (already in pet from frontend or set here)
        if (pet.getCountry() == null || pet.getCity() == null || pet.getBarangay() == null) {
            throw new RuntimeException("Location information is incomplete.");
        }
    
        // Save the pet entity to the repository
        return petRepository.save(pet);
    }

    // Update an existing pet's details
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
 
    // Delete a pet by its ID 
    public void deletePet(Long id) { 
        petRepository.findById(id).ifPresent(pet -> {
            pet.setOwner(null);  // Disassociate owner before deletion
            petRepository.save(pet);  // Save the updated pet (owner disassociated)
            petRepository.delete(pet);  // Delete the pet
        });
    }

    // Add a new pet without an owner
    public PetEntity addPetWithoutOwner(PetEntity pet) {
        return petRepository.save(pet);
    }

    // Delete all pets from the repository
    public void deleteAllPets() {
        petRepository.deleteAll();
    }

    // Fetch all pets that do not have an owner
    public List<PetEntity> getUnownedPets() {
        return petRepository.findByOwnerIsNull();
    }

    public PetEntity updatePetImage(Long id, MultipartFile image) throws IOException {
        PetEntity pet = petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pet not found"));
        
        if (image != null && !image.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path imagePath = Paths.get("uploads/" + filename);
            Files.copy(image.getInputStream(), imagePath);
            pet.setImage(filename);
        }
        
        return petRepository.save(pet);
    }
}
