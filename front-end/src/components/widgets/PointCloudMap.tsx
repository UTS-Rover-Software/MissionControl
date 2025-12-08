import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw } from 'lucide-react';

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
  const [showObstacles, setShowObstacles] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [showDensity, setShowDensity] = useState(true);
  const [densityMultiplier, setDensityMultiplier] = useState(1.0);
  const [densityInputValue, setDensityInputValue] = useState('1.0');

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

  // Track compass rotation for 2D mode
  const [compassRotation, setCompassRotation] = useState(0);

  // Generate mock WebRTC point cloud data (simulating real-time stream)
  const generateMockWebRTCData = () => {
    const pointCount = 5000; // Realistic point count for real-time data
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      // Generate points in a cone-like pattern (simulating depth camera FOV)
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI * 0.4; // ±36 degrees vertical
      const distance = 0.3 + Math.random() * 19.7; // 0.3m to 20m
      
      // Most points should be in the 0-10m range
      const adjustedDistance = distance < 15 ? distance * 0.7 : distance;
      
      // Convert to Cartesian coordinates
      const x = adjustedDistance * Math.cos(elevation) * Math.cos(angle);
      const y = adjustedDistance * Math.sin(elevation);
      const z = adjustedDistance * Math.cos(elevation) * Math.sin(angle);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Color based on distance: blue (close) -> cyan -> green -> yellow -> red (far)
      const minDist = 0.3;
      const maxDist = 20.0;
      const emphasisDist = 10.0;
      
      let t;
      if (adjustedDistance < emphasisDist) {
        t = (adjustedDistance - minDist) / (emphasisDist - minDist) * 0.7;
      } else {
        t = 0.7 + ((adjustedDistance - emphasisDist) / (maxDist - emphasisDist)) * 0.3;
      }
      
      t = Math.max(0, Math.min(1, t));
      
      if (t < 0.25) {
        const localT = t * 4;
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.0 + localT * 1.0;
        colors[i * 3 + 2] = 1.0;
      } else if (t < 0.5) {
        const localT = (t - 0.25) * 4;
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0 - localT * 1.0;
      } else if (t < 0.75) {
        const localT = (t - 0.5) * 4;
        colors[i * 3] = 0.0 + localT * 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 0.0;
      } else {
        const localT = (t - 0.75) * 4;
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0 - localT * 1.0;
        colors[i * 3 + 2] = 0.0;
      }
    }
    
    return { positions, colors };
  };

  // Load Stanford Bunny PLY and apply height-based coloring
  const loadBunnyPointCloud = async () => {
    return new Promise<{ positions: Float32Array; colors: Float32Array }>(
      (resolve, reject) => {
        const loader = new PLYLoader();
        loader.load(
          '/models/bunny.ply',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (geometry: any) => {
            // Get positions from loaded geometry
            const positions = geometry.getAttribute('position')
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

            // Generate colors based on distance from camera (0 to camera position)
            // Distance range: 0.3m (30cm) to 20m, with emphasis on 0-10m range
            const count = scaledPositions.length / 3;
            const colors = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
              const x = scaledPositions[i * 3];
              const y = scaledPositions[i * 3 + 1];
              const z = scaledPositions[i * 3 + 2];
              
              // Calculate distance from origin (camera position)
              const distance = Math.sqrt(x * x + y * y + z * z);
              
              // Map distance to 0-1 range
              // Using logarithmic scale to emphasize 0-10m range
              const minDist = 0.3; // 30cm
              const maxDist = 20.0; // 20m
              const emphasisDist = 10.0; // Most data under 10m
              
              let t;
              if (distance < emphasisDist) {
                // 0-10m maps to 0-0.7 (70% of color range)
                t = (distance - minDist) / (emphasisDist - minDist) * 0.7;
              } else {
                // 10-20m maps to 0.7-1.0 (30% of color range)
                t = 0.7 + ((distance - emphasisDist) / (maxDist - emphasisDist)) * 0.3;
              }
              
              t = Math.max(0, Math.min(1, t)); // Clamp to 0-1
              
              // Color gradient: blue (close) -> cyan -> green -> yellow -> red (far)
              if (t < 0.25) {
                // Blue to Cyan (0.0 - 0.25)
                const localT = t * 4;
                colors[i * 3] = 0.0; // R: 0
                colors[i * 3 + 1] = 0.0 + localT * 1.0; // G: 0 -> 1
                colors[i * 3 + 2] = 1.0; // B: 1
              } else if (t < 0.5) {
                // Cyan to Green (0.25 - 0.5)
                const localT = (t - 0.25) * 4;
                colors[i * 3] = 0.0; // R: 0
                colors[i * 3 + 1] = 1.0; // G: 1
                colors[i * 3 + 2] = 1.0 - localT * 1.0; // B: 1 -> 0
              } else if (t < 0.75) {
                // Green to Yellow (0.5 - 0.75)
                const localT = (t - 0.5) * 4;
                colors[i * 3] = 0.0 + localT * 1.0; // R: 0 -> 1
                colors[i * 3 + 1] = 1.0; // G: 1
                colors[i * 3 + 2] = 0.0; // B: 0
              } else {
                // Yellow to Red (0.75 - 1.0)
                const localT = (t - 0.75) * 4;
                colors[i * 3] = 1.0; // R: 1
                colors[i * 3 + 1] = 1.0 - localT * 1.0; // G: 1 -> 0
                colors[i * 3 + 2] = 0.0; // B: 0
              }
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
      scene.background = new THREE.Color(0x0a0e1a); // Dark blue-black background to match UI
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
          });

          const points = new THREE.Points(geometry, material);
          scene.add(points);
          pointsRef.current = points;
          
          // Apply initial density settings
          points.visible = showDensity;

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
        // Update compass rotation based on yaw
        setCompassRotation(state.yaw * (180 / Math.PI));
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
      }      previousMousePosition = { x: e.clientX, y: e.clientY };
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

    // Handle window size
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
  }, [cameraMode, showDensity, dataSource]);

  // WebRTC mock stream - update point cloud data periodically
  useEffect(() => {
    if (dataSource !== 'webrtc' || !sceneRef.current) return;

    const streamInterval = setInterval(() => {
      if (!pointsRef.current || !geometryRef.current) return;

      // Generate new mock WebRTC data
      const { positions, colors } = generateMockWebRTCData();
      
      // Update geometry attributes
      geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.color.needsUpdate = true;
    }, 100); // Update at ~10 FPS for realistic stream

    return () => {
      clearInterval(streamInterval);
    };
  }, [dataSource]);

  // Switch between local and WebRTC data
  useEffect(() => {
    if (!sceneRef.current || !pointsRef.current || !geometryRef.current) return;

    if (dataSource === 'webrtc') {
      // Switch to WebRTC mock data
      const { positions, colors } = generateMockWebRTCData();
      geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometryRef.current.attributes.position.needsUpdate = true;
      geometryRef.current.attributes.color.needsUpdate = true;
    } else {
      // Reload local bunny data
      loadBunnyPointCloud().then(({ positions, colors }) => {
        if (geometryRef.current) {
          geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          geometryRef.current.attributes.position.needsUpdate = true;
          geometryRef.current.attributes.color.needsUpdate = true;
        }
      });
    }
  }, [dataSource]);

  // Update point cloud visibility and density when controls change
  useEffect(() => {
    if (pointsRef.current) {
      pointsRef.current.visible = showDensity;
      
      // Update point size based on density multiplier
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.size = 0.2 * densityMultiplier;
      material.needsUpdate = true;
    }
  }, [showDensity, densityMultiplier]);

  // Keyboard controls for density adjustment
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        const newValue = Math.min(5.0, densityMultiplier + 0.1);
        setDensityMultiplier(newValue);
        setDensityInputValue(newValue.toFixed(1));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        const newValue = Math.max(0.5, densityMultiplier - 0.1);
        setDensityMultiplier(newValue);
        setDensityInputValue(newValue.toFixed(1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [densityMultiplier]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: '#0a0e1a' }}>
      {/* Top Control Bar */}
      <div
        style={{
          padding: '8px 12px',
          background: 'transparent',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Title Box */}
        <div style={{
          background: '#fff',
          color: '#000',
          padding: '6px 16px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}>
          Point Cloud Map
        </div>

        {/* Data Source Toggle */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setDataSource('local')}
            style={{
              background: dataSource === 'local' ? '#6b7280' : '#fff',
              color: dataSource === 'local' ? '#fff' : '#000',
              padding: '6px 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            Local
          </button>
          <button
            onClick={() => setDataSource('webrtc')}
            style={{
              background: dataSource === 'webrtc' ? '#6b7280' : '#fff',
              color: dataSource === 'webrtc' ? '#fff' : '#000',
              padding: '6px 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            WebRTC
          </button>
        </div>

        {/* Camera Mode Toggle */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setCameraMode('3d')}
            style={{
              background: cameraMode === '3d' ? '#6b7280' : '#fff',
              color: cameraMode === '3d' ? '#fff' : '#000',
              padding: '6px 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            3D
          </button>
          <button
            onClick={() => setCameraMode('2d')}
            style={{
              background: cameraMode === '2d' ? '#6b7280' : '#fff',
              color: cameraMode === '2d' ? '#fff' : '#000',
              padding: '6px 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
          >
            2D
          </button>
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

      {/* Bottom Control Panel */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          background: 'rgba(55, 65, 81, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          zIndex: 10,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* Checkboxes */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#fff', userSelect: 'none' }}>
            <Checkbox
              checked={showObstacles}
              onCheckedChange={(checked) => setShowObstacles(checked as boolean)}
            />
            <span>Obstacles</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#fff', userSelect: 'none' }}>
            <Checkbox
              checked={showPath}
              onCheckedChange={(checked) => setShowPath(checked as boolean)}
            />
            <span>Path</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#fff', userSelect: 'none' }}>
            <Checkbox
              checked={showDensity}
              onCheckedChange={(checked) => setShowDensity(checked as boolean)}
            />
            <span>Point cloud density</span>
          </label>
        </div>

        {/* Density Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const newValue = Math.max(0.5, densityMultiplier - 0.1);
              setDensityMultiplier(newValue);
              setDensityInputValue(newValue.toFixed(1));
            }}
            disabled={!showDensity}
          >
            −
          </Button>
          <input
            type="text"
            value={densityInputValue}
            onChange={(e) => {
              const value = e.target.value;
              setDensityInputValue(value);
              const numValue = parseFloat(value);
              if (!isNaN(numValue) && numValue >= 0.5 && numValue <= 5.0) {
                setDensityMultiplier(numValue);
              }
            }}
            onBlur={() => {
              const numValue = parseFloat(densityInputValue);
              if (isNaN(numValue) || numValue < 0.5) {
                setDensityMultiplier(0.5);
                setDensityInputValue('0.5');
              } else if (numValue > 5.0) {
                setDensityMultiplier(5.0);
                setDensityInputValue('5.0');
              } else {
                setDensityMultiplier(numValue);
                setDensityInputValue(numValue.toFixed(1));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
            disabled={!showDensity}
            style={{
              width: '70px',
              padding: '4px 8px',
              fontSize: '13px',
              fontWeight: '500',
              color: showDensity ? '#bfdbfe' : '#6b7280',
              background: showDensity ? 'rgba(59, 130, 246, 0.2)' : 'rgba(75, 85, 99, 0.3)',
              border: '1px solid rgba(147, 197, 253, 0.3)',
              borderRadius: '4px',
              textAlign: 'center',
              outline: 'none',
              transition: 'all 0.2s',
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const newValue = Math.min(5.0, densityMultiplier + 0.1);
              setDensityMultiplier(newValue);
              setDensityInputValue(newValue.toFixed(1));
            }}
            disabled={!showDensity}
          >
            +
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              // Reset camera or refresh
              if (cameraMode === '3d') {
                cameraStateRef.current = { yaw: 0, pitch: -0.5, radius: 50 };
                if (cameraRef.current instanceof THREE.PerspectiveCamera) {
                  updateOrbitCamera(cameraRef.current, cameraStateRef.current);
                }
              }
            }}
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      {/* Compass Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          right: 24,
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(100, 116, 139, 0.85)',
          border: '2px solid rgba(148, 163, 184, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Cardinal directions - static, don't rotate */}
          <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
            {/* North */}
            <div style={{ 
              position: 'absolute', 
              top: 6, 
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#ef4444',
              userSelect: 'none'
            }}>N</div>
            {/* East */}
            <div style={{ 
              position: 'absolute', 
              right: 8, 
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '10px', 
              fontWeight: '600', 
              color: '#e0e0e0',
              userSelect: 'none'
            }}>E</div>
            {/* South */}
            <div style={{ 
              position: 'absolute', 
              bottom: 6, 
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px', 
              fontWeight: '600', 
              color: '#e0e0e0',
              userSelect: 'none'
            }}>S</div>
            {/* West */}
            <div style={{ 
              position: 'absolute', 
              left: 8, 
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '10px', 
              fontWeight: '600', 
              color: '#e0e0e0',
              userSelect: 'none'
            }}>W</div>
          </div>
          {/* Compass needle - rotates to show direction */}
          <div style={{ 
            transform: `rotate(${compassRotation}deg)`,
            transition: 'transform 0.05s linear',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 12L12 22L9 12L12 2Z" fill="#ef4444" stroke="#fff" strokeWidth="1"/>
              <path d="M12 2L15 12L12 22L9 12L12 2Z" fill="#60a5fa" stroke="#fff" strokeWidth="1" transform="rotate(180 12 12)"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointCloudMap;