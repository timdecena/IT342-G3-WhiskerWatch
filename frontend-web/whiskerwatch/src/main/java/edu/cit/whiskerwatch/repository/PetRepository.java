package edu.cit.whiskerwatch.repository;

import edu.cit.whiskerwatch.entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetRepository extends JpaRepository<PetEntity, Long> {
    List<PetEntity> findByOwnerId(Long ownerId); // Fetch pets by owner ID

    List<PetEntity> findByOwnerIsNull(); // Fetch pets that have no owner

}
