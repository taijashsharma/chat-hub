package com.chat.service;

import java.util.List;

import com.chat.dto.chat.ChatRoomRequestDTO;
import com.chat.dto.chat.ChatRoomResponseDTO;

public interface ChatRoomService {

    ChatRoomResponseDTO createChatRoom(ChatRoomRequestDTO dto, String phone);

    String getChatId(Long senderId, Long receiverId);

    List<ChatRoomResponseDTO> getUserChats(String phone);
}