package edu.cit.whiskerwatch.controller;

import edu.cit.whiskerwatch.entity.Message;
import edu.cit.whiskerwatch.entity.UserEntity;
import edu.cit.whiskerwatch.repository.MessageRepository;
import edu.cit.whiskerwatch.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageController(MessageRepository messageRepository, 
                           UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Message>> getUserMessages(@AuthenticationPrincipal UserEntity user) {
        List<Message> messages = messageRepository.findAllUserMessages(user.getId());
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/conversation/{otherUserId}")
public ResponseEntity<List<Message>> getConversation(
    Authentication authentication,
    @PathVariable Long otherUserId)
{
    UserEntity user = (UserEntity) authentication.getPrincipal();  // 🛠 cast manually
    List<Message> messages = messageRepository.findConversation(user.getId(), otherUserId);
    return ResponseEntity.ok(messages);
}

    @PostMapping("/send/{recipientId}")
    public ResponseEntity<Message> sendMessage(
            @AuthenticationPrincipal UserEntity sender,
            @PathVariable Long recipientId,
            @RequestBody String content) {
        
        UserEntity recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        
        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        
        Message savedMessage = messageRepository.save(message);
        return ResponseEntity.ok(savedMessage);
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId) {
        messageRepository.findById(messageId).ifPresent(message -> {
            message.setRead(true);
            messageRepository.save(message);
        });
        return ResponseEntity.ok().build();
    }
}