package com.chat.service.impl;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.chat.dto.user.UserRequestDTO;
import com.chat.dto.user.UserResponseDTO;
import com.chat.entity.User;
import com.chat.enums.UserStatus;
import com.chat.repository.UserRepository;
import com.chat.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // ================= CURRENT USER =================
    @Override
    public UserResponseDTO getCurrentUser(String phone) {

        User user = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return map(user);
    }

    // ================= UPDATE USER =================
    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //  validation
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName());
        }

        if (dto.getProfilePic() != null) {
            user.setProfilePic(dto.getProfilePic());
        }

        if (dto.getAbout() != null) {
            user.setAbout(dto.getAbout());
        }

        if (dto.getStatus() != null) {
            user.setStatus(dto.getStatus());
        }

        return map(userRepository.save(user));
    }

    // ================= SEARCH + PAGINATION =================
    @Override
    public Page<UserResponseDTO> searchUser(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        Page<User> users = userRepository
                .findByNameContainingIgnoreCaseOrPhoneNumberContaining(
                        keyword,
                        keyword,
                        pageable
                );

        return users.map(this::map);
    }

    // ================= ONLINE STATUS =================
    @Override
    public void updateOnlineStatus(Long userId, boolean online) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(online ? UserStatus.ONLINE : UserStatus.OFFLINE);

        if (!online) {
            user.setLastSeen(LocalDateTime.now());
        }

        userRepository.save(user);
    }

    // ================= DELETE USER =================
    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

    // ================= MAPPER =================
    private UserResponseDTO map(User u) {
        

        return UserResponseDTO.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .profilePic(u.getProfilePic())
                .about(u.getAbout())
                .lastSeen(u.getLastSeen())
                .status(u.getStatus())
                .build();
    }
}