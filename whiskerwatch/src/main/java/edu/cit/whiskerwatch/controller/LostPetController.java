package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.dto.LostPetDTO;
import edu.cit.whiskerwatch.entity.LostPetCommentEntity;
import edu.cit.whiskerwatch.entity.LostPetEntity;
import edu.cit.whiskerwatch.service.LostPetCommentService;
import edu.cit.whiskerwatch.service.LostPetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/lostpets")
public class LostPetController {

    @Autowired
    private LostPetService lostPetService;

    @Autowired
    private LostPetCommentService commentService;

    @PostMapping
    public LostPetEntity createLostPet(@RequestBody LostPetDTO dto) {
        return lostPetService.createLostPet(dto);
    }

    @PostMapping("/{lostPetId}/comments")
    public LostPetCommentEntity addComment(
        @PathVariable Long lostPetId,
        @RequestParam Long userId,
        @RequestParam String commentText,
        @RequestParam(required = false) MultipartFile image
    ) throws IOException {
        return commentService.addCommentToLostPet(lostPetId, userId, commentText, image);
    }
}
