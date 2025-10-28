import React, { useState, useEffect } from "react";
import api from "../api/api";
import type { Task } from "../types/Task";
import type { User } from "../types/User";
import { getAllTasks } from "../api/taskApi";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";
import ToastNotification from "../components/ToastNotification";
import "../styles/TaskSearch.css";

/** 🔧 Normaliza data no formato ISO (yyyy-mm-dd) */
const normalizeDate = (dateString: string): string | null => {
  if (!dateString) return null;
  const cleaned = dateString.replaceAll("/", "-").trim();
  const [year, month, day] = cleaned.split("-");
  // detecta se está no formato dd-mm-yyyy
  if (Number(year) < 1900 && day) {
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
  }
  return cleaned; // já está em ISO
};

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    description: "",
    status: "",
    situation: "",
    responsibleId: "",
    createDate: "",
    dueDate: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task; direction: "asc" | "desc" }>({
    key: "id",
    direction: "asc",
  });

  // 🪄 Toast state
  const [toast, setToast] = useState<{
    type: "success" | "danger" | "warning" | "info";
    message: string;
    show: boolean;
  }>({
    type: "info",
    message: "",
    show: false,
  });

  const [lastDeleteAttempt, setLastDeleteAttempt] = useState<number | null>(null);

  /** 🔹 Carrega usuários no início */
  useEffect(() => {
    api
      .get<User[]>("/users")
      .then((res) => setUsers(res.data))
      .catch(() => console.warn("⚠️ Could not load users."));
  }, []);

  /** 🔍 Executa busca de tarefas */
  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // ✅ Corrige formato das datas antes do envio
      const creationDateISO = filters.createDate ? filters.createDate : "";
      const dueDateISO = filters.dueDate ? filters.dueDate : "";

      if (filters.description) params.append("description", filters.description);
      if (filters.status) params.append("status", filters.status);
      if (filters.situation) params.append("situation", filters.situation);
      if (filters.responsibleId) params.append("responsibleId", filters.responsibleId);
      if (creationDateISO) params.append("creationDate", creationDateISO);
      if (dueDateISO) params.append("dueDate", dueDateISO);

      const res = await getAllTasks(params.toString());
      const sortedTasks = [...res.data].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      setTasks(sortedTasks);

      if (res.data.length === 0) {
        setToast({
          type: "info",
          message: "No tasks found with the selected filters.",
          show: true,
        });
      }
    } catch (err: any) {
      console.error("❌ Search error:", err);
      setToast({
        type: "danger",
        message: err.response?.data || "Error during task search.",
        show: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /** 🔃 Ordena localmente (clicando no cabeçalho) */
  const handleSort = (key: keyof Task) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedTasks = [...tasks].sort((a, b) => {
      const aVal = a[key] ?? "";
      const bVal = b[key] ?? "";

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    setTasks(sortedTasks);
  };

  /** 🧹 Limpa filtros */
  const handleClear = () => {
    setFilters({
      description: "",
      status: "",
      situation: "",
      responsibleId: "",
      createDate: "",
      dueDate: "",
    });
    setTasks([]);
  };

  /** ✏️ Seleciona uma tarefa para edição */
  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  /** 🪟 Fecha modal e atualiza tabela */
  const handleModalClose = (updated?: boolean) => {
    setSelectedTask(null);
    if (updated) {
      setToast({
        type: "success",
        message: "✅ Task updated successfully!",
        show: true,
      });
      handleSearch();
    }
  };

  /** 🗑️ Exclusão com confirmação via Toast (sem popup nativo) */
  const handleDelete = async (taskId: number) => {
    // Primeiro clique: pede confirmação
    if (lastDeleteAttempt !== taskId) {
      setLastDeleteAttempt(taskId);
      setToast({
        type: "warning",
        message: `⚠️ Click again to confirm deletion of task #${taskId}.`,
        show: true,
      });
      setTimeout(() => setLastDeleteAttempt(null), 3000);
      return;
    }

    // Segundo clique (confirmação)
    try {
      await api.delete(`/tasks/${taskId}`);
      setToast({
        type: "success",
        message: `✅ Task #${taskId} deleted successfully!`,
        show: true,
      });
      setLastDeleteAttempt(null);
      handleSearch();
    } catch (err) {
      console.error("❌ Delete error:", err);
      setToast({
        type: "danger",
        message: `❌ Error deleting task #${taskId}.`,
        show: true,
      });
    }
  };

  return (
    <div className="task-search-container">
      <h1 className="text-center text-primary fw-bold mb-4">📋 Task Dashboard</h1>

      {/* 🔹 Filtros */}
      <TaskFilters
        filters={filters}
        setFilters={setFilters}
        users={users}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
      />

      {/* 🔹 Tabela de resultados */}
      <TaskTable
        tasks={tasks}
        onSelectTask={handleSelectTask}
        onDeleted={handleDelete}
        onSort={handleSort}
        sortConfig={sortConfig}
      />

      {/* 🔹 Modal de edição */}
      {selectedTask && <TaskModal task={selectedTask} onClose={handleModalClose} />}

      {/* 🔹 Toast Notification */}
      <ToastNotification
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Dashboard;
