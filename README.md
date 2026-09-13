# Sentinel — Event Booking Platform with QA, CI/CD & JIRA Automation

Sentinel is a full-stack event-booking application built as a practical demonstration of three connected engineering disciplines: backend development, software quality assurance, and delivery/process automation. It is not only an app where users reserve event seats; it also shows how a defect can be detected by tests, recorded in JIRA with useful technical context, routed by automation, and made visible to a team through a dashboard.

This repository is designed as a portfolio project for early-career Software Engineer, QA Automation Engineer, and JIRA Automation Engineer opportunities.

## Live project

| Service | Link | Purpose |
| --- | --- | --- |
| Angular frontend | [Open Sentinel](https://sentinel-frontend-11w4.onrender.com) | Browse events and create a booking |
| Spring Boot API | [Open backend](https://sentinel-9a0n.onrender.com) | REST API used by the frontend |
| JIRA dashboard | [Sentinel QA Health](https://qaauto.atlassian.net/jira/dashboards/10001) | Test-failure, issue, and workflow visibility (JIRA access required) |
| GitHub Actions | [CI workflow](https://github.com/MarufaMeem/FinCore-/actions) | Builds, tests, and reports failures |

## The problem Sentinel solves

In a manual QA process, a tester discovers a problem, gathers screenshots and reproduction details, creates a ticket, decides who should see it, and then follows up with developers. This handoff is slow and can omit important evidence. Sentinel automates the path from a browser-test failure to a well-labelled JIRA bug, while JIRA Automation triages the issue and a dashboard makes quality trends visible.

```text
User booking flow
      │
Angular 17 UI ──HTTP/JSON──> Spring Boot REST API ──JPA/Hibernate──> PostgreSQL
      │
      └── Cypress validates the real user journey
                    │ on failure
                    ▼
          Mochawesome JSON report → Node.js JIRA REST API reporter
                                             │
                                             ▼
                      JIRA Automation rules → Sentinel QA Health dashboard

GitHub Actions runs the backend tests, frontend build, Cypress suite, and JIRA reporting on pushes to `main`.
```

## What is Java and Spring Boot?

**Java** is a strongly typed, object-oriented language commonly used for reliable backend and enterprise systems. It encourages clear domain models, testable services, and maintainable application structure.

**Spring Boot** is a Java framework that makes it faster to create production-style web applications. It provides sensible configuration defaults and integrates common backend concerns such as REST APIs, dependency injection, validation, data access, and testing.

### How Spring Boot works in Sentinel

When a customer books seats, the Angular application sends a `POST /api/bookings` request. Spring Boot routes that request to the booking layer, validates the request and available capacity, updates the event, saves the booking, and returns a response to the UI.

| Spring Boot concept | Sentinel example | Why it matters |
| --- | --- | --- |
| REST controller | API endpoints expose events and bookings | Separates frontend UI from backend business logic |
| Service layer | `BookingService` applies the booking rules | Keeps rules testable and reusable |
| Dependency injection | Spring supplies repositories to services | Reduces tightly coupled code |
| JPA/Hibernate | Entities map Java objects to PostgreSQL tables | Avoids hand-writing repetitive CRUD SQL |
| Validation and errors | Booking requests are rejected when fields or capacity are invalid | Prevents corrupt or misleading data |
| CORS | The backend permits the local Angular dev server | Lets separately deployed frontend/backend services communicate safely |

### Example: protecting a booking business rule

The key rule is: after booking `n` seats, available seats must be reduced by `n`.

```java
event.setAvailableSeats(event.getAvailableSeats() - request.getSeats());
```

This small rule has a real business impact. Adding instead of subtracting would allow capacity to increase after bookings, creating incorrect availability. Sentinel includes a unit test and an end-to-end test for this behaviour.

## Database and API skills demonstrated

Sentinel uses **PostgreSQL** with Spring Data JPA/Hibernate. Entities represent persisted domain data; repositories provide data-access operations; services coordinate transactions and business rules. This reflects the same foundation used with Oracle, MySQL, or other relational databases: tables, keys, relationships, SQL concepts, JDBC connectivity, and safe handling of data.

The backend exposes JSON REST endpoints such as `/api/events` and `/api/bookings`. The Angular client consumes these endpoints through an RxJS-based service. Inputs are checked before a booking is persisted, and the frontend displays validation or success feedback to the user.

## What is automated testing and Cypress?

**Automated testing** is executable verification: instead of relying only on someone repeatedly clicking through an application, code performs the checks consistently whenever the application changes.

**Cypress** is an end-to-end (E2E) testing framework for web applications. It opens the application in a controlled browser, finds elements, performs user actions, and asserts visible outcomes. E2E tests are valuable because they validate the integration of frontend, API, database, and user experience together.

### How Cypress works in Sentinel

[`cypress/e2e/booking.cy.js`](cypress/e2e/booking.cy.js) runs a realistic booking journey:

1. Load the events page and verify event cards are displayed.
2. Select an event and verify the booking form appears.
3. Submit missing fields and verify an error is shown.
4. Submit a valid booking and verify a success message.
5. Reload the page and verify available seats decreased by the booked quantity.

The tests use `data-cy` selectors rather than fragile visual selectors. For example, `cy.get('[data-cy=submit-booking]')` targets a deliberately named test hook, which makes tests clearer and more resistant to cosmetic CSS changes.

### Unit testing vs integration/E2E testing

| Test level | Sentinel tool | Example question answered |
| --- | --- | --- |
| Unit test | JUnit 5 + Mockito | “Does `BookingService` subtract seats when repositories behave as expected?” |
| Integration/E2E test | Cypress | “Can a user book through the Angular UI and see updated availability?” |
| CI verification | GitHub Actions | “Do these checks still pass on a clean machine after every push?” |

JUnit tests in `backend/src/test` isolate the service layer with Mockito. Cypress validates the complete user workflow. Together, they catch both logic mistakes and cross-layer integration problems.

## What is CI/CD?

**Continuous Integration (CI)** means frequently merging and validating changes automatically. Each push runs the same build and test steps, giving developers fast feedback before problems reach users.

**Continuous Delivery/Deployment (CD)** extends that automation toward release: a validated build can be delivered or deployed consistently. Sentinel’s frontend and backend are deployed on Render, while GitHub Actions provides the CI quality gate.

### How CI/CD works in Sentinel

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request targeting `main`.

1. GitHub provisions a clean Ubuntu runner.
2. Java 17 is installed and Maven runs the JUnit suite.
3. PostgreSQL runs as a CI service container.
4. Maven builds and starts the Spring Boot API.
5. Node.js builds the Angular application using a CI-only environment that targets the local API.
6. Cypress runs the booking tests against the CI frontend and backend.
7. If Cypress fails, the Mochawesome JSON output is passed to the JIRA reporter.
8. The workflow remains failed when a test failure is recorded, making regressions visible in GitHub.

The CI-only Angular configuration is important: production points to Render, whereas CI points to `http://localhost:8081/api`, the backend started by the workflow. This keeps tests independent of an external deployment and avoids false failures caused by a sleeping or changing production service.

## What is JIRA and JIRA Automation?

**JIRA** is an issue-tracking and Agile planning platform. Teams use it to manage bugs, stories, tasks, ownership, status, priorities, sprints, and release work.

**JIRA Automation** uses trigger-condition-action rules to perform repeatable project work automatically. A rule can react when an issue is created, check labels or priority, assign a person, send a notification, transition the issue, or add a comment. This reduces repetitive administration and makes workflows more consistent.

### How JIRA works in Sentinel

When Cypress has a failed test, [`scripts/report-to-jira.js`](scripts/report-to-jira.js) reads Mochawesome JSON and calls the **JIRA REST API**. It creates one Bug issue per failed test with:

- A summary beginning with `[Automated] Cypress failure`
- The failing test title and spec file
- The captured error message
- `automated` and `cypress` labels

JIRA credentials are intentionally supplied through GitHub Actions secrets (`JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, and `JIRA_PROJECT_KEY`) instead of source control.

The JIRA project uses three chained automation rules:

1. **Auto-triage on creation** categorises or routes newly created issues.
2. **Email notification on creation** alerts stakeholders.
3. **Auto-comment on Done** records a workflow update when work is completed.

The **Sentinel QA Health** dashboard uses saved filters and gadgets, including Filter Results, 2D Filter Statistics, a pie chart, and Created-vs-Resolved reporting. These views make bug status and quality trends easier to discuss during sprint planning or test review.

### Useful JQL examples

These are examples of the queries a JIRA administrator or QA engineer can use for this project:

```jql
project = SEN AND labels = automated ORDER BY created DESC
```

```jql
project = SEN AND issuetype = Bug AND statusCategory != Done
```

```jql
project = SEN AND labels = cypress AND created >= startOfWeek()
```

## Regression demonstration: test → CI → JIRA

Sentinel contains documented evidence of a deliberate regression exercise:

- [`6033c49`](https://github.com/MarufaMeem/FinCore-/commit/6033c492154145f9e1bb1c8414c276c97ffed5a7) temporarily changed seat subtraction to addition.
- JUnit caught the incorrect outcome: 90 seats were expected, but 110 were returned.
- After the E2E reporting workflow was made reliable, Cypress detected the seat-count regression and the JIRA reporter created **SEN-8**. The same run created **SEN-7** for a separate event-listing failure.
- [`36bb093`](https://github.com/MarufaMeem/FinCore-/commit/36bb09359c2eeda5a58bd4d903f6740a554605c1) restored the correct subtraction rule.

The learning outcome is more important than the intentional defect: quality checks are only useful when they are repeatable, produce actionable evidence, and prevent a known problem from silently returning.

## Skills this project demonstrates

### Software Engineer / Assistant Software Engineer

- Java 17, Spring Boot, REST APIs, JPA/Hibernate, PostgreSQL, and Docker-aware development
- Angular, TypeScript, HTML, CSS, JavaScript, RxJS, and component-based frontend development
- Validation, error handling, business rules, database connectivity, and debugging
- Git-based source control, pull-request-ready CI, and clean separation of UI, service, and persistence concerns
- JUnit/Mockito unit testing and practical troubleshooting of CI environments

### QA / QA Automation Engineer

- Translating a booking requirement into positive, negative, and state-change test cases
- Cypress E2E automation with stable `data-cy` selectors
- Regression testing of a critical capacity calculation
- Mochawesome failure reports and reproducible test evidence
- Understanding the relationship between SDLC, STLC, defects, test execution, and release confidence

### JIRA Automation Engineer

- JIRA Cloud REST API integration from Node.js
- Automated Bug creation from test output
- Automation-rule design: trigger, triage, notify, and transition-comment actions
- JQL filters, dashboard gadgets, and QA-health reporting
- CI/CD integration using secrets rather than committed credentials

## Run Sentinel locally

### Prerequisites

- Java 17 and Maven
- Node.js 20+ and npm
- PostgreSQL (or Docker)

### Start the application

```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend, in another terminal
cd frontend
npm install
npm start
```

The backend runs on `http://localhost:8081`; the Angular application runs on `http://localhost:4200`.

### Run tests

```bash
# Backend unit tests
cd backend
mvn test

# Cypress E2E tests (with both applications running)
cd ..
npm install
npm run cy:run
```

### Report Cypress failures to JIRA

Set the four JIRA environment variables listed above, then run:

```bash
npm run report:jira
```

Never commit API tokens, passwords, or personal credentials.

## Improvements I would make with more time

- Add Slack or Microsoft Teams notifications alongside email alerts.
- Add ticket deduplication so repeated failures update an existing JIRA bug rather than creating duplicates.
- Introduce separate local, staging, and production test/reporting environments.
- Add API-level integration tests, security tests, and accessibility checks.
- Use ScriptRunner/Groovy where JIRA Cloud/Data Center requirements call for more advanced workflow logic.
- Add richer test artifacts, trend metrics, and release-quality gates.

## Professional approach

This project represents hands-on learning and an ownership mindset: build a feature, write tests for its expected behaviour, automate repeatable checks, investigate failures with evidence, and document the outcome clearly. Those habits transfer directly to collaborative Agile teams, code review, sprint planning, production support, and quality-focused software delivery.
