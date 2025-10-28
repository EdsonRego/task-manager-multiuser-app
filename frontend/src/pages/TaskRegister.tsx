// frontend/src/pages/TaskRegister.tsx
import React, { useState } from "react";
import TaskForm from "../components/TaskForm";
import AlertMessage from "../components/AlertMessage";
import ToastNotification from "../components/ToastNotification";
import api from "../api/api";
import { UI_CONFIG } from "../config/ui";

const TaskRegister: React.FC = () => {
  const [alert, setAlert] = useState<{
    type: "success" | "danger" | "warning" | "info";
    message: string;
  } | null>(null);

  const [toast, setToast] = useState<{
    type: "success" | "danger" | "warning" | "info";
    message: string;
    show: boolean;
  }>({
    type: "info",
    message: "",
    show: false,
  });

  /** 🔔 Controla alertas e toasts */
  const handleAlert = (
    type: "success" | "danger" | "warning" | "info",
    message: string
  ) => {
    if (UI_CONFIG.useAlertsFor.includes(type)) {
      setAlert({ type, message });
      setTimeout(() => setAlert(null), UI_CONFIG.autoHide.alert);
    } else if (UI_CONFIG.useToastsFor.includes(type)) {
      setToast({ type, message, show: true });
      setTimeout(
        () => setToast({ type, message, show: false }),
        UI_CONFIG.autoHide.toast
      );
    }
  };

  /** 🧾 Função de envio do formulário */
  const handleSubmit = async (taskData: any) => {
    try {
      console.groupCollapsed("📝 Envio de nova tarefa");
      console.log("📤 Payload:", taskData);
      console.groupEnd();

      if (!taskData.responsible?.id) {
        handleAlert("warning", "Please select a responsible user before saving.");
        return;
      }

      const payload = {
        plannedDescription: taskData.plannedDescription,
        executedDescription: taskData.executedDescription || null,
        creationDate: new Date().toISOString().split("T")[0],
        dueDate: taskData.dueDate,
        executionStatus: taskData.executionStatus?.toUpperCase() || "PENDING",
        taskSituation: taskData.taskSituation?.toUpperCase() || "OPEN",
        responsible: { id: taskData.responsible.id },
      };

      await api.post("/tasks", payload);
      handleAlert("success", "Task created successfully!");
    } catch (error: any) {
      console.error("❌ Error creating task:", error);
      if (error.response?.status === 401) {
        handleAlert("danger", "Unauthorized. Please log in again.");
      } else {
        handleAlert("danger", "Error creating task. Please verify the data.");
      }
    }
  };

  return (
    <div
      className="container py-4"
      style={{
        background: "linear-gradient(180deg, #e3f2fd 0%, #f4f7fb 100%)",
        minHeight: "calc(100vh - 130px)",
      }}
    >
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <h1 className="text-center text-primary fw-bold mb-4">
        📝 Task Registration
      </h1>

      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h5 className="card-title text-success text-center mb-3">
          Create New Task
        </h5>

        {/* 🔹 Passa handleSubmit para o componente de formulário */}
        <TaskForm onAlert={handleAlert} onSubmit={handleSubmit} />
      </div>

      <ToastNotification
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default TaskRegister;
