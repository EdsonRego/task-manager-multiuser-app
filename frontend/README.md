# 💻 **README (frontend — `/frontend/README.md`)**


# 💻 Task Manager Frontend — React + TypeScript + Vite

## 📘 Overview
This is the frontend for the **Task Manager Multiuser App**, built with **React 18**, **TypeScript**, and **Vite**.  
It provides a responsive SAP-blue interface for login, task management, and analytics visualization.

---

## 🧰 Stack
- React 18
- TypeScript 5
- Vite 7
- Axios (HTTP client)
- React Router DOM
- Bootstrap 5
- React Icons

---

## 📁 Structure
frontend/
├── api/ # Axios configuration and interceptors
├── components/ # Reusable UI (NavigationBar, TaskModal, Footer)
├── pages/ # Login, Dashboard, User management
├── styles/ # SAP-blue Bootstrap overrides
├── types/ # Shared TypeScript interfaces
└── main.tsx # Entry point

yaml
Copiar código

---

## ⚙️ Setup and Run

npm install
npm run dev
Access → http://localhost:5173

🔗 API Integration
All API calls use Axios via a centralized instance in /api/api.ts:

ts
Copiar código
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
JWT tokens are automatically attached to the Authorization header via interceptors.

🎨 UI Components
NavigationBar: top menu with logout and navigation links

TaskTable: displays all tasks with filters and edit options

TaskModal: modal form for editing tasks

Footer: responsive footer with LinkedIn and GitHub links

📊 Upcoming Features
Dashboard charts from SQL view vw_tasks_summary

Task filtering and search

User management improvements

Theme customization (SAP blue)

👨‍💻 Author
Edson Gomes do Rego
System Support Engineer & Full-Stack Developer
🔗 GitHub

yaml
Copiar código

---
```bash