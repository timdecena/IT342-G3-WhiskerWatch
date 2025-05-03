package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.dto.LostAndFoundPetDTO;
import edu.cit.whiskerwatch.entity.LostAndFoundPetEntity;
import edu.cit.whiskerwatch.service.LostAndFoundPetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/lost-and-found")
public class LostAndFoundPetController {

    @Autowired
    private LostAndFoundPetService service;

    @GetMapping
    public List<LostAndFoundPetEntity> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LostAndFoundPetEntity> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reporter/{reporterId}")
    public List<LostAndFoundPetEntity> getByReporter(@PathVariable Long reporterId) {
        return service.getByReporter(reporterId);
    }

    // LostAndFoundPetController.java
    @PostMapping("/add/{reporterId}")
    public LostAndFoundPetEntity add(
        @PathVariable Long reporterId,
        @RequestPart("pet") LostAndFoundPetDTO petDTO,
        @RequestPart("image") MultipartFile image) throws IOException {
    return service.add(reporterId, petDTO, image);
    }


    @PutMapping("/{id}")
    public ResponseEntity<LostAndFoundPetEntity> update(@PathVariable Long id, @RequestBody LostAndFoundPetEntity pet) {
        return ResponseEntity.ok(service.update(id, pet));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<LostAndFoundPetEntity> updateImage(@PathVariable Long id,
            @RequestPart("image") MultipartFile image) throws IOException {
        return ResponseEntity.ok(service.updateImage(id, image));
    }
}
