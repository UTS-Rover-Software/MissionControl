# Components

## Overview

The frontend follows a component-based architecture with reusable UI elements and specialized widgets for rover functionality.

## UI Components (shadcn/ui)

We use [shadcn/ui](https://ui.shadcn.com/), a modern component library built on [Radix UI](https://www.radix-ui.com/) primitives. This provides accessible, customizable components with Tailwind CSS styling.

### Available Components

- **Buttons**: Various styles and sizes with loading states
- **Forms**: Inputs, checkboxes, switches, sliders, select dropdowns
- **Data Display**: Tables, charts, progress bars, badges
- **Layout**: Accordions, collapsibles, separators, tabs
- **Feedback**: Alerts, tooltips, dialogs

### Component Structure

```
src/components/ui/
├── button.tsx
├── input.tsx
├── table.tsx
├── chart.tsx
└── ...
```

Each component includes:
- TypeScript interfaces for props
- Variants using `class-variance-authority`
- Tailwind CSS classes
- Accessibility features

## Component Playbook

For a complete interactive showcase of all components, visit `http://localhost:5173/components` when running the development server.

This playbook includes:
- Live component previews
- Code examples
- Variant demonstrations
- Usage guidelines

## Widget Components

Specialized components for rover control and visualization:

### Core Widgets
- **CameraFeed**: WebRTC video streaming
- **PointCloudMap**: 3D depth visualization with Three.js
- **Telemetry Displays**: Real-time sensor data
- **Control Interfaces**: Rover command inputs

### Widget Structure

```
src/components/widgets/
├── CameraFeed.tsx
├── PointCloudMap.tsx
├── TelemetryWidget.tsx
└── ...
```

Each widget:
- Uses React hooks for state management
- Subscribes to WebSocket topics
- Handles loading and error states
- Follows consistent styling patterns

## Component Development

### Creating New Components

1. Use the shadcn CLI: `npx shadcn-ui@latest add [component]`
2. Follow TypeScript best practices
3. Include proper prop types and defaults
4. Add unit tests in `__tests__/`
5. Update the component playbook

### Best Practices

- Keep components small and focused
- Use composition over inheritance
- Leverage TypeScript for type safety
- Follow accessibility guidelines
- Test user interactions and edge cases