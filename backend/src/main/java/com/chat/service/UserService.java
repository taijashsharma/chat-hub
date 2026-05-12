package com.chat.service;

import org.springframework.data.domain.Page;

import com.chat.dto.user.UserRequestDTO;
import com.chat.dto.user.UserResponseDTO;

public interface UserService {

    UserResponseDTO getCurrentUser(String phone);

    UserResponseDTO updateUser(Long id, UserRequestDTO dto);

    Page<UserResponseDTO> searchUser(String keyword, int page, int size);

    void updateOnlineStatus(Long userId, boolean online);

    void deleteUser(Long id);
}