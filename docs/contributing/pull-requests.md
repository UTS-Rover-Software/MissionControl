# Pull Requests

## Guidelines

- Ensure all tests pass

- Run linting: `npm run lint` (frontend), `ruff check` (backend)

- Include clear description of changes

- Reference related issues

- For widgets, use the widget PR template

## CI/CD Requirements

All PRs must pass the CI/CD pipeline, which runs:

- **Linting**: ESLint for frontend, ruff for backend

- **Type checking**: pyright for backend, TypeScript for frontend

- **Tests**: Jest for frontend, pytest for backend

Before submitting, run locally:

- Frontend: `npm run lint`, `npm test`

- Backend: `uv run ruff check`, `uv run pyright`, `uv run pytest`

Fix any issues before pushing.