package com.chat.utils;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String SECRET = "chatappchatappchatappchatapp1234567890securekey";

    private final Key key = Keys.hmacShaKeyFor(

            SECRET.getBytes()
    );

    public String generateToken(String phoneNumber){

        return Jwts.builder()

                .setSubject(phoneNumber)

                .setIssuedAt(new Date())

                .setExpiration(

                        new Date(

                                System.currentTimeMillis()

                                        + 1000 * 60 * 60 * 24

                        )
                )

                .signWith(key, SignatureAlgorithm.HS256)

                .compact();
    }

    public String extractPhone(String token){

        return Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody()

                .getSubject();
    }

    public boolean validateToken(String token, String phone) {

        final String extractedPhone = extractPhone(token);
    
        return extractedPhone.equals(phone) && !isTokenExpired(token);
    }
    
    private boolean isTokenExpired(String token) {
    
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    
        return expiration.before(new Date());
    }    

}