import React from "react";

interface AlertProps {
  type: "success" | "danger" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertProps> = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;
