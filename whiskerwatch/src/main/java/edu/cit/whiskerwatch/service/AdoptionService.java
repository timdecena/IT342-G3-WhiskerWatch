package edu.cit.whiskerwatch.service;

import edu.cit.whiskerwatch.entity.AdoptionEntity;
import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.AdoptionRepository;
import edu.cit.whiskerwatch.repository.PetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    public AdoptionEntity createAdoption(Long petId, Long adopterId) {
        PetEntity pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
        UserEntity adopter = userRepository.findById(adopterId).orElseThrow(() -> new RuntimeException("Adopter not found"));

        AdoptionEntity adoption = new AdoptionEntity(pet, adopter, LocalDateTime.now(), "Pending");
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
