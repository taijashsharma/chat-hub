package com.chat.dto.notification;

import com.chat.enums.NotificationType;

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
public class NotificationDTO {

    private Long receiverId;
    private String message;
    private NotificationType type;
    private String referenceId;
    private String chatId; 
}