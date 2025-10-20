// frontend/src/pages/Dashboard.tsx
import React, { useState } from "react";
import TaskList from "../components/TaskList";
import AlertMessage from "../components/AlertMessage";
import ToastNotification from "../components/ToastNotification";
import { UI_CONFIG } from "../config/ui";

const Dashboard: React.FC = () => {
  const [toast, setToast] = useState({
    type: "info",
    message: "",
    show: false,
  });

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "linear-gradient(180deg, #e3f2fd 0%, #f4f7fb 100%)",
        minHeight: "calc(100vh - 130px)",
      }}
    >
      <h1 className="text-center text-primary fw-bold mb-4">
        📊 Task Dashboard
      </h1>

      <div className="card shadow-sm p-3 mx-4">
        <h5 className="card-title text-info text-center mb-3">
          All Registered Tasks
        </h5>
        <TaskList />
      </div>

      <ToastNotification
        type={toast.type as any}
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Dashboard;
