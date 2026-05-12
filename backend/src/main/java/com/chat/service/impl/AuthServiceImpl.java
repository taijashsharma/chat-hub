package com.chat.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.chat.dto.auth.AuthResponseDTO;
import com.chat.dto.auth.LoginRequestDTO;
import com.chat.dto.auth.RegisterRequestDTO;
import com.chat.entity.User;
import com.chat.enums.UserStatus;
import com.chat.repository.UserRepository;
import com.chat.service.AuthService;
import com.chat.utils.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    @Override
    public AuthResponseDTO register(RegisterRequestDTO dto) {

        // email check
        if(userRepository
                .findByEmail(dto.getEmail())
                .isPresent()) {

            throw new RuntimeException("Email already exists");
        }

        // phone check
        if(userRepository
                .findByPhoneNumber(dto.getPhoneNumber())
                .isPresent()) {

            throw new RuntimeException("Phone number already exists");
        }

        User user = User.builder()
        .name(dto.getName())
        .phoneNumber(dto.getPhoneNumber())
        .email(dto.getEmail())
        .password(passwordEncoder.encode(dto.getPassword()))
        .status(UserStatus.OFFLINE)
        .about(dto.getAbout()) // या default
        .build();

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(

                savedUser.getPhoneNumber()
        );

        return AuthResponseDTO.builder()
        .userId(savedUser.getId())
        .name(savedUser.getName())
        .phoneNumber(savedUser.getPhoneNumber())
        .status(savedUser.getStatus())
        .email(savedUser.getEmail())
        .about(savedUser.getAbout())
        .token(token)
        .build();
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository

                .findByPhoneNumber(dto.getPhoneNumber())

                .orElseThrow(

                        () -> new RuntimeException("User not found")
                );

        if(!passwordEncoder.matches(

                dto.getPassword(),

                user.getPassword()

        )){

            throw new RuntimeException("Invalid password");
        }

        user.setStatus(UserStatus.ONLINE);
        user.setLastSeen(LocalDateTime.now()); 
        userRepository.save(user);

        String token = jwtUtil.generateToken(

                user.getPhoneNumber()
        );

        return AuthResponseDTO.builder()
        .userId(user.getId())
        .name(user.getName())
        .phoneNumber(user.getPhoneNumber())
        .email(user.getEmail())
        .status(user.getStatus())
        .about(user.getAbout())
        .token(token)
        .build();
    }
}