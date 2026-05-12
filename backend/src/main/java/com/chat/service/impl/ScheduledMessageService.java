package com.chat.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.chat.dto.message.MessageResponseDTO;
import com.chat.entity.Message;
import com.chat.enums.MessageStatus;
import com.chat.enums.UserStatus;
import com.chat.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScheduledMessageService {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate =  30000)
    public void sendScheduledMessages() {

        List<Message> pending = messageRepository
                .findByScheduledTrueAndScheduledTimeBefore(LocalDateTime.now());

        for(Message m : pending){

            MessageStatus status = MessageStatus.SENT;

            if (m.getReceiver() != null &&
                m.getReceiver().getStatus() == UserStatus.ONLINE) {
                status = MessageStatus.DELIVERED;
            }
            
            m.setScheduled(false);
            m.setStatus(status);

            Message saved = messageRepository.save(m);

            MessageResponseDTO dto = MessageResponseDTO.builder()
                    .id(saved.getId())
                    .chatId(saved.getChatId())
                    .senderId(saved.getSender().getId())
                    .receiverId(saved.getReceiver()!=null ? saved.getReceiver().getId() : null)
                    .content(saved.getContent())
                    .timestamp(saved.getTimestamp())
                    .messageType(saved.getMessageType())
                    .status(saved.getStatus())
                    .scheduled(false)
                    .scheduledTime(null)
                    .build();

            messagingTemplate.convertAndSend(
                "/topic/messages/" + saved.getChatId(),
                dto
            );
        }
    }

}