import React, { useState, useEffect } from "react";
import type { Task } from "../types/Task";
import type { User } from "../types/User";
import api from "../api/api";
import { TASK_STATUS } from "../constants/taskStatus";
import { TASK_SITUATION } from "../constants/taskSituation";

interface TaskFormProps {
  onAlert: (type: "success" | "danger" | "warning" | "info", message: string) => void;
  onSubmit: (taskData: Partial<Task>) => Promise<void>; // ✅ delega envio ao pai
}

const TaskForm: React.FC<TaskFormProps> = ({ onAlert, onSubmit }) => {
  const [plannedDescription, setPlannedDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD
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

  /** ✅ Validação dos campos obrigatórios */
  const validateFields = (): boolean => {
    const newErrors = {
      plannedDescription: !plannedDescription.trim(),
      dueDate: !dueDate,
      responsibleId: !responsibleId,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  /** 🧾 Submit delega para o pai (TaskRegister) */
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
      responsible: { id: responsible.id },
      executionStatus: executionStatus.toUpperCase(),
      taskSituation: taskSituation.toUpperCase(),
    };

    setLoading(true);
    try {
      await onSubmit(payload);

      // Resetar formulário
      setPlannedDescription("");
      setDueDate("");
      setResponsibleId(undefined);
      setExecutionStatus("PENDING");
      setTaskSituation("OPEN");
      setErrors({
        plannedDescription: false,
        dueDate: false,
        responsibleId: false,
      });
    } catch (err) {
      console.error("❌ Error sending task to parent:", err);
      onAlert("danger", "Error creating task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="p-3 rounded-3 shadow-sm bg-white"
      style={{ transition: "all 0.3s ease" }}
    >
      {/* 🔹 Planned Description */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">
          Planned Description <span className="text-danger">*</span>
        </label>
        <input
          className={`form-control shadow-sm ${
            errors.plannedDescription ? "is-invalid" : ""
          }`}
          style={{
            borderRadius: "10px",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
          value={plannedDescription}
          onChange={(e) => setPlannedDescription(e.target.value)}
          placeholder="Describe the task..."
          onFocus={(e) =>
            (e.target.style.boxShadow =
              "0 0 0 0.25rem rgba(25,135,84,0.25)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
        {errors.plannedDescription && (
          <div className="invalid-feedback">
            Please enter a task description.
          </div>
        )}
      </div>

      {/* 🔹 Due Date */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">
          Due Date <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={`form-control shadow-sm ${
            errors.dueDate ? "is-invalid" : ""
          }`}
          style={{
            borderRadius: "10px",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          onFocus={(e) =>
            (e.target.style.boxShadow =
              "0 0 0 0.25rem rgba(25,135,84,0.25)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
        {errors.dueDate && (
          <div className="invalid-feedback">
            Please select a valid due date.
          </div>
        )}
      </div>

      {/* 🔹 Execution Status */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">
          Execution Status
        </label>
        <select
          className="form-select shadow-sm"
          style={{
            borderRadius: "10px",
            transition: "box-shadow 0.2s ease",
          }}
          value={executionStatus}
          onChange={(e) => setExecutionStatus(e.target.value)}
          onFocus={(e) =>
            (e.target.style.boxShadow =
              "0 0 0 0.25rem rgba(13,110,253,0.25)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
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
        <label className="form-label fw-semibold text-secondary">
          Task Situation
        </label>
        <select
          className="form-select shadow-sm"
          style={{
            borderRadius: "10px",
            transition: "box-shadow 0.2s ease",
          }}
          value={taskSituation}
          onChange={(e) => setTaskSituation(e.target.value)}
          onFocus={(e) =>
            (e.target.style.boxShadow =
              "0 0 0 0.25rem rgba(13,110,253,0.25)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
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
          className={`form-select shadow-sm ${
            errors.responsibleId ? "is-invalid" : ""
          }`}
          style={{
            borderRadius: "10px",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
          value={responsibleId ?? ""}
          onChange={(e) => setResponsibleId(Number(e.target.value))}
          onFocus={(e) =>
            (e.target.style.boxShadow =
              "0 0 0 0.25rem rgba(25,135,84,0.25)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        >
          <option value="">Select Responsible</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>
        {errors.responsibleId && (
          <div className="invalid-feedback">
            Please select a responsible user.
          </div>
        )}
      </div>

      {/* 🔹 Button */}
      <button
        type="button"
        className="btn btn-success w-100 fw-semibold shadow-sm"
        style={{
          borderRadius: "10px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
};

export default TaskForm;
