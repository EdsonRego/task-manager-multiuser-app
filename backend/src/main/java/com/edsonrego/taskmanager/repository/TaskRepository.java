package com.edsonrego.taskmanager.repository;

import com.edsonrego.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> { }
