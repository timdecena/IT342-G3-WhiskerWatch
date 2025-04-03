package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.entity.PetEntity;
import edu.cit.whiskerwatch.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @PutMapping("/{id}")
    public ResponseEntity<PetEntity> updatePet(@PathVariable Long id, @RequestBody PetEntity pet) {
        return ResponseEntity.ok(petService.updatePet(id, pet));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }

@DeleteMapping("/deleteAll")
public ResponseEntity<Void> deleteAllPets() {
    petService.deleteAllPets();
    return ResponseEntity.noContent().build();
}

}