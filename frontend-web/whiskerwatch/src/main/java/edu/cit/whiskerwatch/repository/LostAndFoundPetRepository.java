package edu.cit.whiskerwatch.repository;

import edu.cit.whiskerwatch.entity.LostAndFoundPetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostAndFoundPetRepository extends JpaRepository<LostAndFoundPetEntity, Long> {
    List<LostAndFoundPetEntity> findByReporterId(Long reporterId);
}
