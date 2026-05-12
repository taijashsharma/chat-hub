package com.chat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chat.entity.Attachment;

public interface AttachmentRepository
        extends JpaRepository<Attachment, Long> {

    List<Attachment> findByChatId(String chatId);
}