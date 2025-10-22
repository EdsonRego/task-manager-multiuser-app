package com.edsonrego.taskmanager.controller;

import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.repository.UserRepository;
import com.edsonrego.taskmanager.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final Key secretKey;

    public AuthController(
            UserRepository userRepository,
            UserService userService,
            @Value("${jwt.secret:change-this-super-secret-key-at-least-32-bytes-long}") String secret) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (userService.validatePassword(password, user.getPassword())) {
                        String token = generateToken(user);
                        Map<String, Object> response = new HashMap<>();
                        response.put("token", token);
                        response.put("email", user.getEmail());
                        response.put("user", user.getFirstName() + " " + user.getLastName());
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
                    }
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    private String generateToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(86400))) // 24h
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
}
