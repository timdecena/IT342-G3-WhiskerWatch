package edu.cit.whiskerwatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.cit.whiskerwatch.entity.LostPetEntity;

public interface LostPetRepository extends JpaRepository<LostPetEntity, Long> {}