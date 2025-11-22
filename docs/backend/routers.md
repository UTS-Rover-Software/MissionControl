# Routers

## Overview

The backend uses FastAPI routers to organize API endpoints by functionality. All endpoints are versioned under `/api/v1/`.

## Available Routers

### Telemetry Router (`/api/v1/telemetry`)

Handles rover sensor data and system telemetry:

- `GET /latest` - Most recent telemetry snapshot
- `GET /health` - System health status
- `GET /sensors/vescs` - VESC motor controller data
- `GET /sensors/encoders` - Encoder readings
- `GET /sensors/rgbd` - RGBD camera and IMU data
- `GET /sensors/payload` - Payload sensor data

### Control Router (`/api/v1/control`)

Rover movement and control commands:

- Drive commands, steering, speed control
- Autonomous mode toggles
- Emergency stop functions

### Cameras Router (`/api/v1/cameras`)

Camera management and streaming:

- Camera configuration
- Stream controls
- Recording management

### Visualization Router (`/api/v1/visualization`)

Data visualization endpoints:

- Map data
- Point cloud exports
- Trajectory plotting

### Alerts Router (`/api/v1/alerts`)

System alerts and notifications:

- Alert history
- Alert configuration
- Real-time alert streaming

### Data Router (`/api/v1/data`)

Mission data management:

- Data export
- Historical data retrieval
- Data analysis endpoints

### Config Router (`/api/v1/config`)

System configuration:

- Parameter settings
- Calibration data
- System preferences

### Tasks Router (`/api/v1/tasks`)

Mission task management:

- Task scheduling
- Task status
- Task execution

### System Router (`/api/v1/system`)

System-level operations:

- System status
- Diagnostics
- Maintenance commands

## API Documentation

For complete API documentation with request/response examples and interactive testing, visit `http://localhost:8000/docs` when the backend is running.

## WebSocket Connections

The backend provides real-time data streaming via WebSocket at `/api/v1/ws`.

### Connection Process

1. Connect to `ws://localhost:8000/api/v1/ws`
2. Send subscription message:
   ```json
   {
     "action": "subscribe",
     "topics": ["telemetry.vescs", "cameras.front"]
   }
   ```

### Available Topics

- **telemetry.vescs**: VESC motor data
- **telemetry.encoders**: Encoder readings
- **telemetry.rgbd**: RGBD camera data and IMU
- **telemetry.payload**: Payload sensor data
- **telemetry.all**: All telemetry data
- **cameras.{camera_id}**: Live video feed from specific camera
- **slam.map**: SLAM map updates
- **pose.current**: Current rover position/orientation
- **alerts.live**: Real-time alerts and faults
- **health.checks**: System health status updates
- **playback.stream**: Mission playback data

### Message Format

Data is sent as JSON objects with topic and payload:

```json
{
  "topic": "telemetry.vescs",
  "data": {
    "speed": 1.5,
    "voltage": 48.2,
    "current": 2.1
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Connection Options

- **Heartbeat**: Send ping every 30 seconds to maintain connection
- **Reconnection**: Automatic reconnection on disconnect
- **Compression**: Optional per-message-deflate compression
- **Authentication**: Future token-based auth support