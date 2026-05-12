package com.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat.dto.notification.NotificationDTO;
import com.chat.dto.notification.NotificationResponseDTO;
import com.chat.service.NotificationService;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<NotificationResponseDTO> create(
            @RequestBody NotificationDTO dto,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                notificationService.create(dto, auth.getName())
        );
    }

    // ================= GET MY NOTIFICATIONS =================
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getUserNotifications(
            Authentication auth
    ) {
        return ResponseEntity.ok(
                notificationService.getUserNotifications(auth.getName())
        );
    }

    // ================= MARK AS SEEN =================
    @PutMapping("/seen/{id}")
    public ResponseEntity<String> markSeen(
            @PathVariable Long id,
            Authentication auth
    ) {
        notificationService.markAsSeen(id, auth.getName()); 
        return ResponseEntity.ok("seen updated");
    }

    // ================= UNREAD COUNT =================
    @GetMapping("/unread")
    public ResponseEntity<Long> unreadCount(Authentication auth) {
        return ResponseEntity.ok(
                notificationService.getUnreadCount(auth.getName())
        );
    }
}