# Global context and rules for AI Agents 

> Always aggressively limit size and scope of global rules.

(REPLACE) One liner project summary goes here.


## Tech Stack
- Backend:  (REPLACE) language, version, frameworks, key libraries
- Frontend:  (REPLACE) language, version, frameworks, key libraries
- Testing:  (REPLACE)
- Authentication layer:  (REPLACE) 


## Project Structure
(REPLACE) Replace the example project structure below.

    project-name/
    ├── backend/
    │   ├── app/
    │   │   ├── main.py           # FastAPI entry point
    │   │   ├── database.py       # SQLite connection
    │   │   ├── models.py         # SQLAlchemy models
    │   │   ├── schemas.py        # Pydantic schemas
    │   │   ├── logging_config.py # structlog configuration
    │   │   └── routers/          # API endpoints
    │   └── pyproject.toml
    ├── frontend/
    │   ├── src/
    │   │   ├── components/       # React components
    │   │   ├── features/         # Feature modules
    │   │   ├── api/              # API client
    │   │   └── App.jsx
    │   └── package.json
    ├── tests/
    │   ├── unit/                 # Unit tests
    │   ├── integration/          # API integration tests
    │   └── e2e/                  # Playwright E2E tests
    └── .agents/
        ├── PRD.md                # Product requirements
        └── context-modules/      # Best practices docs

## Commands
(REPLACE) With commands to start the backend, frontend, run tests, etc.


## Context Modules Documentation
Reference only the context-modules documents that are relevant when working on specific areas:

| Document                                            | When to Read |
|-----------------------------------------------------|--------------|
| .agents/PRD.md                                      | Understanding requirements, features, API spec |
| .agents/context-modules/fastapi-best-practices.md         | (REPLACE) Building API endpoints, Pydantic schemas, dependencies |
| .agents/context-modules/sqlite-best-practices.md          | (REPLACE) Database schema, queries, SQLAlchemy patterns |
| .agents/context-modules/react-frontend-best-practices.md  | (REPLACE) Components, hooks, state management, forms |
| .agents/context-modules/testing-best-practices.md         | (REPLACE) unit/integration/E2E testing patterns | 
| .agents/context-modules/logging-best-practices.md         | (REPLACE) structlog setup |
| .agents/context-modules/deployment-best-practices.md      | (REPLACE) Docker, production builds, deployment |


## Code Conventions
### Backend
- (REPLACE) Bulleted list of global rules to always follow

### Frontend
- (REPLACE) Bulleted list of global rules to always follow

### API Design
- (REPLACE) Bulleted list of global rules to always follow

### Logging Standards
- (REPLACE) Bulleted list of global rules to always follow

### Database Standards
- (REPLACE) Bulleted list of global rules to always follow


## Testing Strategy
### Test Coverage
- Aim for at least 90% test coverage.

### Test Distribution
- 70% Unit tests: Pure functions, business logic, validators
- 20% Integration tests: API endpoints with real database
- 10% E2E tests: Critical user journeys with (REPLACE) library

### Unit Tests
- Test streak calculation, date utilities, validators
- Mock external dependencies
- Fast execution (milliseconds)

### Integration Tests
- Test API endpoints with in-memory database
- Test success and error cases

### E2E Tests
- Use (REPLACE) Library with Page Object Model
- Test critical flows: (REPLACE)
- Run visual regression tests for UI consistency

### Test Organization
(REPLACE) Here is an example of test organization section.

    tests/
    ├── shared.py                    # Shared fixtures
    ├── unit/
    │   └── test_business_logic.py   # Business logic tests
    ├── integration/
    │   └── test_api.py              # API tests with real DB
    └── e2e/
        ├── pages/                   # Page objects
        └── user_journey.spec.js     # User journey tests
