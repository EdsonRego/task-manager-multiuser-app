🧭 README (raiz do projeto — /taskmanager/README.md)
# 🧭 Task Manager Multiuser App

**Full-stack portfolio project** built with **Java Spring Boot** (backend) and **React + TypeScript + Vite** (frontend).  
It provides a clean, corporate-style interface inspired by SAP’s blue theme, allowing multiple users to manage and track tasks efficiently.

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-green)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-informational)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)
![Vite](https://img.shields.io/badge/Vite-7.x-yellow)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 🌐 Overview

The **Task Manager Multiuser App** allows users to create, assign, and track tasks collaboratively.  
Each user can log in, view their assigned tasks, and update progress in a friendly and responsive interface.

### ✳️ Key Features
- 🔐 JWT-based authentication and login
- ✅ Task creation, editing, and completion tracking
- 📅 Automatic delay calculation (`DELAYED` / `NOT DELAYED`)
- 🧠 Real-time task summary analytics (via SQL view + stored procedure)
- 📧 Email-ready notification architecture
- 🧰 Backend with Spring Boot 3 + PostgreSQL + Flyway
- 🎨 Frontend with React + TypeScript + Bootstrap 5

---

## 🏗️ Project Structure



taskmanager/
├── backend/ # Spring Boot backend (Java 17)
│ ├── model/ # Entities: User, Task
│ ├── repository/ # JPA Repositories
│ ├── service/ # Business Logic
│ ├── controller/ # REST Controllers
│ ├── dto/ # Data Transfer Objects
│ ├── security/ # JWT Auth configuration
│ ├── config/ # Spring Boot and CORS setup
│ └── resources/
│ ├── application.yml
│ └── db/migration/ # Flyway migrations and seeds
│
├── frontend/ # React + TypeScript + Vite app
│ ├── api/ # Axios configuration
│ ├── components/ # Reusable UI components
│ ├── pages/ # Login, Dashboard, User pages
│ ├── styles/ # SAP-blue theme and layout
│ └── types/ # TypeScript interfaces
│
└── docker-compose.yml # Full stack orchestration


---

## 🧰 Technologies

| Layer        | Technologies                                                                       |
|--------------|------------------------------------------------------------------------------------|
| **Backend**  | Java 17, Spring Boot 3.5.x, JPA, Security (JWT), Flyway, PostgreSQL, Maven, Docker |
| **Frontend** | React 18, TypeScript 5, Vite 7, Axios, React Router, Bootstrap 5                   |
| **DevOps**   | Docker Compose, H2 (test), Flyway migrations                                       |

---

## 🧩 Database Overview

### Table: `users`
| Column     | Typ e        | Descrip tion         |
|------------|--------------|----------------------|
| id         | SERIAL (PK)  | Unique user ID       |
| first_name | VARCHAR(50)  | User first name      |
| last_name  | VARCHAR(50)  | User last name       |
| email      | VARCHAR(100) | Unique email address |
| password   | VARCHAR(255) | BCrypt hash          |
| created_at | TIMESTAMP    | Registration date    |

### Table: `tasks`
| Column               | Type        | Des cription                               |
|----------------------|-------------|--------------------------------------------|
| id                   | SERIAL (PK) | Task ID                                    |
| planned_description  | TEXT        | Planned description                        |
| executed_description | TEXT        | Executed/actual description                |
| creation_date        | TIMESTAMP   | Auto-generated                             |
| due_date             | TIMESTAMP   | Task deadline                              |
| execution_status     | VARCHAR(20) | `PENDING`, `DONE`, or `CANCELLED`          |
| task_situation       | VARCHAR(20) | `OPEN`, `CLOSED`, `DELAYED`, `NOT DELAYED` |
| responsible_id       | INT (FK)    | References `users(id)`                     |

---

## ⚙️ How to Run

### 🔹 Backend

cd backend
./mvnw spring-boot:run


Access → http://localhost:8080

🔹 Frontend
cd frontend
npm install
npm run dev


Access → http://localhost:5173

🔹 Docker Compose (recommended)
docker compose up --build


This will start:

PostgreSQL

Spring Boot backend

React frontend

Then visit → http://localhost:5173

📊 Analytics and Reporting

SQL view: vw_tasks_summary
→ consolidates per-user task statistics (pending, done, delayed, etc.)

Stored procedure: recalculate_completion_rate()
→ dynamically calculates task completion and delay rates

👨‍💻 Author

Edson Gomes do Rego
System Support Engineer & Full-Stack Developer
São Paulo, Brazil

🔗 LinkedIn

💻 GitHub

🧾 License

MIT License — You’re free to use, modify, and distribute with attribution.

“Building reliable, maintainable, and elegant systems — one commit at a time.”

```bash