package edu.cit.whiskerwatch.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.whiskerwatch.dto.AdoptionRequestDTO;
import edu.cit.whiskerwatch.entity.AdoptionEntity;
import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.AdoptionRepository;
import edu.cit.whiskerwatch.repository.PetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;

@Service
public class AdoptionService {
    @Autowired
    private AdoptionRepository adoptionRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    public List<AdoptionEntity> getAllAdoptions() {
        return adoptionRepository.findAll();
    }

    public Optional<AdoptionEntity> getAdoptionById(Long id) {
        return adoptionRepository.findById(id);
    }

    public AdoptionEntity createAdoption(Long petId, Long adopterId, AdoptionRequestDTO form) {
        // Check for existing pending adoption request
        Optional<AdoptionEntity> existingRequest =
                adoptionRepository.findByPetIdAndAdopterIdAndStatus(petId, adopterId, "Pending");
    
        if (existingRequest.isPresent()) {
            throw new RuntimeException("You already have a pending adoption request for this pet.");
        }
    
        // Fetch pet and adopter entities
        PetEntity pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet with ID " + petId + " not found."));
    
        UserEntity adopter = userRepository.findById(adopterId)
                .orElseThrow(() -> new RuntimeException("User with ID " + adopterId + " not found."));
    
        // Prevent self-adoption
        if (pet.getOwner() != null && pet.getOwner().getId().equals(adopterId)) {
            throw new RuntimeException("You cannot adopt your own pet.");
        }
    
        // Create adoption request
        AdoptionEntity adoption = new AdoptionEntity();
        adoption.setPet(pet);
        adoption.setAdopter(adopter);
        adoption.setAdoptionDate(LocalDateTime.now());
        adoption.setStatus("Pending");
    
        // Set extra form details
        adoption.setAdopterName(form.getAdopterName());
        adoption.setAdopterContact(form.getAdopterContact());
        adoption.setMessageToOwner(form.getMessageToOwner());
    
        return adoptionRepository.save(adoption);
    }

    public AdoptionEntity updateAdoptionStatus(Long id, String status) {
        return adoptionRepository.findById(id).map(adoption -> {
            adoption.setStatus(status);
            return adoptionRepository.save(adoption);
        }).orElseThrow(() -> new RuntimeException("Adoption request not found"));
    }

    public void deleteAdoption(Long id) {
        adoptionRepository.deleteById(id);
    }
}
