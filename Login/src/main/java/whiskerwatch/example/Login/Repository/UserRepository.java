package whiskerwatch.example.Login.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import whiskerwatch.example.Login.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
