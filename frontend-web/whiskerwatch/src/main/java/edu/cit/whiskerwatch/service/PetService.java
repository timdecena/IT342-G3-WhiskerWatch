package edu.cit.whiskerwatch.service;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.PetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional; // Import this
import java.io.IOException;
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

    @Transactional // Added Transactional annotation
    public PetEntity addPetWithImage(String petName, String type, String species, String breed,
                                     int age, String status, MultipartFile imageFile, Long ownerId)
            throws IOException {
        UserEntity owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + ownerId));

        PetEntity pet = new PetEntity();
        pet.setPetName(petName);
        pet.setType(type);
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setAge(age);
        pet.setStatus(status);
        pet.setImageData(imageFile.getBytes());
        pet.setOwner(owner);

        return petRepository.save(pet);
    }

    @Transactional // Added Transactional annotation
    public PetEntity updatePetWithImage(Long id, String petName, String type, String species, String breed,
                                         String status, int age, MultipartFile imageFile) throws IOException {
        return petRepository.findById(id).map(pet -> {
            try {
                pet.setPetName(petName);
                pet.setType(type);
                pet.setSpecies(species);
                pet.setBreed(breed);
                pet.setAge(age);
                pet.setStatus(status);
                if (imageFile != null && !imageFile.isEmpty()) {
                    pet.setImageData(imageFile.getBytes());
                }
                return petRepository.save(pet);
            } catch (IOException e) {
                throw new RuntimeException("Failed to update image", e);
            }
        }).orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
    }

    @Transactional // Added Transactional annotation
    public byte[] getImageById(Long id) {
        System.out.println("Searching for image of pet with ID: " + id); // Debug log
    
        Optional<PetEntity> petOptional = petRepository.findById(id);
    
        if (petOptional.isPresent()) {
            PetEntity pet = petOptional.get();
            byte[] image = pet.getImage();
    
            if (image != null) {
                System.out.println("Image found for pet ID: " + id); // Debug log
                return image;
            } else {
                System.err.println("Pet found but image is null for pet ID: " + id); // Debug log
                throw new RuntimeException("Image is null");
            }
        } else {
            System.err.println("No pet found with ID: " + id); // Debug log
            throw new RuntimeException("Pet not found");
        }
    }
}

