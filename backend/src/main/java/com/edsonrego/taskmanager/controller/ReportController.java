package com.edsonrego.taskmanager.controller;

import com.edsonrego.taskmanager.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * 📊 Retorna o resumo consolidado de tarefas por usuário.
     * Dados vêm da view "vw_tasks_summary".
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        List<Map<String, Object>> summary = reportService.getSummary();

        if (summary == null || summary.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(summary);
    }

    /**
     * 🔄 Recalcula e retorna as taxas de conclusão de tarefas.
     * Executa a stored procedure "recalculate_completion_rate()".
     */
    @PostMapping("/recalculate")
    public ResponseEntity<?> recalculateCompletion() {
        List<Map<String, Object>> updatedMetrics = reportService.recalculateCompletion();

        if (updatedMetrics == null || updatedMetrics.isEmpty()) {
            return ResponseEntity.status(204).body("No data returned from recalculation.");
        }

        return ResponseEntity.ok(updatedMetrics);
    }

    /**
     * 🧪 Endpoint de diagnóstico (opcional)
     * Permite validar a conectividade com o banco e a existência da view.
     */
    @GetMapping("/health")
    public ResponseEntity<?> checkReportHealth() {
        try {
            reportService.getSummary();
            return ResponseEntity.ok(Map.of("status", "OK", "message", "Reports module is operational."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("status", "ERROR", "message", e.getMessage()));
        }
    }
}
