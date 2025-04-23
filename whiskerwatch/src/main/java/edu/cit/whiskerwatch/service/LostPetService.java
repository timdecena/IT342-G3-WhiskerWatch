package edu.cit.whiskerwatch.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import edu.cit.whiskerwatch.dto.LostPetDTO;
import edu.cit.whiskerwatch.entity.LostPetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.LostPetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;

@Service
public class LostPetService {
    @Autowired
    private LostPetRepository lostPetRepository;

    @Autowired
    private UserRepository userRepository;

    public LostPetEntity createLostPet(LostPetDTO dto) {
        UserEntity user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        LostPetEntity lostPet = new LostPetEntity();
        lostPet.setPetName(dto.getPetName());
        lostPet.setDescription(dto.getDescription());
        lostPet.setLastSeenLocation(dto.getLastSeenLocation());
        lostPet.setDateLost(dto.getDateLost());
        lostPet.setOwner(user);

        return lostPetRepository.save(lostPet);
    }
}