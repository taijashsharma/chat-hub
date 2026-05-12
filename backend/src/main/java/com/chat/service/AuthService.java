package com.chat.service;

import com.chat.dto.auth.LoginRequestDTO;
import com.chat.dto.auth.RegisterRequestDTO;
import com.chat.dto.auth.AuthResponseDTO;

public interface AuthService {

    AuthResponseDTO register(RegisterRequestDTO dto);

    AuthResponseDTO login(LoginRequestDTO dto);

}