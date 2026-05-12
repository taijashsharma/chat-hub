package com.chat.dto.message;

import java.time.LocalDateTime;

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
public class MessageRequestDTO {

    private String chatId;
    private Long senderId;
    private Long receiverId;
    private String content;
    private MessageType messageType;
    private Boolean scheduled;           
    private LocalDateTime scheduledTime;
}