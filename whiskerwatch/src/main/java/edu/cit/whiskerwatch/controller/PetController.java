package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.service.PetService;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetService petService;

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
    public PetEntity addPet(@RequestBody PetEntity pet, @PathVariable Long ownerId) {
        return petService.addPet(pet, ownerId);
    }

    @PostMapping("/add-with-image/{ownerId}")
    public ResponseEntity<?> addPetWithImage(
            @RequestParam("petName") String petName,
            @RequestParam("type") String type,
            @RequestParam("species") String species,
            @RequestParam("breed") String breed,
            @RequestParam("age") int age,
            @RequestParam("status") String status,
            @RequestParam("image") MultipartFile imageFile,
            @PathVariable Long ownerId) {
        try {
            PetEntity savedPet = petService.addPetWithImage(
                    petName, type, species, breed, age, status, imageFile, ownerId);
            return ResponseEntity.ok(savedPet);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to save pet: " + e.getMessage());
        }
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
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadPet(
        @RequestPart("pet") String petJson,
        @RequestPart("image") MultipartFile file) {
        
        // Process your pet data here
        return ResponseEntity.ok("Pet saved successfully");
}
}
