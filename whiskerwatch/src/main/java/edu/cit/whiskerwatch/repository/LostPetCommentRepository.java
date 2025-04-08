package edu.cit.whiskerwatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.cit.whiskerwatch.entity.LostPetCommentEntity;

public interface LostPetCommentRepository extends JpaRepository<LostPetCommentEntity, Long> {}