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

/**
 * 🔐 JwtAuthenticationFilter
 *
 * Filtro executado uma vez por requisição para validar o token JWT.
 * Caso o token seja válido, o usuário é autenticado no SecurityContext.
 */
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
                                    FilterChain chain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        System.out.println("\n=============================");
        System.out.println("🔍 Requisição recebida:");
        System.out.println("URI: " + uri);
        System.out.println("Método: " + method);
        System.out.println("Authorization Header: " + header);
        System.out.println("=============================");

        // 🔸 Se não houver header Authorization, segue sem autenticação
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            // 🔸 Verifica se o token é válido
            if (!jwtService.isTokenValid(token)) {
                System.out.println("❌ Token inválido ou expirado para URI: " + uri);
                chain.doFilter(request, response);
                return;
            }

            // 🔸 Extrai o e-mail (subject) do token
            String email = jwtService.extractEmail(token);

            // 🔸 Evita redefinir autenticação se já estiver autenticado
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                userService.findByEmail(email).ifPresentOrElse(user -> {
                    // ✅ Usa CustomUserPrincipal (implementa UserDetails)
                    CustomUserPrincipal principal = new CustomUserPrincipal(user);

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    principal, null, principal.getAuthorities());

                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // ✅ Registra autenticação no SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    System.out.println("✅ Usuário autenticado e registrado no SecurityContext: "
                            + principal.getUsername() + " (id=" + user.getId() + ")");
                }, () -> {
                    System.out.println("❌ Usuário do token não encontrado no banco: " + email);
                });
            }
        } catch (Exception e) {
            System.out.println("❌ Erro processando JWT: " + e.getMessage());
        }

        // 🔸 Continua a cadeia de filtros normalmente
        chain.doFilter(request, response);
    }
}
