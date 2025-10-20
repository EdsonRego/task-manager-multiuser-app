import React, { useState, useEffect } from "react";
import { getAllTasks } from "../api/taskApi";
import type { Task } from "../types/Task";
import type { User } from "../types/User";
import TaskList from "../components/TaskList";
import "../styles/TaskSearch.css";

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

  // 🔹 Carrega usuários para o select
  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
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
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
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
