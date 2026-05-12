package com.chat.config;

import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class JwtAuthentication
        extends UsernamePasswordAuthenticationToken {

    public JwtAuthentication(String phone) {

        super(phone, null, Collections.emptyList());
    }
}