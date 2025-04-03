package edu.cit.whiskerwatch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.whiskerwatch.entity.AdoptionEntity;

public interface AdoptionRepository extends JpaRepository<AdoptionEntity, Long> {
    List<AdoptionEntity> findByAdopterId(Long adopterId);
    List<AdoptionEntity> findByPetId(Long petId);
    
    Optional<AdoptionEntity> findByPetIdAndAdopterIdAndStatus(Long petId, Long adopterId, String status);
}
