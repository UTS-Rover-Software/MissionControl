# UTS Rover Team Mission Control

Mission Control is a web-based interface for commanding, controlling, and monitoring the ROCK-E Rover during ARCh tasks. It provides telemetry, SLAM visualization, camera feeds, and system health monitoring.

## Features

- **Tiling Window Manager**: Customizable layouts for multiple operators
- **Real-time Telemetry**: VESC, IMU, and payload sensor data
- **SLAM Visualization**: 2D aerial maps and 3D point clouds
- **Camera Feeds**: Live streaming from multiple rover cameras
- **Task-Specific Widgets**: Dedicated interfaces for ARC tasks
- **System Health**: Monitoring and alerting for hardware issues

## Architecture

- **Backend**: FastAPI with ROS2 integration, WebSocket for real-time data
- **Frontend**: React with TypeScript, flexlayout-react for tiling
- **Communication**: Wireless link to Jetson onboard computer

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- uv (Python package manager)

### Installation

1. **Backend**:

   ```bash
   cd backend
   uv sync --dev
   uv run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Development

- Backend API docs: http://localhost:8000/docs
- Frontend: http://localhost:5173
- Component library: http://localhost:5173/components

## Project Structure

```
.
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── routers/  # API endpoints
│   │   └── tests/    # Backend tests
│   └── pyproject.toml
├── frontend/        # React frontend
│   ├── src/
│   │   ├── components/
│   │   └── presets.ts
│   └── package.json
└── CONTRIBUTING.md   # Development guide
```

## Testing

- **Backend**: `cd backend && uv run pytest`
- **Frontend**: `cd frontend && npm test`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines, including widget creation, testing, and PR requirements.

## License

This project is part of UTS Rover Team activities. Licensing and usage restrictions are governed by the UTS Rover Team’s policies.
