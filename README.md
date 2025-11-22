# UTS RoverSoc Mission Control

## Overview

Mission Control is a comprehensive web-based interface designed for commanding, controlling, and monitoring the ROCK E rover during UTS Rover Challenge tasks. It aims to provide operators with real-time insights and control capabilities to ensure successful mission execution in challenging environments.

The project focuses on delivering a robust, user-friendly platform that integrates telemetry data, visualization tools, and control interfaces to support autonomous and manual rover operations.

## Tech Stack

- **Backend**: FastAPI (Python), SQLAlchemy, WebSockets for real-time communication
- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components, flexlayout-react for tiling
- **Database**: SQLite with async SQLAlchemy
- **Documentation**: VitePress
- **Testing**: pytest, Jest
- **Build Tools**: uv (Python), npm (Node.js), Vite

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- uv (Python package manager)

### Optional (Recommended)

- Nix with direnv for automatic environment setup

### Installation

1. **Backend**:

   ```bash
   cd backend
   uv sync --dev
   uv run dev
   ```

2. **Frontend**:

   ```bash
   cd front-end
   npm install
   npm run dev
   ```

3. **Documentation**:

   ```bash
   npm install
   npm run docs:dev
   ```

### Development

- Backend API docs: <http://localhost:8000/docs>
- Frontend: <http://localhost:5173>
- Component library: <http://localhost:5173/components>
- Documentation: <http://localhost:4173>

## Project Structure

```
.
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── routers/  # API endpoints
│   │   └── tests/    # Backend tests
│   └── pyproject.toml
├── front-end/        # React frontend
│   ├── src/
│   │   ├── components/
│   │   └── presets.ts
│   └── package.json
├── docs/             # VitePress documentation
├── .gitlab-ci.yml    # CI/CD pipeline
└── README.md
```

## Testing

- **Backend**: `cd backend && uv run pytest`
- **Frontend**: `cd front-end && npm test`

## Documentation

For detailed guides on setup, development, architecture, and usage, please refer to the [full documentation](http://localhost:4173) (run `npm run docs:dev` to start the docs server).

## License

This project is part of UTS RoverSoc activities.
