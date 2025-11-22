# Tilling System

## Overview

The tilling system enables multiple operators to simultaneously view and control different rover systems across multiple screens and windows. It provides a flexible, resizable interface for organizing widgets and data feeds.

## Core Technology

Built on [flexlayout-react](https://github.com/caplin/FlexLayout), a React implementation of the FlexLayout library.

### Key Features

- **Drag & Drop**: Move panels between containers
- **Resizable Panels**: Adjust panel sizes with borders
- **Tabbed Interface**: Multiple tabs within panels
- **Floating Windows**: Pop out panels as separate windows
- **Layout Persistence**: Save/load layout configurations

## Multi-Screen Support

### Screen Detection

Uses Chrome extension APIs to detect connected displays:

```typescript
chrome.system.display.getInfo((displays) => {
  // Position windows on different screens
})
```

### Window Management

- **Controller Window**: Main window that spawns child windows
- **Child Windows**: Individual browser instances on different screens
- **Window IDs**: Unique identifiers (screen1, screen2, etc.)
- **Layout Broadcasting**: Send layout updates to all windows

### Cross-Window Communication

- **BroadcastChannel API**: For same-origin communication
- **WebSocket**: For backend coordination
- **Shared State**: Synchronized presets and configurations

## Preset System

### Layout Storage

Presets stored as JSON objects:

```json
{
  "global": {
    "tabSetTabStripHeight": 26,
    "tabSetHeaderHeight": 26
  },
  "borders": [],
  "layout": {
    "type": "row",
    "children": [...]
  }
}
```

### Preset Management

- **Save Preset**: Capture current layout as JSON
- **Load Preset**: Apply saved configuration
- **Task-Specific**: Different layouts for autonomous, teleop, science tasks
- **Screen-Aware**: Presets consider multi-screen setups

## Implementation Details

### Component Integration

```tsx
import FlexLayout from 'flexlayout-react'

const Layout = ({ model }) => (
  <FlexLayout.Layout
    model={model}
    factory={factory}
    onModelChange={onModelChange}
  />
)
```

### Widget Registration

Widgets register with the layout system:

```typescript
const factory = (node: TabNode) => {
  const component = node.getComponent()
  switch (component) {
    case 'camera': return <CameraFeed />
    case 'telemetry': return <TelemetryWidget />
    // ...
  }
}
```

## Best Practices

- **Performance**: Limit number of widgets per screen
- **Responsiveness**: Ensure layouts work on different screen sizes
- **Accessibility**: Keyboard navigation for panel management
- **Persistence**: Auto-save layouts on changes
- **Error Handling**: Graceful fallbacks for window communication failures