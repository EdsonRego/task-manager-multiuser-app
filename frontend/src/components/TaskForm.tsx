import React, { useState, useEffect } from "react";
import type { Task } from "../types/Task";
import type { User } from "../types/User";
import api from "../api/api";

interface TaskFormProps {
  onAlert: (type: "success" | "danger", message: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAlert }) => {
  const [plannedDescription, setPlannedDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [responsibleId, setResponsibleId] = useState<number>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get<User[]>("/users")
      .then(res => setUsers(res.data))
      .catch(() => onAlert("danger", "Failed to load users."));
  }, [onAlert]);

  const handleSave = async () => {
    const responsible = users.find(u => u.id === responsibleId);
    if (!responsible) return onAlert("warning", "Select a valid user.");

    setLoading(true);
    try {
      const task: Task = { plannedDescription, dueDate, responsible };
      const res = await api.post("/tasks", task);

      onAlert(
        "success",
        `Task #${res.data.id} assigned to ${responsible.firstName} (${responsible.email})`
      );

      setPlannedDescription("");
      setDueDate("");
      setResponsibleId(undefined);
    } catch (err) {
      console.error(err);
      onAlert("danger", "Error creating task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <div className="mb-3">
        <label className="form-label">Planned Description</label>
        <input
          className="form-control"
          value={plannedDescription}
          onChange={e => setPlannedDescription(e.target.value)}
          placeholder="Describe the task..."
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Due Date</label>
        <input
          type="date"
          className="form-control"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Responsible</label>
        <select
          className="form-select"
          value={responsibleId ?? ""}
          onChange={e => setResponsibleId(Number(e.target.value))}
        >
          <option value="">Select Responsible</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="btn btn-success w-100"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
};

export default TaskForm;
