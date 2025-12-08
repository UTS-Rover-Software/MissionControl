# Machine Usage Readonly

## Description

Shows machine specifications and usage stats for the Jetson onboard computer.

Task specific: No  
Guaranteed to be used: No (2.0/5 importance)

## Implementation

### Data Source
- ROS2 node publishing tegrastats or similar data

### Frontend Component
- Read-only display of CPU, memory, GPU usage
- System health monitoring

### Technologies
- React, ROS2, tegrastats