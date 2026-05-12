package com.chat.dto.message;

import java.time.LocalDateTime;

import com.chat.enums.MessageStatus;
import com.chat.enums.MessageType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponseDTO {

    private Long id;
    private String chatId;
    private Long senderId;
    private Long receiverId;
    private MessageType messageType;
    private String content;
    private LocalDateTime timestamp;
    private MessageStatus status;
    private Boolean scheduled;           
    private LocalDateTime scheduledTime;
}