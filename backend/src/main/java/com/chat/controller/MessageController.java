package com.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat.dto.message.MessageRequestDTO;
import com.chat.dto.message.MessageResponseDTO;
import com.chat.service.MessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @RequestBody MessageRequestDTO dto,
            Authentication auth
    ) {
        System.out.println("AUTH: " + auth);
        System.out.println("USER: " + auth.getName());
        return ResponseEntity.ok(messageService.sendMessage(dto, auth.getName()));
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<List<MessageResponseDTO>> getMessages( @PathVariable String chatId , Authentication auth){ 
        return ResponseEntity.ok(messageService.getMessages(chatId ,auth.getName()));
    }

     @PutMapping("/delivered/{chatId}")
     public void markDelivered(@PathVariable String chatId, Authentication auth){
         messageService.markDelivered(chatId, auth.getName());
     }

     @PutMapping("/seen/{chatId}")
      public void markSeen(
              @PathVariable String chatId,
              Authentication auth
      ){
          messageService.markSeen(chatId, auth.getName());
      }

      @DeleteMapping("/{id}")
      public ResponseEntity<String> deleteMessage(
              @PathVariable Long id,
              Authentication auth
      ){
          messageService.deleteMessage(id, auth.getName());
          return ResponseEntity.ok("Deleted");
      }
  
      @PutMapping("/{id}")
      public ResponseEntity<MessageResponseDTO> editMessage(
              @PathVariable Long id,
              @RequestBody MessageRequestDTO dto,
              Authentication auth
      ){
          return ResponseEntity.ok(
              messageService.editMessage(id, dto, auth.getName())
          );
      }
      @GetMapping("/scheduled/{chatId}")
      public ResponseEntity<List<MessageResponseDTO>> getScheduledMessages(
              @PathVariable String chatId,
              Authentication auth
      ){
          return ResponseEntity.ok(
              messageService.getScheduledMessages(chatId, auth.getName())
          );
      }    
}