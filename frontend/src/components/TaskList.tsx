import React, { useEffect, useState } from "react";
import type { Task } from "../types/Task";
import { getAllTasks } from "../api/taskApi";
import "../styles/TaskList.css";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await getAllTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4 text-secondary fw-semibold">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="task-list-container table-responsive">
      <table className="table table-striped table-hover align-middle shadow-sm">
        <thead
          className="text-white"
          style={{
            backgroundColor: "#003366",
            borderBottom: "3px solid #0d6efd",
          }}
        >
          <tr>
            <th>ID</th>
            <th>Planned</th>
            <th>Executed</th>
            <th>Created</th>
            <th>Due</th>
            <th>Status</th>
            <th>Situation</th>
            <th>Responsible</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted py-3">
                No tasks registered yet.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td className="fw-semibold text-secondary">{task.id}</td>
                <td>{task.plannedDescription}</td>
                <td>{task.executedDescription || "-"}</td>
                <td>{task.creationDate}</td>
                <td>{task.dueDate}</td>
                <td>
                  <span
                    className={`badge ${
                      (task.executionStatus || '').toLowerCase() === 'done'
                        ? 'bg-success'       // ✅ verde
                        : (task.executionStatus || '').toLowerCase() === 'pending'
                        ? 'bg-danger'        // ✅ vermelho
                        : (task.executionStatus || '').toLowerCase() === 'cancelled'
                        ? 'bg-secondary'     // ✅ cinza
                        : 'bg-warning text-dark'  // ✅ outros = amarelo
                    }`}
                  >
                    {task.executionStatus}
                  </span>
                </td>
                <td>{task.taskSituation || "-"}</td>
                <td>
                  {task.responsibleName ||
                    task.responsible?.firstName ||
                    "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
