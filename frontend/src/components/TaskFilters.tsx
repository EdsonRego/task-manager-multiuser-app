import React from "react";
import type { User } from "../types/User";
import { TASK_STATUS } from "../constants/taskStatus";
import { TASK_SITUATION } from "../constants/taskSituation";

interface Props {
  filters: any;
  setFilters: (f: any) => void;
  users: User[];
  onSearch: () => void;
  onClear: () => void;
  loading: boolean;
}

const TaskFilters: React.FC<Props> = ({
  filters,
  setFilters,
  users,
  onSearch,
  onClear,
  loading,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div
      className="task-search-card w-100 shadow-sm p-3 mb-3 bg-white rounded"
      style={{ maxWidth: "100%" }}
    >
      {/* 🔹 Linha de filtros (sem o título "Filter Tasks") */}
      <div className="row g-3">
        {/* Description mais largo no desktop (4 colunas) */}
        <div className="col-lg-4 col-md-6 col-sm-12">
          <input
            type="text"
            name="description"
            value={filters.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Description..."
          />
        </div>

        {/* Status (valores vindos dos constants) */}
        <div className="col-lg-2 col-md-6 col-sm-6">
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Status</option>
            {TASK_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Situation (valores dos constants) */}
        <div className="col-lg-2 col-md-6 col-sm-6">
          <select
            name="situation"
            value={filters.situation}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Situation</option>
            {TASK_SITUATION.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Responsible */}
        <div className="col-lg-2 col-md-6 col-sm-6">
          <select
            name="responsibleId"
            value={filters.responsibleId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Responsible</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Creation Date (mais compacto) */}
        <div className="col-lg-1 col-md-6 col-sm-6">
          <input
            type="date"
            name="createDate"
            value={filters.createDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Due Date (mais compacto) */}
        <div className="col-lg-1 col-md-6 col-sm-6">
          <input
            type="date"
            name="dueDate"
            value={filters.dueDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Botões */}
      <div className="d-flex justify-content-center mt-3 gap-3">
        <button
          className="btn btn-primary px-4 fw-semibold"
          onClick={onSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Execute"}
        </button>

        <button
          className="btn btn-outline-primary px-4 fw-semibold"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
