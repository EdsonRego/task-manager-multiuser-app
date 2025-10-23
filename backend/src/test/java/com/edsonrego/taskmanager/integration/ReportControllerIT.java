package com.edsonrego.taskmanager.integration;

import com.edsonrego.taskmanager.service.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class ReportControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportService reportService;

    @BeforeEach
    void setup() {
        // Configura mocks para simular o comportamento do serviço
        when(reportService.getSummary()).thenReturn(List.of(
                Map.of("user", "Edson Rego", "totalTasks", 10, "completedTasks", 8)
        ));

        when(reportService.recalculateCompletion()).thenReturn(List.of(
                Map.of("user", "Edson Rego", "completionRate", 80.0)
        ));
    }

    @Test
    @DisplayName("GET /api/reports/summary → deve retornar resumo consolidado com status 200")
    void testGetSummary() throws Exception {
        mockMvc.perform(get("/api/reports/summary"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].user").value("Edson Rego"))
                .andExpect(jsonPath("$[0].totalTasks").value(10))
                .andExpect(jsonPath("$[0].completedTasks").value(8));
    }

    @Test
    @DisplayName("GET /api/reports/summary → deve retornar 204 quando lista estiver vazia")
    void testGetSummaryNoContent() throws Exception {
        when(reportService.getSummary()).thenReturn(List.of());

        mockMvc.perform(get("/api/reports/summary"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("POST /api/reports/recalculate → deve retornar métricas recalculadas com status 200")
    void testRecalculateCompletion() throws Exception {
        mockMvc.perform(post("/api/reports/recalculate"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].user").value("Edson Rego"))
                .andExpect(jsonPath("$[0].completionRate").value(80.0));
    }

    @Test
    @DisplayName("POST /api/reports/recalculate → deve retornar 204 quando não houver dados")
    void testRecalculateCompletionNoContent() throws Exception {
        when(reportService.recalculateCompletion()).thenReturn(List.of());

        mockMvc.perform(post("/api/reports/recalculate"))
                .andExpect(status().isNoContent())
                .andExpect(content().string("No data returned from recalculation."));
    }

    @Test
    @DisplayName("GET /api/reports/health → deve retornar OK quando o serviço estiver operacional")
    void testHealthOk() throws Exception {
        mockMvc.perform(get("/api/reports/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OK"))
                .andExpect(jsonPath("$.message").value("Reports module is operational."));
    }

    @Test
    @DisplayName("GET /api/reports/health → deve retornar erro 500 quando houver exceção")
    void testHealthError() throws Exception {
        when(reportService.getSummary()).thenThrow(new RuntimeException("View not found"));

        mockMvc.perform(get("/api/reports/health"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value("ERROR"))
                .andExpect(jsonPath("$.message").value("View not found"));
    }
}
