import React, { useState, useEffect } from "react";
import type { Task } from "../types/Task";
import type { User } from "../types/User";
import api from "../api/api";
import { TASK_STATUS } from "../constants/taskStatus";
import { TASK_SITUATION } from "../constants/taskSituation";

interface TaskFormProps {
  onAlert: (type: "success" | "danger" | "warning" | "info", message: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAlert }) => {
  const [plannedDescription, setPlannedDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD
  const [responsibleId, setResponsibleId] = useState<number>();
  const [executionStatus, setExecutionStatus] = useState("PENDING");
  const [taskSituation, setTaskSituation] = useState("OPEN");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // 🎨 Campos com erro
  const [errors, setErrors] = useState({
    plannedDescription: false,
    dueDate: false,
    responsibleId: false,
  });

  useEffect(() => {
    api
      .get<User[]>("/users")
      .then((res) => setUsers(res.data))
      .catch(() => onAlert("danger", "Failed to load users."));
  }, [onAlert]);

  const validateFields = (): boolean => {
    const newErrors = {
      plannedDescription: !plannedDescription.trim(),
      dueDate: !dueDate,
      responsibleId: !responsibleId,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSave = async () => {
    if (!validateFields()) {
      onAlert("warning", "Please fill in all required fields.");
      return;
    }

    const responsible = users.find((u) => u.id === responsibleId);
    setLoading(true);

    try {
      const payload: Partial<Task> = {
        plannedDescription,
        dueDate,
        responsible: { id: responsible?.id } as any,
        executionStatus,
        taskSituation,
      };

      const res = await api.post("/tasks", payload);

      onAlert(
        "success",
        `Task #${res.data.id} assigned to ${responsible?.firstName} (${responsible?.email})`
      );

      // Reset
      setPlannedDescription("");
      setDueDate("");
      setResponsibleId(undefined);
      setExecutionStatus("PENDING");
      setTaskSituation("OPEN");
      setErrors({ plannedDescription: false, dueDate: false, responsibleId: false });
    } catch (err) {
      console.error(err);
      onAlert("danger", "Error creating task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      {/* 🔹 Planned Description */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Planned Description <span className="text-danger">*</span>
        </label>
        <input
          className={`form-control ${errors.plannedDescription ? "is-invalid" : ""}`}
          value={plannedDescription}
          onChange={(e) => setPlannedDescription(e.target.value)}
          placeholder="Describe the task..."
        />
        {errors.plannedDescription && (
          <div className="invalid-feedback">Please enter a task description.</div>
        )}
      </div>

      {/* 🔹 Due Date */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Due Date <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        {errors.dueDate && (
          <div className="invalid-feedback">Please select a valid due date.</div>
        )}
      </div>

      {/* 🔹 Execution Status */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Execution Status</label>
        <select
          className="form-select"
          value={executionStatus}
          onChange={(e) => setExecutionStatus(e.target.value)}
        >
          {TASK_STATUS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Task Situation */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Task Situation</label>
        <select
          className="form-select"
          value={taskSituation}
          onChange={(e) => setTaskSituation(e.target.value)}
        >
          {TASK_SITUATION.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Responsible */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Responsible <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.responsibleId ? "is-invalid" : ""}`}
          value={responsibleId ?? ""}
          onChange={(e) => setResponsibleId(Number(e.target.value))}
        >
          <option value="">Select Responsible</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>
        {errors.responsibleId && (
          <div className="invalid-feedback">Please select a responsible user.</div>
        )}
      </div>

      {/* 🔹 Button */}
      <button
        type="button"
        className="btn btn-success w-100 fw-semibold"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
};

export default TaskForm;
