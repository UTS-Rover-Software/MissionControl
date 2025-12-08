# Pointcloud

## Description

Displays 3D pointcloud data from RGB-D cameras for autonomous navigation. Shows depth information as rotatable 3D visualization with dual 3D/2D camera modes.

**Task specific:** Yes (autonomous)
**Guaranteed to be used:** Yes (4.0/5 importance)

## Implementation Status

✅ **Backend:** FastAPI endpoints with WebSocket streaming
✅ **Frontend:** Three.js visualization with 3D/2D modes
✅ **Testing:** Full test coverage for backend and frontend
✅ **Documentation:** Complete implementation guide

## Architecture

### Data Pipeline
```
RGB-D Cameras → ROS Driver → FastAPI Backend → WebSocket → Frontend
                                   ↓
                         PointCloudService
                         (async queue-based)
```

### Backend Components

#### Point Cloud Service (`backend/app/services/pointcloud_service.py`)
- **PointCloudData**: Data structure for position and color arrays
- **PointCloudService**: Manages point cloud state and subscriptions
- Features:
  - Async/await support for streaming
  - Queue-based subscriber notifications
  - Thread-safe operations

#### API Endpoints (`backend/app/routers/v1/visualization.py`)

**REST Endpoints:**
- `POST /api/v1/pointcloud/load` - Load point cloud data with positions and colors
- `GET /api/v1/pointcloud/current` - Retrieve currently loaded point cloud
- `GET /api/v1/pointcloud/status` - Check streaming status
- `POST /api/v1/pointcloud/stream/start` - Start streaming to connected clients
- `POST /api/v1/pointcloud/stream/stop` - Stop streaming

**WebSocket Endpoint:**
- `WS /api/v1/ws/pointcloud` - Real-time point cloud streaming
  - Clients automatically receive updates when new data is published
  - Supports multiple concurrent connections
  - Automatic cleanup on disconnect

### Frontend Components

#### PointCloudMap (`front-end/src/components/widgets/PointCloudMap.tsx`)
Features:
- **Dual Camera Modes:**
  - 3D: Orbital camera with yaw/pitch/radius control
  - 2D: Orthographic top-down view with pan/zoom
- **Data Sources:**
  - Local: Stanford Bunny PLY model for testing
  - WebRTC: Live streaming simulation with mock data (~10 FPS, 5000 points)
- **Controls:**
  - Mouse: Drag to rotate (3D) or pan (2D), scroll to zoom
  - Keyboard: `+`/`-` keys to adjust point density (0.5x-5.0x)
  - Editable density input field
  - Mode switching buttons with visual feedback
- **Distance-based Coloring:** 
  - Blue (close, ~30cm) → Cyan → Green → Yellow → Red (far, ~20m)
  - 70% of gradient dedicated to 0-10m range (most important data)
  - Real-time color calculation based on distance from camera
- **Compass Overlay:**
  - Shows cardinal directions (N, E, S, W)
  - Rotating needle indicates camera orientation
  - Non-interactive, always visible
- **UI Features:**
  - Non-selectable controls for clean interaction
  - Semi-transparent bottom panel for visibility
  - Toggle visibility of obstacles, path, and point cloud density
- **Responsive:** Adapts to flex layout changes with ResizeObserver

#### Compass (`front-end/src/components/widgets/PointCloudMap.tsx`)
Integrated compass overlay in point cloud widget:
- Cardinal direction labels (N, E, S, W) - stationary
- Rotating needle showing camera yaw angle
- Red north indicator for quick orientation
- Custom SVG needle (red north side, blue south side)
- Non-selectable, non-interactive overlay
- Updates in real-time with camera rotation

### Data Format

Point cloud data is transmitted as JSON over WebSocket:
```json
{
  "positions": [x1, y1, z1, x2, y2, z2, ...],
  "colors": [r1, g1, b1, r2, g2, b2, ...],
  "point_count": 1000
}
```

- **Positions:** Float array, 3 values per point (x, y, z coordinates)
- **Colors:** Float array (0-1 range), 3 values per point (RGB) - optional for WebRTC mode
- **Point Count:** Total number of points (positions.length / 3)

**Color Calculation (Real-time):**
- If colors not provided, calculated based on distance from camera origin
- Distance range: 0.3m (30cm minimum) to 20m (maximum)
- Emphasis on 0-10m range (70% of color spectrum) where most data is
- Gradient: Blue → Cyan → Green → Yellow → Red

## Testing

### Backend Tests (`backend/app/tests/v1/test_pointcloud.py`)
- ✅ Point cloud data loading and validation
- ✅ Service state management
- ✅ WebSocket subscription/notification system
- ✅ API endpoint integration tests
- ✅ Error handling and edge cases

**Run tests:**
```bash
cd backend
uv run pytest app/tests/v1/test_pointcloud.py -v
```

### Frontend Tests (`front-end/src/components/widgets/__tests__/PointCloudMap.test.tsx`)
- ✅ Component rendering
- ✅ Camera mode switching
- ✅ Data source toggling
- ✅ WebSocket connection handling
- ✅ User interactions and controls

**Run tests:**
```bash
cd front-end
npm test PointCloudMap
```

## Frontend Visualization

### Three.js Integration
- Point material with size 0.2 units
- Vertex colors for height-based visualization
- sRGB color space for accurate rendering
- Dynamic geometry updates

### Camera Modes

**3D Mode (Perspective Camera):**
- Orbiting camera around origin
- Yaw: -π to π (horizontal rotation)
- Pitch: -π/2 to π/2 (vertical rotation)
- Radius: 10-200 units (zoom)

**2D Mode (Orthographic Camera):**
- Top-down view along Y-axis
- Pan in X-Z plane
- Zoom: 0.5x to 10x

### Mouse Controls
- **3D Mode:**
  - Drag: Rotate camera (yaw and pitch)
  - Scroll: Zoom in/out (adjust camera radius)
- **2D Mode:**
  - Drag: Pan view in X-Z plane
  - Scroll: Zoom in/out

### Keyboard Controls
- **`+` or `=`:** Increase point density by 0.1x (up to 5.0x)
- **`-` or `_`:** Decrease point density by 0.1x (down to 0.5x)
- **Enter:** Confirm density input when editing the value field

### UI Controls
- **Top Bar:**
  - Point Cloud Map title
  - Local/WebRTC data source toggle
  - 3D/2D camera mode toggle
- **Bottom Panel:**
  - Obstacles checkbox (UI only, no data yet)
  - Path checkbox (UI only, no data yet)
  - Point cloud density checkbox (toggles visibility)
  - Density adjustment: `-` button, editable input field, `+` button
  - Refresh button (resets camera to default position)
- **Compass (Top Right):**
  - Always visible
  - Shows camera orientation in real-time

## Integration with Backend

### WebSocket Connection
1. Component connects to `ws://localhost:8000/api/v1/ws/pointcloud`
2. Backend publishes point cloud data to all connected subscribers
3. Frontend receives updates and updates visualization in real-time
4. Automatic reconnection on disconnect

### Mock WebRTC Stream
When in WebRTC mode (for testing without backend):
- Generates 5,000 random points in cone pattern (simulates depth camera FOV)
- Updates at ~10 FPS (100ms intervals) for realistic streaming simulation
- Points distributed in camera field of view (±36° vertical)
- Distance-based coloring applied automatically
- Most points concentrated in 0-10m range

### Usage Example
```typescript
// Switch to WebRTC mode
setDataSource('webrtc');

// Component automatically:
// 1. Starts generating mock point cloud data
// 2. Updates geometry every 100ms
// 3. Applies distance-based coloring
// 4. Shows real-time streaming visualization

// Adjust point density
setDensityMultiplier(2.0); // 2x size
// Or use keyboard shortcuts: + and -
```

## Future Enhancements

### Data Processing
- [ ] Noise filtering (statistical outlier removal)
- [ ] Voxel downsampling for performance
- [ ] Ground-plane detection and removal
- [ ] Spatial cropping/clipping

### Visualization
- [ ] Colorization from RGB camera
- [ ] Temporal smoothing
- [ ] Intensity mapping
- [ ] Multi-sensor point cloud fusion

### Performance
- [ ] Level-of-detail (LOD) for large point clouds
- [ ] Octree-based spatial indexing
- [ ] GPU-based point processing
- [ ] Streaming chunking for network efficiency

### Features
- [ ] Point selection/highlighting
- [ ] Measurement tools
- [ ] Annotation support
- [ ] Record/playback functionality

## Technologies Used

- **Frontend:**
  - Three.js: 3D rendering
  - React: Component framework
  - TypeScript: Type safety
  - WebSocket: Real-time streaming

- **Backend:**
  - FastAPI: REST and WebSocket framework
  - Pydantic: Data validation
  - asyncio: Async operations
  - pytest: Testing

- **Future:**
  - Open3D: Point cloud processing
  - RealSense SDK: Intel depth camera support