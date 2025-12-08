# Bounding Box for Widgets

## Description

Provides a bounding box around each screen with tabs for widget selection. Includes preset management for tiling layouts across multiple screens.

Task specific: No  
Guaranteed to be used: Yes (4.0/5 importance)

## Implementation

### Multi-Window System
- Main controller window spawns 6 child windows
- Chrome API for screen detection and window positioning
- WebSockets/BroadcastChannel for communication

### Preset System
- JSON-based persistent storage
- Dropdown for preset selection
- Save current layout as new preset

### Tiling Layout
- Mosaic layout in each child window
- Dynamic widget loading based on presets

### Technologies
- Chrome Extensions API, React Mosaic, WebSockets