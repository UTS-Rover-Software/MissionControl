import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

type CameraMode = '3d' | '2d';
type DataSource = 'local' | 'webrtc';

interface CameraState {
  yaw: number;
  pitch: number;
  radius: number;
}

interface OrthoState {
  panX: number;
  panY: number;
  zoomLevel: number;
}

const PointCloudMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [cameraMode, setCameraMode] = useState<CameraMode>('3d');
  const [dataSource, setDataSource] = useState<DataSource>('local');
  const [isConnected, setIsConnected] = useState(false);
  const [streamStatus, setStreamStatus] = useState('idle');
  const wsRef = useRef<WebSocket | null>(null);

  const cameraStateRef = useRef<CameraState>({
    yaw: 0,
    pitch: -0.5,
    radius: 50,
  });

  const orthoStateRef = useRef<OrthoState>({
    panX: 0,
    panY: 0,
    zoomLevel: 1,
  });

  // Connect to WebSocket for real-time point cloud streaming
  const connectWebSocket = (wsUrl: string = 'ws://localhost:8000/api/v1/ws/pointcloud') => {
    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setStreamStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          updatePointCloudFromData(data);
        } catch (error) {
          console.error('Failed to parse point cloud data:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStreamStatus('error');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setStreamStatus('disconnected');
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setStreamStatus('error');
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
      setStreamStatus('idle');
    }
  };

  // Update point cloud visualization from streamed data
  const updatePointCloudFromData = async (data: {
    positions: number[];
    colors?: number[];
    point_count: number;
  }) => {
    if (!sceneRef.current || !containerRef.current) return;

    const scene = sceneRef.current;

    // Remove old point cloud if exists
    if (pointsRef.current) {
      scene.remove(pointsRef.current);
    }

    // Create new geometry from streamed data
    const positions = new Float32Array(data.positions);
    const colors = data.colors ? new Float32Array(data.colors) : undefined;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    if (colors) {
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }

    geometryRef.current = geometry;

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: colors ? true : false,
      sRGBColorSpace: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    console.log(`Loaded point cloud with ${data.point_count} points`);
    setStreamStatus('streaming');
  };

  // Load Stanford Bunny PLY and apply height-based coloring
  const loadBunnyPointCloud = async () => {
    return new Promise<{ positions: Float32Array; colors: Float32Array }>(
      (resolve, reject) => {
        const loader = new PLYLoader();
        loader.load(
          '/models/bunny.ply',
          (geometry) => {
            // Get positions from loaded geometry
            let positions = geometry.getAttribute('position')
              .array as Float32Array;

            console.log('Loaded bunny with', positions.length / 3, 'points');

            // Calculate bounds
            let minX = Infinity,
              maxX = -Infinity;
            let minY = Infinity,
              maxY = -Infinity;
            let minZ = Infinity,
              maxZ = -Infinity;

            for (let i = 0; i < positions.length; i += 3) {
              minX = Math.min(minX, positions[i]);
              maxX = Math.max(maxX, positions[i]);
              minY = Math.min(minY, positions[i + 1]);
              maxY = Math.max(maxY, positions[i + 1]);
              minZ = Math.min(minZ, positions[i + 2]);
              maxZ = Math.max(maxZ, positions[i + 2]);
            }

            console.log('Bounds X:', minX.toFixed(3), '-', maxX.toFixed(3));
            console.log('Bounds Y:', minY.toFixed(3), '-', maxY.toFixed(3));
            console.log('Bounds Z:', minZ.toFixed(3), '-', maxZ.toFixed(3));

            // Center and scale the bunny
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            const centerZ = (minZ + maxZ) / 2;
            const sizeX = maxX - minX;
            const sizeY = maxY - minY;
            const sizeZ = maxZ - minZ;
            const maxSize = Math.max(sizeX, sizeY, sizeZ);
            const scale = 50 / maxSize; // Scale to fit in ~50 unit box

            const scaledPositions = new Float32Array(positions.length);
            for (let i = 0; i < positions.length; i += 3) {
              scaledPositions[i] = (positions[i] - centerX) * scale;
              scaledPositions[i + 1] = (positions[i + 1] - centerY) * scale;
              scaledPositions[i + 2] = (positions[i + 2] - centerZ) * scale;
            }

            // Generate colors based on height (Y coordinate after scaling)
            const count = scaledPositions.length / 3;
            const colors = new Float32Array(count * 3);

            let scaledMinY = Infinity,
              scaledMaxY = -Infinity;
            for (let i = 1; i < scaledPositions.length; i += 3) {
              scaledMinY = Math.min(scaledMinY, scaledPositions[i]);
              scaledMaxY = Math.max(scaledMaxY, scaledPositions[i]);
            }

            for (let i = 0; i < count; i++) {
              const y = scaledPositions[i * 3 + 1];
              const t = (y - scaledMinY) / (scaledMaxY - scaledMinY + 0.001);

              // Hot pink gradient: light pink (bottom) -> hot pink (middle) -> deep hot pink (top)
              colors[i * 3] = 1.0; // R always high for hot pink
              colors[i * 3 + 1] = 0.4 + t * 0.3; // G: 0.4 -> 0.7
              colors[i * 3 + 2] = 0.7 - t * 0.3; // B: 0.7 -> 0.4
            }

            resolve({ positions: scaledPositions, colors });
          },
          undefined,
          reject
        );
      }
    );
  };

  // Update camera position for 3D mode
  const updateOrbitCamera = (
    camera: THREE.PerspectiveCamera,
    state: CameraState
  ) => {
    const { yaw, pitch, radius } = state;

    camera.position.x = radius * Math.cos(pitch) * Math.sin(yaw);
    camera.position.y = radius * Math.sin(pitch);
    camera.position.z = radius * Math.cos(pitch) * Math.cos(yaw);
    camera.lookAt(0, 0, 0);
  };

  // Update camera for 2D mode
  const updateOrthoCamera = (
    camera: THREE.OrthographicCamera,
    state: OrthoState,
    width: number,
    height: number
  ) => {
    const { panX, panY, zoomLevel } = state;
    const aspect = width / height;
    const viewHeight = 100 / zoomLevel;
    const viewWidth = viewHeight * aspect;

    camera.left = -viewWidth / 2 + panX;
    camera.right = viewWidth / 2 + panX;
    camera.top = viewHeight / 2 + panY;
    camera.bottom = -viewHeight / 2 + panY;
    camera.updateProjectionMatrix();
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = Math.max(containerRef.current.clientWidth, 100);
    const height = Math.max(containerRef.current.clientHeight, 100);

    if (width === 0 || height === 0) return;

    // Scene setup (once)
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffe6f0); // Light pink background
      sceneRef.current = scene;

      // Renderer setup (once)
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Load Stanford Bunny and add pointcloud
      loadBunnyPointCloud()
        .then(({ positions, colors }) => {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          geometryRef.current = geometry;

          const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            sRGBColorSpace: true,
          });

          const points = new THREE.Points(geometry, material);
          scene.add(points);
          pointsRef.current = points;

          // Fit camera to bunny bounds
          const posArray = positions;
          let minY = Infinity,
            maxY = -Infinity;
          for (let i = 1; i < posArray.length; i += 3) {
            minY = Math.min(minY, posArray[i]);
            maxY = Math.max(maxY, posArray[i]);
          }
          const bunnyHeight = maxY - minY;
          cameraStateRef.current.radius = bunnyHeight * 2;
        })
        .catch((err) => {
          console.error('Failed to load bunny:', err);
        });

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
    }

    // Create appropriate camera based on mode
    let camera: THREE.Camera;
    if (cameraMode === '3d') {
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      updateOrbitCamera(camera as THREE.PerspectiveCamera, cameraStateRef.current);
    } else {
      camera = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        0.1,
        1000
      );
      camera.position.set(0, 50, 0);
      camera.lookAt(0, 0, 0);
      updateOrthoCamera(camera as THREE.OrthographicCamera, orthoStateRef.current, width, height);
    }
    cameraRef.current = camera;

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (cameraMode === '3d') {
        const state = cameraStateRef.current;
        state.yaw -= deltaX * 0.01;
        state.pitch += deltaY * 0.01;
        state.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, state.pitch));
        updateOrbitCamera(cameraRef.current as THREE.PerspectiveCamera, state);
      } else {
        const state = orthoStateRef.current;
        state.panX -= deltaX * 0.1 / state.zoomLevel;
        state.panY += deltaY * 0.1 / state.zoomLevel;
        updateOrthoCamera(
          cameraRef.current as THREE.OrthographicCamera,
          state,
          width,
          height
        );
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (cameraMode === '3d') {
        const state = cameraStateRef.current;
        state.radius += e.deltaY > 0 ? 2 : -2;
        state.radius = Math.max(10, Math.min(200, state.radius));
        updateOrbitCamera(cameraRef.current as THREE.PerspectiveCamera, state);
      } else {
        const state = orthoStateRef.current;
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        state.zoomLevel *= zoomFactor;
        state.zoomLevel = Math.max(0.5, Math.min(10, state.zoomLevel));
        updateOrthoCamera(
          cameraRef.current as THREE.OrthographicCamera,
          state,
          width,
          height
        );
      }
    };

    const renderer = rendererRef.current!;
    const scene = sceneRef.current!;

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, cameraRef.current!);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      renderer.setSize(newWidth, newHeight);

      if (cameraMode === '3d' && cameraRef.current instanceof THREE.PerspectiveCamera) {
        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
      } else if (cameraRef.current instanceof THREE.OrthographicCamera) {
        updateOrthoCamera(cameraRef.current, orthoStateRef.current, newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // ResizeObserver for widget resizing within flex layout
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      if (newWidth > 0 && newHeight > 0) {
        renderer.setSize(newWidth, newHeight);

        if (cameraRef.current instanceof THREE.PerspectiveCamera) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
        } else if (cameraRef.current instanceof THREE.OrthographicCamera) {
          updateOrthoCamera(cameraRef.current, orthoStateRef.current, newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraMode]);

  // Handle WebSocket connection/disconnection
  useEffect(() => {
    if (dataSource === 'webrtc' && !isConnected) {
      connectWebSocket();
    } else if (dataSource === 'local' && isConnected) {
      disconnectWebSocket();
    }

    return () => {
      if (dataSource === 'webrtc') {
        disconnectWebSocket();
      }
    };
  }, [dataSource]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Control Bar */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <h3 style={{ margin: 0, color: '#fff', fontSize: '14px', fontWeight: 600 }}>
          Point Cloud Map
        </h3>

        {/* Data Source Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['local', 'webrtc'] as const).map((source) => (
            <button
              key={source}
              onClick={() => setDataSource(source)}
              style={{
                padding: '6px 12px',
                background: dataSource === source ? '#00cc66' : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 500,
              }}
              title={source === 'webrtc' ? `Status: ${streamStatus}` : ''}
            >
              {source === 'local' ? 'Local' : 'WebRTC'}
              {source === 'webrtc' && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isConnected ? '#00ff00' : '#ff0000',
                    marginLeft: '6px',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Camera Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['3d', '2d'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setCameraMode(mode)}
              style={{
                padding: '6px 12px',
                background: cameraMode === mode ? '#0066cc' : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
          {cameraMode === '3d' ? 'Drag to rotate • Scroll to zoom' : 'Drag to pan • Scroll to zoom'}
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          minHeight: 0,
        }}
      />
    </div>
  );
};

export default PointCloudMap;