# Pointcloud

## Description

Displays 3D pointcloud data from RGB-D cameras for autonomous navigation. Shows depth information as rotatable 3D visualization.

Task specific: Yes (autonomous)  
Guaranteed to be used: Yes (4.0/5 importance)

## Implementation

### Data Pipeline
- RGB-D cameras → Jetson ROS driver → Python backend → WebRTC → Frontend

### Frontend Visualization
- Three.js for 3D rendering
- Rotatable camera with IMU heading reference
- Compass UI for orientation

### Future Enhancements
- Noise filtering, voxel downsampling
- Ground-plane detection, cropping
- Colorization, temporal smoothing
- Multi-sensor fusion

### Technologies
- Three.js, WebRTC, Python Open3D/RealSense SDK