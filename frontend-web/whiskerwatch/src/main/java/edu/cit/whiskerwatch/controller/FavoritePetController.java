package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.entity.FavoritePet;
import edu.cit.whiskerwatch.service.FavoritePetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoritePetController {
    private final FavoritePetService favoritePetService;

    public FavoritePetController(FavoritePetService favoritePetService) {
        this.favoritePetService = favoritePetService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<FavoritePet>> getFavoritePets(@PathVariable Long userId) {
        return ResponseEntity.ok(favoritePetService.getFavoritePets(userId));
    }

    @PostMapping("/add/{userId}/{petId}")
    public ResponseEntity<String> addFavoritePet(@PathVariable Long userId, @PathVariable Long petId) {
        favoritePetService.addFavoritePet(userId, petId);
        return ResponseEntity.ok("Pet added to favorites");
    }

    @DeleteMapping("/remove/{userId}/{petId}")
    public ResponseEntity<String> removeFavoritePet(@PathVariable Long userId, @PathVariable Long petId) {
        favoritePetService.removeFavoritePet(userId, petId);
        return ResponseEntity.ok("Pet removed from favorites");
    }
}