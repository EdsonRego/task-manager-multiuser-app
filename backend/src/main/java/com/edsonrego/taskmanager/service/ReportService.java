package com.edsonrego.taskmanager.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final JdbcTemplate jdbcTemplate;

    public ReportService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * 📊 Consulta a view vw_tasks_summary
     */
    public List<Map<String, Object>> getSummary() {
        return jdbcTemplate.queryForList("SELECT * FROM vw_tasks_summary ORDER BY user_id");
    }

    /**
     * 🔄 Executa a procedure recalculate_completion_rate()
     */
    public List<Map<String, Object>> recalculateCompletion() {
        return jdbcTemplate.queryForList("SELECT * FROM recalculate_completion_rate()");
    }
}
