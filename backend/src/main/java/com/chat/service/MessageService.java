package com.chat.service;

import java.util.List;

import com.chat.dto.message.MessageRequestDTO;
import com.chat.dto.message.MessageResponseDTO;

public interface MessageService {

    MessageResponseDTO sendMessage(MessageRequestDTO dto,String phoneNumber);

    List<MessageResponseDTO> getMessages(String chatId,String phoneNumber);

    void markDelivered(String chatId, String phoneNumber);

    void markSeen(String chatId,String phoneNumber);

    void deleteMessage(Long id, String phoneNumber);
    
    MessageResponseDTO editMessage(Long id, MessageRequestDTO dto ,String phoneNumber);

    List<MessageResponseDTO> getScheduledMessages(String chatId, String phoneNumber);


}