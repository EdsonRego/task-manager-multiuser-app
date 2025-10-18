package com.edsonrego.taskmanager.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="planned_description", nullable=false, length=40)
    private String plannedDescription;

    @Column(name="executed_description", length=40)
    private String executedDescription;

    @Column(name="creation_date")
    private LocalDate creationDate;

    @Column(name="due_date", nullable=false)
    private LocalDate dueDate;

    @Column(name="execution_status", length=20)
    private String executionStatus; // Pending, In Progress, Completed

    @Column(name="task_situation", length=20)
    private String taskSituation; // Not Delayed, Delayed, Completed

    @ManyToOne
    @JoinColumn(name="responsible_id", nullable=false)
    private User responsible;

    public Task() {
        this.creationDate = LocalDate.now();
        this.executionStatus = "Pending";
    }

    public Task(String plannedDescription, LocalDate dueDate, User responsible) {
        this.plannedDescription = plannedDescription;
        this.dueDate = dueDate;
        this.responsible = responsible;
        this.creationDate = LocalDate.now();
        this.executionStatus = "Pending";
    }

    // Getters and setters

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

    public User getResponsible() {
        return responsible;
    }

    public void setResponsible(User responsible) {
        this.responsible = responsible;
    }
}