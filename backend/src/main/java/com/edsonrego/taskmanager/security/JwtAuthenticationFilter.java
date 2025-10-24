package com.edsonrego.taskmanager.security;

import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        System.out.println("\n=============================");
        System.out.println("🔍 Requisição recebida:");
        System.out.println("URI: " + uri);
        System.out.println("Método: " + method);
        System.out.println("Authorization Header: " + header);
        System.out.println("=============================");

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            if (!jwtService.isTokenValid(token)) {
                System.out.println("❌ Token inválido ou expirado para URI: " + uri);
                chain.doFilter(request, response);
                return;
            }

            String email = jwtService.extractEmail(token);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                userService.findByEmail(email).ifPresentOrElse(user -> {
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("✅ Usuário autenticado: " + user.getEmail() + " (id=" + user.getId() + ")");
                }, () -> {
                    System.out.println("❌ Usuário do token não encontrado no banco: " + email);
                });
            }
        } catch (Exception e) {
            System.out.println("❌ Erro processando JWT: " + e.getMessage());
        }

        chain.doFilter(request, response);
    }
}
