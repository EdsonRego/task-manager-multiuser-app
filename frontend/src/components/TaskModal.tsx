// src/components/TaskModal.tsx
import React, { useEffect, useState } from "react";
import type { Task } from "../types/Task";
import api from "../api/api";
import { TASK_STATUS } from "../constants/taskStatus";
import { TASK_SITUATION } from "../constants/taskSituation";

interface Props {
  task: Task;
  onClose: (updated?: boolean) => void;
}

const TaskModal: React.FC<Props> = ({ task, onClose }) => {
  const [executedDescription, setExecutedDescription] = useState(task.executedDescription || "");
  const [executionStatus, setExecutionStatus] = useState(
    (task.executionStatus || "PENDING").toUpperCase()
  );
  const [taskSituation, setTaskSituation] = useState(
    (task.taskSituation || "OPEN").toUpperCase()
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleSave = async () => {
    // Se concluir, exige descrição e fecha situação
    const willClose = executionStatus === "DONE" || taskSituation === "CLOSED";

    if (willClose && !executedDescription.trim()) {
      alert("Please enter the executed description before closing/completing the task.");
      return;
    }

    const finalStatus = executionStatus.toUpperCase(); // PENDING | DONE | CANCELLED
    let finalSituation = taskSituation.toUpperCase();  // OPEN | CLOSED

    // Regra: DONE implica CLOSED
    if (finalStatus === "DONE") {
      finalSituation = "CLOSED";
    }

    // Sanitiza para o conjunto aceito pelo banco
    const ALLOWED_STATUS = new Set(["PENDING", "DONE", "CANCELLED"]);
    const ALLOWED_SIT   = new Set(["OPEN", "CLOSED"]);

    if (!ALLOWED_STATUS.has(finalStatus)) {
      alert("Invalid status selected.");
      return;
    }
    if (!ALLOWED_SIT.has(finalSituation)) {
      alert("Invalid situation selected.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...task,
        executedDescription,
        executionStatus: finalStatus,
        taskSituation: finalSituation,
      };

      console.log("📤 Enviando atualização de tarefa:", payload);
      await api.put(`/tasks/${task.id}`, payload);

      onClose(true);
    } catch (err: any) {
      console.error("❌ Error updating task:", err);
      alert("Error saving task. Please verify values and try again.");
      onClose(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      <div className="modal fade show d-block" style={{ background: "transparent", zIndex: 1050 }} tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Edit Task #{task.id}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => onClose()} aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Planned Description</label>
                <input type="text" className="form-control" value={task.plannedDescription} disabled />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Executed Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={executedDescription}
                  onChange={(e) => setExecutedDescription(e.target.value)}
                  placeholder="Enter details about what was done..."
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
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

                <div className="col-md-6">
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
                  {/* Dica UX opcional: quando escolher DONE, já exibir "Será fechado (Closed)" */}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => onClose()}>
                Cancel
              </button>
              <button className="btn btn-success fw-semibold" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskModal;
