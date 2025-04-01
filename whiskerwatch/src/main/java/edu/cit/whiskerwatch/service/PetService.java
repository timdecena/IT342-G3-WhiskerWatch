package edu.cit.whiskerwatch.service;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.PetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        petRepository.deleteById(id);
    }
}