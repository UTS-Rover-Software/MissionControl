# General

This section covers setup, usage, and high-level architecture of Mission Control.

## What the Software Does

The software is for command, control, and monitoring of the ROCK E rover during testing and the ARC tasks. It provides telemetry, pose estimation, SLAM visualisation, system health, camera feeds, and more. It ensures the team operators can guide the rover, analyse data, and respond appropriately to changing environmental and hardware conditions.

## Why It Is Needed

Without the solution, our team is disorganised and inefficient. The solution facilitates the creation of dedicated roles for operators and debuggers. Last year, our team did not have a unified interface for completing the tasks remotely and had to rely on camera feeds spun up manually during the competition, custom ros2 graphs also generated during the competition, lack of coordination about which subtask we were currently on during a task, etc. All these problems will be addressed by the mission control software.

## High-Level Architecture

Mission Control consists of a React-based frontend and a FastAPI backend, connected via WebSocket for real-time communication.

### Frontend
- **Framework**: React 19 with TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Window Management**: flexlayout-react for tiling
- **Real-time**: WebSocket connection to backend
- **3D**: Three.js for visualizations

### Backend
- **Framework**: FastAPI with async support
- **Database**: SQLAlchemy + SQLite
- **Real-time**: WebSocket for data streaming
- **API**: REST endpoints with automatic docs

### Communication
- **WebSocket**: `/api/v1/ws` for real-time telemetry
- **REST API**: `/api/v1/*` for configuration and commands
- **Topics**: Structured data streams (telemetry, cameras, alerts)

### Data Flow
1. Backend collects data from ROS2/Jetson
2. Data streamed via WebSocket to frontend
3. Frontend updates widgets in real-time
4. User commands sent back via REST/WebSocket

## Sections

- [Setup](/general/setup)
- [Manual](/general/manual)