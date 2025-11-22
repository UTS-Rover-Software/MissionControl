# Services

## Overview

Services provide the business logic layer, separating data operations and external integrations from API routing.

## Database Service

The `DatabaseService` class handles all database operations using SQLAlchemy async sessions.

### Mission Management

- `create_mission(name)`: Start a new mission
- `get_mission(mission_id)`: Retrieve mission details
- `get_active_mission()`: Get currently active mission
- `end_mission(mission_id, status)`: Complete or fail a mission
- `list_missions()`: Get all missions with pagination

### Telemetry Logging

- `log_telemetry(mission_id, topic, data)`: Store telemetry data
- `get_telemetry_logs(mission_id, topic, limit)`: Retrieve logged data

### Command Logging

- `log_command(mission_id, command, parameters)`: Record sent commands
- `update_command_status(command_id, status)`: Update command execution status
- `get_command_logs(mission_id, limit)`: Get command history

## Future Services

As the system grows, additional services will be added for:

- **ROS2 Integration**: Communication with rover systems
- **Camera Management**: Video streaming coordination
- **Alert Processing**: Alert generation and filtering
- **Data Analysis**: Real-time data processing and insights

## Service Architecture

Services follow these patterns:

- **Dependency Injection**: Services receive database sessions
- **Async Operations**: All methods are async for performance
- **Error Handling**: Comprehensive exception handling
- **Type Hints**: Full type annotations for reliability
- **Testing**: Each service method has corresponding tests