package com.chat.dto.auth;

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
public class AuthResponseDTO {

    private Long userId;
    private String name;
    private String phoneNumber;
    private UserStatus status;
    private String email;
    private String token;
    private String about;

}