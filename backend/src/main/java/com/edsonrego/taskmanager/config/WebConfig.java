package com.edsonrego.taskmanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 🌐 WebConfig
 *
 * Configuração adicional de CORS e MVC.
 * Mantém compatibilidade total com o SecurityConfig (sem conflito).
 * Esta configuração é aplicada em controladores REST e endpoints públicos.
 */
@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "http://127.0.0.1:5173" // ✅ adicionado para compatibilidade com testes locais
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("Authorization", "Content-Type")
                        .exposedHeaders("Authorization")
                        .allowCredentials(true)
                        .maxAge(3600); // ✅ cache das preflight requests (melhor performance)
            }
        };
    }
}
