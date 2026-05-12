package com.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat.dto.chat.ChatRoomRequestDTO;
import com.chat.dto.chat.ChatRoomResponseDTO;
import com.chat.service.ChatRoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chatroom")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    // CREATE CHAT
    @PostMapping
    public ResponseEntity<ChatRoomResponseDTO> createChatRoom(
            @RequestBody ChatRoomRequestDTO dto,
             Authentication auth
            
    ) {
        return ResponseEntity.ok(chatRoomService.createChatRoom(dto, auth.getName()));
    }

    // GET MY CHATS
    @GetMapping("/my")
    public ResponseEntity<List<ChatRoomResponseDTO>> getMyChats(
            Authentication auth
    ) {
        return ResponseEntity.ok(
                chatRoomService.getUserChats(auth.getName())
        );
    }
    
}