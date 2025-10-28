# 🗂️ **README (backend — `/backend/README.md`)**

# 🗂️ Task Manager — Backend (Spring Boot)

## 📘 Overview
This backend powers the **Task Manager Multiuser App**, providing secure REST APIs for user and task management.  
Built with **Spring Boot 3**, it integrates JWT authentication, PostgreSQL persistence, and Flyway migrations.

---

## ⚙️ Stack
- **Java 17**, **Spring Boot 3.5**
- Spring Web, Spring Data JPA, Spring Security (JWT)
- PostgreSQL + Flyway
- Maven build tool
- Docker & Docker Compose
- JUnit 5 + Mockito for testing

---

## 🏗️ Key Packages
com.edsonrego.taskmanager
├── config/ # CORS, Security, Application setup
├── controller/ # REST endpoints (Auth, User, Task)
├── dto/ # Data Transfer Objects
├── model/ # Entities: User, Task
├── repository/ # Spring Data JPA repositories
├── security/ # JWT filter and utilities
├── service/ # Business logic
└── resources/
├── application.yml
└── db/migration/ # Flyway SQL migrations

yaml
Copiar código

---

## 🧩 Database and Migrations
All schema changes are managed by **Flyway** under `src/main/resources/db/migration`.

| Migration  | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| V1–V3      | Create base tables and seed data                                  |
| V4         | Add constraints and indexes                                       |
| V5         | Add test data for dashboards                                      |
| V6         | Create analytical view `vw_tasks_summary`                         |
| V7         | Create procedure `recalculate_completion_rate()`                  |
| V8–V10     | Expand constraints, view, and procedure for delayed/on-time logic |

---

## 🔐 Authentication
- Login endpoint: `/api/auth/login`
- JWT generation: `JwtService`
- Token validation: `JwtAuthenticationFilter`
- Passwords hashed with BCrypt
- Stateless sessions (`SessionCreationPolicy.STATELESS`)

---

## 📈 Reports & Analytics
- **View:** `vw_tasks_summary` — user-based performance overview  
- **Procedure:** `recalculate_completion_rate()` — returns completion and delay rates dynamically

Example:
sql
SELECT * FROM recalculate_completion_rate();
🚀 Run Locally
bash
Copiar código
./mvnw spring-boot:run
API → http://localhost:8080/api

To run via Docker:

bash
Copiar código
docker compose up --build
🧠 Future Enhancements
Email notifications

Role-based authorization

Advanced reporting endpoints

Unit and integration test coverage

👨‍💻 Author
Edson Gomes do Rego
System Support Engineer & Full-Stack Developer
São Paulo, Brazil
🔗 GitHub

```bash