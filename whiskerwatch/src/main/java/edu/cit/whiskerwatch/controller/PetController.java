package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.service.FileStorageService;
import edu.cit.whiskerwatch.service.PetService;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
public class PetController {
    @Autowired
    private PetService petService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<PetEntity> getAllPets() {
        return petService.getAllPets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetEntity> getPetById(@PathVariable Long id) {
        return petService.getPetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/owner/{ownerId}")
    public List<PetEntity> getPetsByOwner(@PathVariable Long ownerId) {
        return petService.getPetsByOwnerId(ownerId);
    }

    @PostMapping("/add/{ownerId}")
    public ResponseEntity<PetEntity> addPet(
            @PathVariable Long ownerId,
            @RequestParam String petName,
            @RequestParam String type,
            @RequestParam int age,
            @RequestParam MultipartFile image
    ) throws IOException {
        String imageUrl = fileStorageService.storeFile(image);

        PetEntity pet = new PetEntity();
        pet.setPetName(petName);
        pet.setType(type);
        pet.setAge(age);
        pet.setImageUrl(imageUrl); // this assumes you added imageUrl to your PetEntity

        PetEntity savedPet = petService.addPet(pet, ownerId);
        return ResponseEntity.ok(savedPet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetEntity> updatePet(@PathVariable Long id, @RequestBody PetEntity pet) {
        return ResponseEntity.ok(petService.updatePet(id, pet));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }
}