# Sentinel — End-to-End QA Automation Case Study

Sentinel is a mini event-booking platform built to demonstrate an end-to-end answer to a common delivery problem: handing a defect from manual QA to engineering through a bug tracker is slow, inconsistent, and easy to lose context in. Sentinel automates that path: a browser test detects a booking failure, CI captures its result, and a JIRA bug is created with the failure details for automated triage and dashboard reporting.

## Live services

- Frontend: [Sentinel booking app](https://sentinel-frontend-11w4.onrender.com)
- Backend API: [https://sentinel-9a0n.onrender.com](https://sentinel-9a0n.onrender.com)
- JIRA dashboard: **Share link to be added by the project owner** (dashboard currently configured in JIRA as “Sentinel QA Health”)

## Architecture

```text
Angular booking app → Cypress E2E tests → JIRA REST API reporter
                                      → JIRA Automation → QA Health dashboard
                     GitHub Actions CI/CD wraps build, test, and reporting
```

The Spring Boot API persists events and bookings in PostgreSQL. GitHub Actions runs the JUnit suite, builds and starts the backend and Angular frontend, runs Cypress, and invokes the Node.js JIRA reporter when test failures are present. Three chained JIRA Automation rules then triage new bugs, notify stakeholders, and add a completion comment when an issue moves to Done. The **Sentinel QA Health** dashboard surfaces the results through Filter Results, 2D statistics, pie-chart, and Created-vs-Resolved gadgets.

## Tech stack

- Java 17, Spring Boot 3, PostgreSQL
- Angular 17 standalone components
- JUnit 5 and Mockito
- Cypress and Mochawesome
- JIRA REST API and JIRA Automation
- Docker
- GitHub Actions

## CI regression demonstration

A deliberate seat-count regression was introduced in [`6033c49`](https://github.com/MarufaMeem/FinCore-/commit/6033c492154145f9e1bb1c8414c276c97ffed5a7): booking seats were added back to availability rather than subtracted. JUnit caught the defect (`expected 90, was 110`). After the CI workflow was adjusted to continue into E2E reporting and Cypress execution was repaired, Cypress also detected the seat-count regression and the reporter auto-filed the related JIRA bug **SEN-8** (the same run also created **SEN-7** for a separate event-listing failure). The fix was restored in [`36bb093`](https://github.com/MarufaMeem/FinCore-/commit/36bb09359c2eeda5a58bd4d903f6740a554605c1), which returns the booking calculation to subtraction.

This is intentionally a portfolio demonstration: a seeded defect is caught by unit and browser tests and represented in JIRA without a manual QA-to-ticket handoff.

## Run locally

1. Start PostgreSQL, then run `mvn spring-boot:run` from `backend/`.
2. Run `npm install && npm start` from `frontend/`.
3. From the repository root, run `npm install` and `npm run cy:run`.
4. To report failed Mochawesome results to JIRA, provide `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, and `JIRA_PROJECT_KEY`, then run `npm run report:jira`.

## What I’d improve with more time

- Send Slack notifications rather than email-only notifications.
- Use ScriptRunner/Groovy for advanced JIRA automation and issue deduplication.
- Add multi-environment reporting for local, staging, and production test runs.
- Add test artifacts and richer trend metrics to the CI workflow.
