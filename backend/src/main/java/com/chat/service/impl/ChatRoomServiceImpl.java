package com.chat.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.chat.dto.chat.ChatRoomRequestDTO;
import com.chat.dto.chat.ChatRoomResponseDTO;
import com.chat.entity.ChatRoom;
import com.chat.entity.User;
import com.chat.repository.ChatRoomRepository;
import com.chat.repository.UserRepository;
import com.chat.service.ChatRoomService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    // ================= CREATE CHAT =================
    @Override
public ChatRoomResponseDTO createChatRoom(ChatRoomRequestDTO dto, String phone) {

    User sender = userRepository
            .findByPhoneNumber(phone)
            .orElseThrow(() -> new RuntimeException("Sender not found"));

    User receiver = userRepository
            .findById(dto.getReceiverId())
            .orElseThrow(() -> new RuntimeException("Receiver not found"));

    Long u1 = Math.min(sender.getId(), receiver.getId());
    Long u2 = Math.max(sender.getId(), receiver.getId());

    ChatRoom existing = chatRoomRepository
            .findByUser1IdAndUser2Id(u1, u2)
            .orElse(null);

    if (existing != null) {
        return map(existing);
    }

    // 🔥 fetch normalized users
    User user1 = userRepository.findById(u1).orElseThrow();
    User user2 = userRepository.findById(u2).orElseThrow();

    ChatRoom chatRoom = ChatRoom.builder()
            .chatId(UUID.randomUUID().toString())
            .user1(user1)
            .user2(user2)
            .build();

    return map(chatRoomRepository.save(chatRoom));
}

    // ================= GET CHAT ID =================
    @Override
    public String getChatId(Long senderId, Long receiverId) {

        Long u1 = Math.min(senderId, receiverId);
        Long u2 = Math.max(senderId, receiverId);

        return chatRoomRepository
                .findByUser1IdAndUser2Id(u1, u2)
                .map(ChatRoom::getChatId)
                .orElse(UUID.randomUUID().toString());
    }

    // ================= GET MY CHATS =================
    @Override
    public List<ChatRoomResponseDTO> getUserChats(String phone) {

        User user = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ChatRoom> chats = chatRoomRepository
                .findByUser1IdOrUser2Id(user.getId(), user.getId());

        return chats.stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    // ================= MAPPER =================
    private ChatRoomResponseDTO map(ChatRoom room) {

        return ChatRoomResponseDTO.builder()
                .chatId(room.getChatId())
                .senderId(room.getUser1().getId())
                .receiverId(room.getUser2().getId())
                .build();
    }
}