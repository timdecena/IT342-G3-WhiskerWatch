package edu.cit.whiskerwatch.repository;

import edu.cit.whiskerwatch.entity.Message;
import edu.cit.whiskerwatch.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId OR m.recipient.id = :userId) ORDER BY m.createdAt DESC")
    List<Message> findAllUserMessages(@Param("userId") Long userId);
    
    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender.id = :userId1 AND m.recipient.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.recipient.id = :userId1) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("userId1") Long userId1, 
                                  @Param("userId2") Long userId2);

     @Query("SELECT m FROM Message m WHERE m.sender.id = :userId OR m.recipient.id = :userId ORDER BY m.createdAt DESC")
     List<Message> findBySenderOrRecipient(@Param("userId") Long userId);
                                  
}