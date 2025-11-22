# Camera Feed

## Description

Displays live camera feeds from multiple rover cameras (at least 6-7). Supports WebRTC streaming for low-latency video.

Task specific: No  
Guaranteed to be used: Yes (5.0/5 importance)

## Implementation

### Streaming Server
- Node.js server with WebSocket signaling
- GStreamer pipelines on Jetson for H.264 encoding
- WebRTC for browser delivery

### Camera Mapping
- Maps device paths to logical names (front_left, front_right, etc.)
- Bash script to launch GStreamer for each camera

### Frontend Component
- React component using WebRTC API
- Video element with controls for PTZ (for Tiny2 cameras)
- Recording functionality for multiple streams
- Overlay with camera name, FPS, resolution, latency
- Dropdowns for FPS/resolution control

### Technologies
- WebRTC, GStreamer, Node.js WebSocket server
- Tiny2 SDK for PTZ control (evaluate C++ RPC vs direct integration)