import React, { useState, useEffect } from "react";
import type { Task } from "../types/Task";
import type { User } from "../types/User";
import api from "../api/api";
import { TASK_STATUS } from "../constants/taskStatus";
import { TASK_SITUATION } from "../constants/taskSituation";

interface TaskFormProps {
  onAlert: (type: "success" | "danger" | "warning" | "info", message: string) => void;
  onSubmit: (taskData: Partial<Task>) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAlert, onSubmit }) => {
  const [plannedDescription, setPlannedDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [responsibleId, setResponsibleId] = useState<number>();
  const [executionStatus, setExecutionStatus] = useState("PENDING");
  const [taskSituation, setTaskSituation] = useState("OPEN");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (!responsible) {
      onAlert("danger", "Responsible user not found.");
      return;
    }

    const payload: Partial<Task> = {
      plannedDescription,
      dueDate,
      responsible: { id: responsible.id } as any, // 👈 fix: type casting evita erro TS
      executionStatus: executionStatus.toUpperCase(),
      taskSituation: taskSituation.toUpperCase(),
    };

    setLoading(true);
    try {
      await onSubmit(payload);
      setPlannedDescription("");
      setDueDate("");
      setResponsibleId(undefined);
      setExecutionStatus("PENDING");
      setTaskSituation("OPEN");
      setErrors({ plannedDescription: false, dueDate: false, responsibleId: false });
    } catch (err) {
      console.error("❌ Error sending task to parent:", err);
      onAlert("danger", "Error creating task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-3 rounded-3 shadow-sm bg-white" style={{ transition: "all 0.3s ease" }}>
      {/* 🔹 Planned Description */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">
          Planned Description <span className="text-danger">*</span>
        </label>
        <input
          className={`form-control shadow-sm ${errors.plannedDescription ? "is-invalid" : ""}`}
          style={{ borderRadius: "10px" }}
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
        <label className="form-label fw-semibold text-secondary">
          Due Date <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control shadow-sm ${errors.dueDate ? "is-invalid" : ""}`}
          style={{ borderRadius: "10px" }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        {errors.dueDate && <div className="invalid-feedback">Please select a valid due date.</div>}
      </div>

      {/* 🔹 Execution Status */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">Execution Status</label>
        <select
          className="form-select shadow-sm"
          style={{ borderRadius: "10px" }}
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
        <label className="form-label fw-semibold text-secondary">Task Situation</label>
        <select
          className="form-select shadow-sm"
          style={{ borderRadius: "10px" }}
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
        <label className="form-label fw-semibold text-secondary">
          Responsible <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select shadow-sm ${errors.responsibleId ? "is-invalid" : ""}`}
          style={{ borderRadius: "10px" }}
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

      <button
        type="button"
        className="btn btn-success w-100 fw-semibold shadow-sm"
        style={{ borderRadius: "10px" }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
};

export default TaskForm;
