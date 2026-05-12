package com.chat.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chat.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByChatIdOrderByTimestampAsc(String chatId);
    List<Message> findByChatIdAndReceiver_Id(String chatId,Long receiverId);
    List<Message> findByChatId(String chatId);
    List<Message> findByScheduledTrueAndScheduledTimeBefore(LocalDateTime time);
    List<Message> findByChatIdAndScheduledFalseOrderByTimestampAsc(String chatId);
    List<Message> findTop50ByScheduledTrueAndScheduledTimeBefore(LocalDateTime time);
    List<Message> findByChatIdAndScheduledTrueOrderByTimestampAsc(String chatId);
}