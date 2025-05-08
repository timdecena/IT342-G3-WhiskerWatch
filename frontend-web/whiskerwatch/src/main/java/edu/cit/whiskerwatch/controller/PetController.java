package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.MediaType;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
public class PetController {
    private URI getLocation(Long id) {
    return ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(id)
            .toUri();
}
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
            return ResponseEntity.created(getLocation(savedPet.getId())).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to save pet: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/add-with-image/{ownerId}")
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
            PetEntity savedPet = petService.addPetWithImage(petName, type, species, breed, age, status, imageFile, ownerId);
            response.put("success", true);
            response.put("message", "Pet saved successfully");
            response.put("pet", savedPet);
            return ResponseEntity.created(getLocation(savedPet.getId())).body(response);
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

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getPetImage(@PathVariable Long id) {
        System.out.println("Received request to get image for pet ID: " + id); // Debug log
    
        try {
            byte[] imageData = petService.getImageById(id);
            System.out.println("Image data successfully retrieved for pet ID: " + id); // Debug log
    
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
    
            return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
        } catch (RuntimeException e) {
            System.err.println("Error retrieving image for pet ID " + id + ": " + e.getMessage());
            e.printStackTrace();
    
            return ResponseEntity.notFound().build();
        }
    }
    
}

