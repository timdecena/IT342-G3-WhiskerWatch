package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<Map<String, Object>> addPet(@RequestBody PetEntity pet, @PathVariable Long ownerId) {
        Map<String, Object> response = new HashMap<>();
        try {
            PetEntity savedPet = petService.addPet(pet, ownerId);
            response.put("success", true);
            response.put("message", "Pet saved successfully");
            response.put("pet", savedPet);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to save pet: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    @PostMapping(value = "/add-with-image/{ownerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> addPetWithImage(
            @RequestParam("petName") String petName,
            @RequestParam("type") String type,
            @RequestParam("species") String species,
            @RequestParam("breed") String breed,
            @RequestParam("age") int age,
            @RequestParam("status") String status,
            @RequestParam("image") MultipartFile imageFile,
            @PathVariable Long ownerId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            PetEntity savedPet = petService.addPetWithImage(
                    petName, type, species, breed, age, status, imageFile, ownerId);
            
            response.put("success", true);
            response.put("message", "Pet saved successfully");
            response.put("pet", savedPet);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to save pet: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
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
}