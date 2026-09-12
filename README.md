# Sentinel — Full-Stack Scalable Booking System & Automated CI/CD Pipeline

Sentinel is a comprehensive, production-ready Full-Stack application architecture built to demonstrate advanced software engineering practices. It features a robust **Java Spring Boot** backend, a responsive **Angular** frontend, comprehensive **Cypress** automated end-to-end testing, and an advanced **CI/CD pipeline** with automated **JIRA bug tracking** integration.

---

## Educational Guide: Understanding the Technologies

If you're new to software engineering or exploring the tech stack used in Sentinel, this section breaks down what these technologies mean and exactly how they function inside this project.

### 1. Spring Boot (The Backend Brain)
**What is it?** Spring Boot is a popular Java framework used to build backend servers. It acts as the "brain," handling data processing, managing the database, and responding to requests from the user's browser.
**How it works in Sentinel:** When a user visits the Sentinel Booking App and clicks "Book Now," their browser asks the Spring Boot server to save the booking. The Spring Boot code validates that there are enough seats left, updates the PostgreSQL database, and responds with a "Success" message.

### 2. Quality Assurance (QA) 
**What is it?** QA is the process of testing a software product to ensure it works correctly and doesn't have bugs before giving it to users.
**How it works in Sentinel:** Instead of manually clicking through the app to test it every time we change the code, Sentinel incorporates automated QA engineering principles. We write scripts that mimic human behavior to verify that the app always functions as expected.

### 3. Cypress (Automated Testing Framework)
**What is it?** Cypress is an incredibly powerful tool used for End-to-End (E2E) testing. It basically acts as an "invisible robot" that opens a web browser, clicks buttons, and types into forms exactly like a human user would.
**How it works in Sentinel:** Sentinel has a `booking.cy.js` script. When run, Cypress automatically opens the frontend, finds the "Name" and "Email" fields, fills them out, clicks the "Confirm Booking" button, and verifies that the "Success" message appears on the screen—all within seconds.

### 4. CI/CD (Continuous Integration / Continuous Deployment)
**What is it?** CI/CD is an automated workflow. "Continuous Integration" means every time a developer saves and uploads new code to GitHub, an automated server immediately takes that code, builds it, and tests it to see if it broke anything. 
**How it works in Sentinel:** Sentinel uses *GitHub Actions*. The absolute second a developer pushes new code to GitHub, the CI pipeline automatically wakes up a virtual Ubuntu server. This server builds the Spring Boot backend, builds the Angular frontend, turns them both on, and runs the Cypress robot against them. If the robot succeeds, the code is considered safe!

### 5. JIRA Workflow Automation
**What is it?** JIRA is the most popular project management tool used by software teams to track bugs, tasks, and sprints. "Jira Automation" involves writing scripts to make JIRA create or update tasks without human intervention.
**How it works in Sentinel:** In the Sentinel CI/CD pipeline, if the Cypress robot detects a failure (for example, you try to book a seat but the system crashes), a custom Node.js script intercepts that error. It instantly grabs the technical error logs and uses the JIRA API to automatically write and file a highly detailed "Bug Report" directly into Jira for the engineers to fix. 

---

## Technical Deep-Dive (For Engineers)

### Backend Engineering & Database Architecture
* **REST APIs:** The backend exposes RESTful endpoints (e.g., `/api/events`) through Spring `@RestController` classes.
* **Database Connectivity:** The system connects to a relational **PostgreSQL** database using JPA/Hibernate for seamless CRUD operations using generated SQL. 
* **Data Seeding:** A `data.sql` file seeds the events table on startup.

### Frontend Development & UI State
* **Angular Architecture:** The frontend is structured into modular Angular standalone components (`AppComponent`, `BookingFormComponent`).
* **RxJS Services:** The `EventService` leverages RxJS `Observable` patterns to asynchronously fetch data from the Spring backend.
* **Glassmorphism Aesthetic:** The UI achieves a premium, modern look with CSS backdrop filters, smooth hover micro-animations, and dynamic box-shadows.

### Quality Assurance & Cybersecurity Validation
* **Intentional Failure States:** Certain tests are purposefully engineered to intentionally trigger failures when edge-case thresholds are met, which validates that the CI/CD pipeline's Bug Reporting safety nets truly function in an enterprise crisis.

---

## Getting Started Locally

### Prerequisites
* **Java 17** (Temurin/Adoptium)
* **Node.js 20+** and npm
* **PostgreSQL** or Docker (for the database layer)

### 1. Booting the Application
1. **Backend:** Navigate to `backend/`, verify PostgreSQL is running, and execute `mvn spring-boot:run`. The REST API spins up on `http://localhost:8081`.
2. **Frontend:** Navigate to `frontend/`, run `npm install` followed by `npm run start`. The client UI boots on `http://localhost:4200`.

### 2. Executing Automated Tests
1. Ensure both the local servers are healthy.
2. Run headless diagnostics: `npm run cy:run`
3. Launch visual GUI runner for Cypress: `npx cypress open`
