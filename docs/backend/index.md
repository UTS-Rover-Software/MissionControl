# Backend Overview

This section covers the backend architecture, API endpoints, services, database, and CLI tools for the Mission Control system.

## Technology Stack

- **Framework**: FastAPI with async support
- **Database**: SQLAlchemy with async SQLite
- **WebSocket**: Real-time data streaming
- **Testing**: pytest with async support
- **Linting**: ruff for code quality
- **Type Checking**: pyright for static analysis

## Architecture

The backend provides REST API endpoints and WebSocket connections for real-time communication with the frontend. It integrates with ROS2 for rover control and sensor data.

### Key Components

- **Routers**: API endpoints organized by functionality
- **Services**: Business logic layer
- **Database**: Data persistence and logging
- **CLI**: Development and deployment tools

## API Documentation

For complete API documentation with interactive testing, visit `http://localhost:8000/docs` when the backend is running. This provides Swagger UI documentation for all endpoints.

## Development

- Run development server: `uv run dev`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

## Sections

- [Routers](/backend/routers): API endpoints and WebSocket connections
- [Services](/backend/services): Business logic and integrations
- [Database](/backend/database): Data models and persistence
- [CLI](/backend/cli): Command-line tools