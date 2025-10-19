import React, { useEffect, useState } from "react";
import type { Task } from "../types/Task";
import api from "../api/api";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    api.get<Task[]>("/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Planned</th>
            <th>Executed</th>
            <th>Creation</th>
            <th>Due</th>
            <th>Status</th>
            <th>Situation</th>
            <th>Responsible</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.plannedDescription}</td>
                <td>{t.executedDescription || "-"}</td>
                <td>{t.creationDate}</td>
                <td>{t.dueDate}</td>
                <td>{t.executionStatus}</td>
                <td>{t.taskSituation}</td>
                <td>{t.responsible.firstName} {t.responsible.lastName}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
