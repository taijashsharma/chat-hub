package com.chat.websocket;

import java.security.Principal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.chat.entity.User;
import com.chat.enums.UserStatus;
import com.chat.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final UserRepository userRepository;

    // ✅ CONNECT → ONLINE
    @EventListener
public void handleConnect(SessionConnectEvent event) {

    Principal user = event.getUser();
    
    if (user == null || user.getName() == null) {
        System.out.println("❌ Unauthorized WS connection");
        return;
    }
    
    String phone = user.getName();
    
    // 🔥 EXTRA CHECK (VERY IMPORTANT)
    if (!phone.matches("\\d{10}")) { // basic validation
        System.out.println("❌ Invalid principal: " + phone);
        return;
    }

    User u = userRepository.findByPhoneNumber(phone).orElse(null);
    if (u != null) {
        u.setStatus(UserStatus.ONLINE);
        userRepository.save(u);
        messagingTemplate.convertAndSend(
            "/topic/status",
            u.getId() + ":ONLINE"
        );
    }
}

    // ✅ DISCONNECT → OFFLINE
    @EventListener
public void handleDisconnect(SessionDisconnectEvent event) {

    Principal user = event.getUser();
    if (user == null) return;

    String phone = user.getName();

    User u = userRepository.findByPhoneNumber(phone).orElse(null);
    if (u != null) {
        u.setStatus(UserStatus.OFFLINE);
        u.setLastSeen(LocalDateTime.now());
        userRepository.save(u);

        messagingTemplate.convertAndSend(
            "/topic/status",
            u.getId() + ":OFFLINE"
        );
    }
}
}