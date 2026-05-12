package com.chat.dto.notification;

import java.time.LocalDateTime;

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
public class NotificationResponseDTO {

    private Long id;

    private Long userId;

    private String message;

    private NotificationType type;

    private boolean seen;

    private LocalDateTime timestamp;

    private String referenceId;
    private Long senderId;  
    private String chatId;  
}