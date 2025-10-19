# 🧭 Task Manager Multiuser App

**Full-stack portfolio project** built with **Java Spring Boot** (backend) and **React + TypeScript + Vite** (frontend).  
It provides a clean, corporate-style interface (SAP blue theme) for managing multiuser tasks efficiently.

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

The **Task Manager Multiuser App** is designed to manage and monitor personal and shared tasks within teams.  
Each user can create, assign, and track tasks through an intuitive and responsive interface.

### ✳️ Features

- ✅ User registration and login
- ✅ Task creation, assignment, and tracking
- ✅ Automatic task status updates (Pending, In Progress, Completed)
- ✅ Automatic delay detection (Not Delayed / Delayed)
- ✅ Email-ready notification architecture
- ✅ Responsive SAP-blue UI with Bootstrap 5
- ✅ Navigation bar + Footer with LinkedIn and GitHub links

---

## 🏗️ Project Architecture

taskmanager/
├── backend/ # Spring Boot backend (Java 17)
│ ├── model/ # Entities (User, Task)
│ ├── repository/ # JPA Repositories
│ ├── service/ # Business Logic
│ ├── controller/ # REST Controllers
│ ├── dto/ # Data Transfer Objects
│ └── resources/
│ └── application.yml
│
├── frontend/ # React + TypeScript + Vite
│ ├── api/ # Axios configuration
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page-level views (Login, Register, Home)
│ ├── styles/ # SAP-style theme customization
│ ├── types/ # TypeScript interfaces
│ └── config/ # UI behavior configuration
│
└── docker-compose.yml # (future integration)

yaml
Copiar código

---

## 🧰 Technologies

### 🖥️ **Backend**
- Java 17
- Spring Boot 3.5.x
- Spring Data JPA
- Spring Web
- PostgreSQL
- Maven
- Docker

### 💻 **Frontend**
- React 18
- TypeScript 5
- Vite 7
- Axios
- React Router DOM
- Bootstrap 5
- React Icons

---

## 🧩 Database Schema

### **Table: users**
| Column     | Type         | Description                |
|------------|--------------|----------------------------|
| id         | BIGSERIAL    | Primary key                |
| first_name | VARCHAR(40)  | User’s first name          |
| last_name  | VARCHAR(40)  | User’s last name           |
| email      | VARCHAR(100) | Unique                     |
| password   | VARCHAR(10)  | Alphanumeric (max 6 chars) |
| created_at | TIMESTAMP    | Creation date              |

### **Table: tasks**
| Column               | Type        | Description                       |
|----------------------|-------------|-----------------------------------|
| id                   | BIGSERIAL   | Primary key                       |
| planned_description  | VARCHAR(40) | Planned description               |
| executed_description | VARCHAR(40) | Optional                          |
| creation_date        | DATE        | Auto-generated                    |
| due_date             | DATE        | Task deadline                     |
| execution_status     | VARCHAR(20) | Pending / In Progress / Completed |
| task_situation       | VARCHAR(20) | Not Delayed / Delayed / Completed |
| responsible_id       | BIGINT      | FK → users.id                     |

---

## ⚙️ Running the Project

### 🔹 **Backend (Spring Boot)**

cd backend
./mvnw spring-boot:run
Backend available at:
👉 http://localhost:8080

🔹 Frontend (React + Vite)
bash
Copiar código
cd frontend
npm install
npm run dev
Frontend available at:
👉 http://localhost:5173

🔹 (Optional) Run with Docker Compose
bash
Copiar código
docker-compose up --build
This will start:

PostgreSQL

Spring Boot backend

React frontend

Access:
👉 http://localhost:5173

🎨 User Interface
Page	Description
Login	Validates user credentials
Register	Creates a new user account
Home (Dashboard)	Displays task list, creation form, and status management
NavigationBar	SAP-blue style header with navigation links and logout
Footer	Responsive footer with LinkedIn and GitHub links

🧪 Build & Test Status



(You can later enable GitHub Actions using Maven and Node.js workflows to automate builds.)

👨‍💻 Author
Edson Gomes do Rego
System Support Engineer & Full-Stack Developer
São Paulo, Brazil

🔗 LinkedIn
💻 GitHub

🧾 License
This project is licensed under the MIT License — feel free to use, modify, and share with attribution.

“Building reliable, maintainable and elegant systems — one commit at a time.”

yaml
Copiar código

---

💡 **Dica**:  
Coloque este arquivo no diretório raiz do projeto (`taskmanager/`) e nomeie-o exatamente como:
```` bash