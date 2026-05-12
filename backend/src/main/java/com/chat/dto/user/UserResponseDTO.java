package com.chat.dto.user;

import java.time.LocalDateTime;

import com.chat.enums.UserStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String profilePic;

    private String about;

    private LocalDateTime lastSeen;

    private UserStatus status;
}