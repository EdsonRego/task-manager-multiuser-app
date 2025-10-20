// frontend/src/pages/TaskRegister.tsx
import React, { useState } from "react";
import TaskForm from "../components/TaskForm";
import AlertMessage from "../components/AlertMessage";
import ToastNotification from "../components/ToastNotification";
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
        <TaskForm onAlert={handleAlert} />
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
