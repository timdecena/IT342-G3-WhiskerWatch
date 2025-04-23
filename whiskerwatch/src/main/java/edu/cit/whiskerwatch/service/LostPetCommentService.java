package edu.cit.whiskerwatch.service;

import edu.cit.whiskerwatch.entity.LostPetCommentEntity;
import edu.cit.whiskerwatch.entity.LostPetEntity;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.LostPetCommentRepository;
import edu.cit.whiskerwatch.repository.LostPetRepository;
import edu.cit.whiskerwatch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class LostPetCommentService {
    @Autowired
    private LostPetCommentRepository commentRepo;

    @Autowired
    private LostPetRepository lostPetRepo;

    @Autowired
    private UserRepository userRepo;

    public LostPetCommentEntity addCommentToLostPet(Long lostPetId, Long userId, String commentText, MultipartFile image) throws IOException {
        LostPetEntity lostPet = lostPetRepo.findById(lostPetId)
                .orElseThrow(() -> new RuntimeException("Lost pet not found"));

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LostPetCommentEntity comment = new LostPetCommentEntity();
        comment.setCommentText(commentText);
        comment.setLostPet(lostPet);
        comment.setCommenter(user);
       

        if (image != null && !image.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            File dest = new File("uploads/" + filename);
            dest.getParentFile().mkdirs();
            image.transferTo(dest);
            comment.setImagePath("uploads/" + filename);
        }

        return commentRepo.save(comment);
    }
}