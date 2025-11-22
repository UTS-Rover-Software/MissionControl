# Frontend Architecture

## Overview

The frontend is a React-based web application that provides a multi-window interface for real-time rover control and visualization. It connects to a FastAPI backend via WebSocket for live data streaming.

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Window Management**: flexlayout-react for tiling layouts
- **Real-time Communication**: WebSocket for backend integration
- **3D Rendering**: Three.js for point clouds and visualizations
- **Charts**: Chart.js/Recharts for data visualization
- **Terminal**: XTerm.js for console interfaces

## Application Structure

### Multi-Window Architecture

The application supports a multi-window setup for distributed operation:

- **Controller Window**: Main window that spawns child windows and manages global state
- **Child Windows**: Individual browser windows, each running a React instance with its own layout
- **Screen Detection**: Uses Chrome APIs to detect and utilise multiple monitors
- **Inter-Window Communication**: BroadcastChannel API for window coordination

### Component Hierarchy

```
App
├── Navbar
├── Layout (flexlayout-react)
│   ├── TabSet
│   │   ├── Tab
│   │   │   └── Widget Component
│   └── Floating Windows
└── WebSocket Manager
```

### Data Flow

1. **Backend** publishes data via WebSocket topics
2. **Frontend** subscribes to relevant topics
3. **Components** update state and re-render
4. **User interactions** send commands back via WebSocket/REST

## Key Features

- **Real-time Updates**: Live telemetry, camera feeds, sensor data
- **Modular Widgets**: Pluggable components for different functionalities
- **Responsive Design**: Adapts to different screen sizes and configurations
- **Preset System**: Save/load layout configurations
- **Type Safety**: Full TypeScript coverage for reliability

## Backend Integration

- **WebSocket**: `ws://localhost:8000` for real-time data
- **REST API**: `http://localhost:8000` for configuration and commands
- **API Documentation**: Swagger UI at `/docs`
- **CORS**: Configured for cross-origin requests during development

## Sections

- [Components](/frontend/components): UI components and widget development
- [Styling](/frontend/styling): Design system and CSS architecture
- [Tilling](/frontend/tilling): Multi-window layout and screen management