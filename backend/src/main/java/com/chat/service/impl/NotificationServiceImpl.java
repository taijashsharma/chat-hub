package com.chat.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.chat.dto.notification.NotificationDTO;
import com.chat.dto.notification.NotificationResponseDTO;
import com.chat.entity.Notification;
import com.chat.entity.User;
import com.chat.enums.NotificationType;
import com.chat.repository.NotificationRepository;
import com.chat.repository.UserRepository;
import com.chat.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ================= CREATE =================
    @Override
    public NotificationResponseDTO create(NotificationDTO dto, String phone) {

        // 🔥 sender from JWT
        User sender = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // 🔥 receiver from DTO
        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Notification notification = Notification.builder()
                .userId(receiver.getId())        // receiver
                .senderId(sender.getId())        // 🔥 FIXED
                .message(dto.getMessage())
                .type(dto.getType() != null ? dto.getType() : NotificationType.SYSTEM)
                .referenceId(dto.getReferenceId())
                .chatId(dto.getChatId())         // optional
                .seen(false)
                .timestamp(LocalDateTime.now())
                .build();

        return map(notificationRepository.save(notification));
    }

    // ================= GET MY NOTIFICATIONS =================
    @Override
    public List<NotificationResponseDTO> getUserNotifications(String phone) {

        User user = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository
                .findByUserIdOrderByTimestampDesc(user.getId())
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    // ================= MARK SEEN =================
    @Override
    public void markAsSeen(Long id, String phone) {
    
        User user = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));
    
        Notification notification = notificationRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    
        // 🔥 SECURITY CHECK
        if (!notification.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
    
        notification.setSeen(true);
    
        notificationRepository.save(notification);
    }

    // ================= UNREAD COUNT =================
    @Override
    public long getUnreadCount(String phone) {

        User user = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository
                .countByUserIdAndSeenFalse(user.getId());
    }

    // ================= MAPPER =================
    private NotificationResponseDTO map(Notification n) {

        return NotificationResponseDTO.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .senderId(n.getSenderId())   // 🔥 ADD
                .message(n.getMessage())
                .type(n.getType())
                .seen(n.isSeen())
                .timestamp(n.getTimestamp())
                .referenceId(n.getReferenceId())
                .chatId(n.getChatId())       // 🔥 ADD
                .build();
    }
}