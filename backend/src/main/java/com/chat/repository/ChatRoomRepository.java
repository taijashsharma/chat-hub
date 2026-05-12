package com.chat.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chat.entity.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByUser1IdAndUser2Id(Long user1, Long user2);

    List<ChatRoom> findByUser1IdOrUser2Id(Long user1, Long user2);

    Optional<ChatRoom> findByChatId(String chatId);
}