# CLI

## Overview

The backend provides a command-line interface for development, testing, and deployment tasks using Python scripts.

## Available Commands

### Development Server

```bash
uv run dev
```

- Starts FastAPI development server with hot reload
- Host: `0.0.0.0` (configurable via `HOST`)
- Port: `8000` (configurable via `PORT`)
- Log level: `info` (configurable via `LOG_LEVEL`)

### Production Server

```bash
uv run start
```

- Starts production server with multiple workers
- Optimized for performance
- Workers: `4` (configurable via `WORKERS`)

### Code Quality

```bash
uv run lint
```

- Runs ruff check for linting
- Runs ruff format check for code formatting
- Exits with error code on failures

### Testing

```bash
uv run test
```

- Runs pytest test suite
- Includes coverage reporting
- Exits with error code on test failures

## Configuration

Commands respect environment variables:

- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `WORKERS`: Number of workers for production (default: 4)
- `LOG_LEVEL`: Logging level (default: info)

## Development Workflow

Typical development cycle:

1. **Start dev server**: `uv run dev`
2. **Make changes**: Server auto-reloads
3. **Run tests**: `uv run test`
4. **Check code quality**: `uv run lint`
5. **Commit changes**

## Deployment

For production deployment:

1. **Install dependencies**: `uv sync`
2. **Run linting**: `uv run lint`
3. **Run tests**: `uv run test`
4. **Start server**: `uv run start`

## Custom Commands

To add new CLI commands:

1. Add function to `app/cli.py`
2. Add entry to `[project.scripts]` in `pyproject.toml`
3. Run with `uv run <command>`

Example:

```python
def custom_command():
    """Custom command description"""
    # Implementation
```

```toml
[project.scripts]
custom = "app.cli:custom_command"
```