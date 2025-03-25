package dedumocom.example.Login.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import dedumocom.example.Login.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
