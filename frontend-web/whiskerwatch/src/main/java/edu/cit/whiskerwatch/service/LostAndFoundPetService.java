package edu.cit.whiskerwatch.service;

import edu.cit.whiskerwatch.dto.LostAndFoundPetDTO;
import edu.cit.whiskerwatch.entity.LostAndFoundPetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.LostAndFoundPetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

@Service
public class LostAndFoundPetService {

    @Autowired
    private LostAndFoundPetRepository lostAndFoundPetRepository;

    @Autowired
    private UserRepository userRepository;

    static {
        try {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public List<LostAndFoundPetEntity> getAll() {
        return lostAndFoundPetRepository.findAll();
    }

    public Optional<LostAndFoundPetEntity> getById(Long id) {
        return lostAndFoundPetRepository.findById(id);
    }

    public List<LostAndFoundPetEntity> getByReporter(Long reporterId) {
        return lostAndFoundPetRepository.findByReporterId(reporterId);
    }

    public LostAndFoundPetEntity add(Long reporterId, LostAndFoundPetDTO petDTO, MultipartFile image)
        throws IOException {

    UserEntity reporter = userRepository.findById(reporterId)
            .orElseThrow(() -> new RuntimeException("Reporter not found"));

    LostAndFoundPetEntity pet = new LostAndFoundPetEntity();
    pet.setPetName(petDTO.getPetName());
    pet.setDescription(petDTO.getDescription());
    pet.setStatus(petDTO.getStatus());
    pet.setSpecies(petDTO.getSpecies());
    pet.setCountry(petDTO.getCountry());
    pet.setCity(petDTO.getCity());
    pet.setBarangay(petDTO.getBarangay());
    pet.setLatitude(petDTO.getLatitude());
    pet.setLongitude(petDTO.getLongitude());

    if (image != null && !image.isEmpty()) {
        String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path imagePath = Paths.get("uploads/" + filename);
        Files.copy(image.getInputStream(), imagePath);
        pet.setImage(filename);
    }

    pet.setReporter(reporter);
    return lostAndFoundPetRepository.save(pet);
}


    public LostAndFoundPetEntity update(Long id, LostAndFoundPetEntity updated) {
        return lostAndFoundPetRepository.findById(id).map(pet -> {
            pet.setPetName(updated.getPetName());
            pet.setDescription(updated.getDescription());
            pet.setStatus(updated.getStatus());
            pet.setCountry(updated.getCountry());
            pet.setCity(updated.getCity());
            pet.setBarangay(updated.getBarangay());
            pet.setLatitude(updated.getLatitude());
            pet.setLongitude(updated.getLongitude());
            return lostAndFoundPetRepository.save(pet);
        }).orElseThrow(() -> new RuntimeException("Lost and found pet not found"));
    }

    public void delete(Long id) {
        lostAndFoundPetRepository.deleteById(id);
    }

    public LostAndFoundPetEntity updateImage(Long id, MultipartFile image) throws IOException {
        LostAndFoundPetEntity pet = lostAndFoundPetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost and found pet not found"));

        if (image != null && !image.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path imagePath = Paths.get("uploads/" + filename);
            Files.copy(image.getInputStream(), imagePath);
            pet.setImage(filename);
        }

        return lostAndFoundPetRepository.save(pet);
    }
}
