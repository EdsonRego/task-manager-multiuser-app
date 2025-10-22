package com.edsonrego.taskmanager.controller;

import com.edsonrego.taskmanager.dto.UserDTO;
import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 🔹 Retorna todos os usuários
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.findAll().stream()
                .map(u -> new UserDTO(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), u.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // 🔹 Cria novo usuário (com retorno padronizado em DTO)
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }

        User saved = userService.save(user);
        UserDTO dto = new UserDTO(
                saved.getId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getCreatedAt()
        );

        return ResponseEntity.ok(dto);
    }

    // 🔹 Busca usuário por e-mail
    @GetMapping("/find")
    public ResponseEntity<?> findByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(u -> new UserDTO(
                        u.getId(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getEmail(),
                        u.getCreatedAt()
                ))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
