package edu.cit.whiskerwatch.repository;

import edu.cit.whiskerwatch.entity.FavoritePet;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.entity.PetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoritePetRepository extends JpaRepository<FavoritePet, Long> {
    List<FavoritePet> findByUser(UserEntity user);
    boolean existsByUserAndPet(UserEntity user, PetEntity pet);
    void deleteByUserAndPet(UserEntity user, PetEntity pet);
}