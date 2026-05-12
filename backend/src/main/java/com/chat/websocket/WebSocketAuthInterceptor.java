package com.chat.websocket;


import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import com.chat.utils.JwtUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {

                    String token = accessor.getFirstNativeHeader("Authorization");
                
                    if (token == null || !token.startsWith("Bearer ")) {
                        throw new IllegalArgumentException("❌ No token in WS CONNECT");
                    }
                
                    token = token.substring(7);
                
                    String phone = jwtUtil.extractPhone(token);
                
                    if (phone == null) {
                        throw new IllegalArgumentException("❌ Invalid token");
                    }
                
                    accessor.setUser(() -> phone);
                }

        return message;
    }
}