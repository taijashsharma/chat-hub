package com.chat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
    
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable())
            )
    
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/uploads/**").permitAll()
                    .requestMatchers("/ws/**", "/ws/info/**").permitAll()
                    .requestMatchers("/api/users/**").authenticated()
                    .requestMatchers("/api/chatroom/**").authenticated()
                    .requestMatchers("/api/message/**").authenticated()
                    .requestMatchers("/api/file/**").authenticated()
                    .requestMatchers("/api/group/**").authenticated()
                    .requestMatchers("/api/notification/**").authenticated()
                    .anyRequest().authenticated()
            )
    
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
    
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    
        return http.build();
    }    
}