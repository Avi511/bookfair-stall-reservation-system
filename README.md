# Bookfair Stall Reservation System

A full-stack group project for managing stall reservations at the Colombo International Bookfair.

This project is a web-based stall reservation platform developed for a large-scale book fair event as part of the SENG 22212 – Software Architecture and Design university group assignment. The system is designed to streamline the process of discovering events and reserving stalls online, while also providing an employee portal to manage operational and administrative activities efficiently.

The frontend is built using React with Vite to ensure a fast and modern user experience, and Tailwind CSS is used to create responsive, reusable UI components. The backend is developed with Spring Boot following REST API principles, ensuring a clean and scalable architecture. PostgreSQL serves as the primary relational database, and Flyway is integrated to manage version-controlled and repeatable database schema migrations.

Security is implemented using JWT-based authentication to protect secured endpoints and client routes. Role-based access control differentiates between regular users and employee-level users. Public pages such as Home, About, Contact, and vendor terms are accessible without authentication, while registered users can create accounts, log in, browse events, view stall maps, and reserve available stalls according to event-specific constraints. Users can also edit reservation details, manage profile information, and use password reset or change features supported by email and OTP verification workflows.

The backend follows a layered architecture including controllers, services, repositories, and DTOs. MapStruct is used for efficient entity-to-DTO mapping, while Spring Validation and custom validators ensure data correctness. A global exception handler provides consistent API error responses. Employee users can manage events, stalls, genres, and reservations through a dedicated dashboard. QR code generation is implemented using ZXing, and Swagger/OpenAPI is integrated for API documentation and testing.

Environment-specific configurations are handled through Spring profiles with separate development and production YAML files. The frontend communicates with the backend via centralized Axios service modules, and route protection is implemented using reusable RequireAuth and RequireRole wrappers. The architecture clearly separates frontend and backend modules, enhancing maintainability and enabling parallel team development.

Overall, the system demonstrates layered architecture principles, secure coding practices, and modern web development techniques. It reduces manual booking overhead, improves transparency for vendors and organizers, and can be extended to support analytics, payment processing, notifications, or adapted for exhibitions, conferences, and similar public events. This project serves as a complete academic demonstration of a modern, secure, and scalable reservation platform.

## Tech Stack
- Frontend: React 19, Vite 7, Tailwind CSS, React Router, Axios
- Backend: Spring Boot, Spring Security, Spring Data JPA, MapStruct
- Database: PostgreSQL
- Migrations: Flyway
- Documentation: Springdoc OpenAPI (Swagger UI)
- Build Tools: npm (frontend), Maven (backend)

## Project Structure
```text
.
|-- backend/    # Spring Boot REST API
|-- frontend/   # React + Vite client app
`-- README.md
```

## Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.9+
- PostgreSQL 14+ (or compatible)

## Backend Setup
1. Create a PostgreSQL database named `bookfair`.
2. Update `backend/src/main/resources/application-dev.yaml` if your local DB credentials differ.
3. Set required environment variables:
   - `SPRING_PROFILES_ACTIVE=dev`
   - `JWT_SECRET=<your_secret>`
   - `MAIL_USERNAME=<your_email>`
   - `MAIL_PASSWORD=<your_app_password>`
4. Run backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

## Frontend Setup
1. Install dependencies and start dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Default local frontend URL: `http://localhost:5173`

## Main Features
- User registration, login, and JWT-based session handling
- Forgot password and change password flows
- Event browsing and reservation creation
- Stall map visualization and reservation editing
- Role-based protected routes for user and employee modules
- Employee dashboard for managing events, stalls, reservations, and genres

## Academic Context
- Module: `SENG 22212 - Software Architecture and Design`
- Type: Group project
- Domain: Event stall reservation management

## Team
SE/2022/039	Sanira Deneth
SE/2022/034	Avishka Ishan
SE/2022/002	Dinith Pamunuwatte
SE/2022/019 Dushmantha Kavindu 
SE/2022/022	Hirushi Wickramarachchi
