package edu.cit.whiskerwatch.repository;

import edu.cit.whiskerwatch.entity.AdoptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdoptionRepository extends JpaRepository<AdoptionEntity, Long> {
    List<AdoptionEntity> findByAdopterId(Long adopterId);
    List<AdoptionEntity> findByPetId(Long petId);
}
