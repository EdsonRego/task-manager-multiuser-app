package com.edsonrego.taskmanager.dto;

import java.time.LocalDate;

public class TaskDTO {
    private Long id;
    private String plannedDescription;
    private String executedDescription;
    private LocalDate creationDate;
    private LocalDate dueDate;
    private String executionStatus;
    private String taskSituation;
    private Long responsibleId;
    private String responsibleName;

    public TaskDTO() {}

    public TaskDTO(Long id, String plannedDescription, String executedDescription,
                   LocalDate creationDate, LocalDate dueDate, String executionStatus,
                   String taskSituation, Long responsibleId, String responsibleName) {
        this.id = id;
        this.plannedDescription = plannedDescription;
        this.executedDescription = executedDescription;
        this.creationDate = creationDate;
        this.dueDate = dueDate;
        this.executionStatus = executionStatus;
        this.taskSituation = taskSituation;
        this.responsibleId = responsibleId;
        this.responsibleName = responsibleName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlannedDescription() {
        return plannedDescription;
    }

    public void setPlannedDescription(String plannedDescription) {
        this.plannedDescription = plannedDescription;
    }

    public String getExecutedDescription() {
        return executedDescription;
    }

    public void setExecutedDescription(String executedDescription) {
        this.executedDescription = executedDescription;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getExecutionStatus() {
        return executionStatus;
    }

    public void setExecutionStatus(String executionStatus) {
        this.executionStatus = executionStatus;
    }

    public String getTaskSituation() {
        return taskSituation;
    }

    public void setTaskSituation(String taskSituation) {
        this.taskSituation = taskSituation;
    }

    public Long getResponsibleId() {
        return responsibleId;
    }

    public void setResponsibleId(Long responsibleId) {
        this.responsibleId = responsibleId;
    }

    public String getResponsibleName() {
        return responsibleName;
    }

    public void setResponsibleName(String responsibleName) {
        this.responsibleName = responsibleName;
    }

}
