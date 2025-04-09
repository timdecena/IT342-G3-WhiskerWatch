package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.entity.AdoptionEntity;
import edu.cit.whiskerwatch.service.AdoptionService;
import jakarta.servlet.http.HttpServletRequest;
import edu.cit.whiskerwatch.security.JwtUtil;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.UserRepository;

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

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

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
public ResponseEntity<?> requestAdoption(@PathVariable Long petId, HttpServletRequest request) {
    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(401).body("Unauthorized");
    }

    String token = authHeader.substring(7);
    String email = jwtUtil.extractEmail(token);
    UserEntity adopter = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    AdoptionEntity adoption = adoptionService.createAdoption(petId, adopter.getId());
    return ResponseEntity.ok(adoption);
}

@PutMapping("/{id}/status")
public ResponseEntity<?> updateAdoptionStatus(
        @PathVariable Long id,
        @RequestParam String status,
        HttpServletRequest request) {

    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(401).body("Unauthorized");
    }

    String token = authHeader.substring(7);
    String email = jwtUtil.extractEmail(token);
    UserEntity currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Fetch the adoption request to check pet ownership
    Optional<AdoptionEntity> adoptionOpt = adoptionService.getAdoptionById(id);
    if (adoptionOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    AdoptionEntity adoption = adoptionOpt.get();
    UserEntity petOwner = adoption.getPet().getOwner();

    if (!petOwner.getId().equals(currentUser.getId())) {
        return ResponseEntity.status(403).body("Forbidden: Only the pet owner can update this adoption request.");
    }

    // If authorized, proceed to update
    AdoptionEntity updatedAdoption = adoptionService.updateAdoptionStatus(id, status);
    return ResponseEntity.ok(updatedAdoption);
}


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdoption(@PathVariable Long id) {
        adoptionService.deleteAdoption(id);
        return ResponseEntity.noContent().build();
    }
}
