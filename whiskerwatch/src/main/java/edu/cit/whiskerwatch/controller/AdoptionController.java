package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.entity.AdoptionEntity;
import edu.cit.whiskerwatch.service.AdoptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adoptions")
public class AdoptionController {
    @Autowired
    private AdoptionService adoptionService;

    @GetMapping
    public List<AdoptionEntity> getAllAdoptions() {
        return adoptionService.getAllAdoptions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdoptionEntity> getAdoptionById(@PathVariable Long id) {
        Optional<AdoptionEntity> adoption = adoptionService.getAdoptionById(id);
        return adoption.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/request/{petId}")
    public ResponseEntity<?> requestAdoption(@PathVariable Long petId, HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        UserEntity adopter = userRepository.findByEmail(email)
            .orElseThrow(() -> RuntimeException("User not found"));

            AdoptionEntity adoption = adoptionService.createAdoption(petId, adopter.getId());
            return ResponseEntity.ok(adoption);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AdoptionEntity> updateAdoptionStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(adoptionService.updateAdoptionStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdoption(@PathVariable Long id) {
        adoptionService.deleteAdoption(id);
        return ResponseEntity.noContent().build();
    }
}
