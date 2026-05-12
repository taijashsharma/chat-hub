package com.chat.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.chat.dto.message.MessageRequestDTO;

@Controller
public class ChatWebSocketController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public MessageRequestDTO sendMessage(MessageRequestDTO message) {

        return message;
    }
}