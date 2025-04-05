package edu.cit.whiskerwatch.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.whiskerwatch.dto.AdoptionRequestDTO;
import edu.cit.whiskerwatch.entity.AdoptionEntity;
import edu.cit.whiskerwatch.service.AdoptionService;

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

    @PostMapping("/request/{petId}/{adopterId}")
    public AdoptionEntity requestAdoption(
            @PathVariable Long petId,
            @PathVariable Long adopterId,
            @RequestBody AdoptionRequestDTO requestDTO
    ) {
        return adoptionService.createAdoption(petId, adopterId, requestDTO);
    }
    @PutMapping("/update-status/{adoptionId}/{userId}")
public AdoptionEntity updateStatus(@PathVariable Long adoptionId, @PathVariable Long userId, @RequestParam String status) {
    return adoptionService.updateAdoptionStatus(adoptionId, userId, status);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdoption(@PathVariable Long id) {
        adoptionService.deleteAdoption(id);
        return ResponseEntity.noContent().build();
    }
}
