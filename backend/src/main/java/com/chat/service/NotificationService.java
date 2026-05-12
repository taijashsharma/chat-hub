package com.chat.service;

import java.util.List;

import com.chat.dto.notification.NotificationDTO;
import com.chat.dto.notification.NotificationResponseDTO;

public interface NotificationService {

    NotificationResponseDTO create(NotificationDTO dto ,String phone);

    List<NotificationResponseDTO> getUserNotifications(String phone);

    void markAsSeen(Long notificationId ,String phone);

    long getUnreadCount(String phone);
}