import React, { useState, useEffect } from "react";
import { getAllTasks } from "../api/taskApi";
import type { Task } from "../types/Task";
import type { User } from "../types/User";
import api from "../api/api";
import TaskList from "../components/TaskList";
import "../styles/TaskSearch.css";

const toBackendStatus = (s: string) => {
  // UI -> Backend
  const map: Record<string, string> = {
    "Pending": "PENDING",
    "In Progress": "IN PROGRESS", // ajuste se backend usar outro valor
    "Completed": "COMPLETED"
  };
  return map[s] || s.toUpperCase();
};

const toBackendSituation = (s: string) => {
  const map: Record<string, string> = {
    "Not Delayed": "NOT DELAYED",
    "Delayed": "DELAYED",
    "Completed": "COMPLETED"
  };
  return map[s] || s.toUpperCase();
};

const TaskSearch: React.FC = () => {
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

  // Carrega usuários com JWT
  useEffect(() => {
    api.get<User[]>("/users")
      .then((res) => setUsers(res.data))
      .catch(() => console.warn("Could not load users."));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.description) params.append("description", filters.description);

      if (filters.status) params.append("status", toBackendStatus(filters.status));
      if (filters.situation) params.append("situation", toBackendSituation(filters.situation));

      if (filters.responsibleId) params.append("responsibleId", filters.responsibleId);
      if (filters.createDate) params.append("creationDate", filters.createDate);
      if (filters.dueDate) params.append("dueDate", filters.dueDate);

      // opcional: garantir não paginado (array) ou deixar assim e normalizar no taskApi
      // params.append("paged", "false");

      const res = await getAllTasks(params.toString());
      setTasks(res.data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="task-search-container">
      <h1 className="text-center text-primary fw-bold mb-4">
        🔍 Task Search
      </h1>

      <div className="task-search-card">
        <h5 className="card-title text-info text-center mb-4 fw-bold">
          Filter Tasks
        </h5>

        <div className="row g-3">
          <div className="col-lg-2 col-md-4 col-sm-6">
            <input
              type="text"
              name="description"
              value={filters.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Description..."
            />
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <select
              name="situation"
              value={filters.situation}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Situation</option>
              <option value="Not Delayed">Not Delayed</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <select
              name="responsibleId"
              value={filters.responsibleId}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Responsible</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <input
              type="date"
              name="createDate"
              value={filters.createDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <input
              type="date"
              name="dueDate"
              value={filters.dueDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="d-flex justify-content-center mt-4 gap-3">
          <button
            className="btn btn-primary px-4 fw-semibold"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Execute"}
          </button>

          <button
            className="btn btn-outline-primary px-4 fw-semibold"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>

      {tasks.length > 0 && <TaskList tasks={tasks} />}
    </div>
  );
};

export default TaskSearch;
