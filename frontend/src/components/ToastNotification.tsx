import React, { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { UI_CONFIG } from "../config/ui";

interface ToastNotificationProps {
  type: "success" | "danger" | "warning" | "info";
  message: string;
  show: boolean;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  type,
  message,
  show,
  onClose,
}) => {
  const [bgColor, setBgColor] = useState("bg-primary");

  useEffect(() => {
    switch (type) {
      case "success":
        setBgColor("bg-success");
        break;
      case "danger":
        setBgColor("bg-danger");
        break;
      case "warning":
        setBgColor("bg-warning text-dark");
        break;
      case "info":
        setBgColor("bg-info text-dark");
        break;
      default:
        setBgColor("bg-primary");
    }
  }, [type]);

  return (
    <ToastContainer
      position={UI_CONFIG.toastPosition || "bottom-end"} // posição vinda da configuração
      className="p-3"
    >
      <Toast
        show={show}
        onClose={onClose}
        delay={UI_CONFIG.autoHide.toast}
        autohide
        bg={type === "warning" || type === "info" ? undefined : type}
      >
        <Toast.Header closeButton>
          <strong className="me-auto">Task Manager</strong>
          <small>Now</small>
        </Toast.Header>
        <Toast.Body className={bgColor + " text-white"}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
