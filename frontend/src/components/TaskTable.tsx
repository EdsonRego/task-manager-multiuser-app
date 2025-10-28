import React, { useState } from "react";
import type { Task } from "../types/Task";
import api from "../api/api";
import ToastNotification from "./ToastNotification";

interface Props {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onDeleted: (taskId?: number) => void;
}

const PAGE_SIZE = 8;

/** 🔧 Converte data ISO (yyyy-mm-dd) → dd/mm/yyyy para exibição */
const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

const TaskTable: React.FC<Props> = ({ tasks, onSelectTask, onDeleted }) => {
  const [toast, setToast] = useState({
    show: false,
    type: "info" as "success" | "danger" | "info" | "warning",
    message: "",
  });

  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task; direction: "asc" | "desc" } | null>(null);

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);

  // 🔹 Ordenação local
  const sortedTasks = React.useMemo(() => {
    if (!sortConfig) return tasks;
    const sorted = [...tasks].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [tasks, sortConfig]);

  const visibleTasks = sortedTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const showToast = (type: "success" | "danger" | "info" | "warning", message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 2500);
  };

  const handleDelete = async (task: Task) => {
    try {
      await api.delete(`/tasks/${task.id}`);
      showToast("success", `Task #${task.id} deleted successfully.`);
      onDeleted(task.id);
    } catch (err) {
      console.error("❌ Error deleting task:", err);
      showToast("danger", "Error deleting task. Please try again.");
    }
  };

  const handleSort = (key: keyof Task) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Task) => {
    if (sortConfig?.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <>
      <div className="task-list-container table-responsive mt-4">
        <table className="table table-striped table-hover align-middle shadow-sm">
          <thead
            className="text-white"
            style={{
              backgroundColor: "#003366",
              borderBottom: "3px solid #0d6efd",
              cursor: "pointer",
            }}
          >
            <tr>
              <th onClick={() => handleSort("id")}>ID {getSortIcon("id")}</th>
              <th onClick={() => handleSort("plannedDescription")}>
                Planned {getSortIcon("plannedDescription")}
              </th>
              <th onClick={() => handleSort("executedDescription")}>
                Executed {getSortIcon("executedDescription")}
              </th>
              <th onClick={() => handleSort("creationDate")}>
                Created {getSortIcon("creationDate")}
              </th>
              <th onClick={() => handleSort("dueDate")}>
                Due {getSortIcon("dueDate")}
              </th>
              <th onClick={() => handleSort("executionStatus")}>
                Status {getSortIcon("executionStatus")}
              </th>
              <th onClick={() => handleSort("taskSituation")}>
                Situation {getSortIcon("taskSituation")}
              </th>
              <th onClick={() => handleSort("responsibleName")}>
                Responsible {getSortIcon("responsibleName")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {visibleTasks.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-muted py-3">
                  No tasks found.
                </td>
              </tr>
            ) : (
              visibleTasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.plannedDescription}</td>
                  <td>{t.executedDescription || "-"}</td>
                  <td>{formatDate(t.creationDate)}</td>
                  <td>{formatDate(t.dueDate)}</td>
                  <td>{t.executionStatus}</td>
                  <td>{t.taskSituation}</td>
                  <td>{t.responsible?.firstName || t.responsibleName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => onSelectTask(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(t)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação simples */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ◀ Prev
          </button>
          <span className="fw-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next ▶
          </button>
        </div>
      )}

      {/* Toast visual */}
      <ToastNotification
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
};

export default TaskTable;
