package com.edsonrego.taskmanager.security;

import com.edsonrego.taskmanager.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;

/**
 * Serviço responsável por gerar e validar tokens JWT.
 */
@Service
public class JwtService {

    private final Key key;

    public JwtService(@Value("${jwt.secret:change-this-super-secret-key-at-least-32-bytes-long}") String secret) {
        byte[] bytes;
        try {
            // 🔹 Tenta decodificar como Base64
            bytes = Decoders.BASE64.decode(secret);
        } catch (Exception e) {
            // 🔹 Se não for Base64, usa como texto puro (UTF-8)
            bytes = secret.getBytes(StandardCharsets.UTF_8);
        }

        // 🔹 Garante que a chave tenha comprimento suficiente (>= 32 bytes)
        if (bytes.length < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 32 bytes long");
        }

        this.key = Keys.hmacShaKeyFor(bytes);
    }

    /**
     * 🔑 Gera um token JWT para o usuário.
     */
    public String generateToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(86400))) // 24h
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 📬 Extrai o e-mail (subject) de um token JWT.
     */
    public String extractEmail(String token) {
        return getAllClaims(token).getSubject();
    }

    /**
     * ✅ Verifica se o token é válido e não expirou.
     */
    public boolean isTokenValid(String token) {
        try {
            getAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 🔍 Retorna todas as claims do token.
     */
    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
