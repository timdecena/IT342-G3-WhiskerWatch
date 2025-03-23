package com.whiskerwatch.decenabeldadsaceda.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.whiskerwatch.decenabeldadsaceda.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    // Custom query methods if needed
}
