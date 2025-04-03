package edu.cit.whiskerwatch.service;

import edu.cit.whiskerwatch.entity.FavoritePet;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.repository.FavoritePetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;
import edu.cit.whiskerwatch.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoritePetService {
    private final FavoritePetRepository favoritePetRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;

    public FavoritePetService(FavoritePetRepository favoritePetRepository, UserRepository userRepository, PetRepository petRepository) {
        this.favoritePetRepository = favoritePetRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    public List<FavoritePet> getFavoritePets(Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return favoritePetRepository.findByUser(user);
    }

    public void addFavoritePet(Long userId, Long petId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        PetEntity pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
        
        if (pet.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Users cannot favorite their own pets");
        }
        
        if (!favoritePetRepository.existsByUserAndPet(user, pet)) {
            favoritePetRepository.save(new FavoritePet(user, pet));
        }
    }

    public void removeFavoritePet(Long userId, Long petId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        PetEntity pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));
        
        favoritePetRepository.deleteByUserAndPet(user, pet);
    }
}