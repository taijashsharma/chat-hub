package com.chat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chat.entity.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByChatId(String chatId);
}