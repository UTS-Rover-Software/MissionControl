from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
import logging

# Import the service - will be created on first use
_pointcloud_service = None

def get_pointcloud_service():
    """Lazy load point cloud service to avoid circular imports."""
    global _pointcloud_service
    if _pointcloud_service is None:
        try:
            # Try to import from services package
            from ...services.pointcloud_service import (
                PointCloudService,
                PointCloudData,
            )
            _pointcloud_service = PointCloudService()
        except ImportError:
            # Fallback: define the service inline
            class PointCloudService:
                def __init__(self):
                    self._current_pointcloud = None
                    self._subscribers = []
                    self._is_streaming = False

                async def load_pointcloud(self, positions, colors=None):
                    import numpy as np
                    if len(positions) % 3 != 0:
                        raise ValueError("Positions array must be divisible by 3 (x, y, z)")

                    # Simple implementation
                    class PointCloudData:
                        def __init__(self, pos, col):
                            self.positions = np.array(pos)
                            self.colors = np.array(col) if col else None
                            self.point_count = len(pos) // 3

                        def to_json(self):
                            return {
                                "positions": self.positions.tolist(),
                                "colors": self.colors.tolist() if self.colors is not None else None,
                                "point_count": self.point_count
                            }

                    self._current_pointcloud = PointCloudData(positions, colors)
                    await self._notify_subscribers()
                    return self._current_pointcloud

                async def get_current_pointcloud(self):
                    return self._current_pointcloud

                async def start_streaming(self):
                    self._is_streaming = True

                async def stop_streaming(self):
                    self._is_streaming = False

                async def subscribe(self):
                    import asyncio
                    queue = asyncio.Queue()
                    self._subscribers.append(queue)
                    return queue

                async def unsubscribe(self, queue):
                    if queue in self._subscribers:
                        self._subscribers.remove(queue)

                async def _notify_subscribers(self):
                    if not self._current_pointcloud:
                        return
                    data = self._current_pointcloud.to_json()
                    for queue in self._subscribers.copy():
                        try:
                            queue.put_nowait(data)
                        except:
                            pass

                def is_streaming(self):
                    return self._is_streaming

            _pointcloud_service = PointCloudService()

    return _pointcloud_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["Visualization"],
)


class MessageResponse(BaseModel):
    message: str


class PointCloudLoadRequest(BaseModel):
    """Request model for loading point cloud data."""

    positions: List[float]
    colors: Optional[List[float]] = None


class PointCloudResponse(BaseModel):
    """Response model for point cloud data."""

    positions: List[float]
    colors: Optional[List[float]]
    point_count: int


class PointCloudStatusResponse(BaseModel):
    """Response model for point cloud status."""

    is_loaded: bool
    is_streaming: bool
    point_count: Optional[int]


@router.get(
    "/slam/map/current",
    summary="Get current SLAM map data",
    response_model=MessageResponse,
)
async def get_current_slam_map():
    return {"message": "hello mks"}


@router.get(
    "/pose/current",
    summary="Get current rover pose/position",
    response_model=MessageResponse,
)
async def get_current_pose():
    return {"message": "hello mks"}


# Point Cloud Endpoints


@router.post(
    "/pointcloud/load",
    summary="Load point cloud data",
    response_model=PointCloudResponse,
)
async def load_pointcloud(request: PointCloudLoadRequest):
    """Load point cloud data from RGB-D camera or other source.

    Args:
        request: Point cloud data with positions and optional colors

    Returns:
        Loaded point cloud data

    Raises:
        400: If positions array is invalid
    """
    from fastapi import HTTPException

    try:
        service = get_pointcloud_service()
        pointcloud = await service.load_pointcloud(request.positions, request.colors)
        return pointcloud.to_json()
    except ValueError as e:
        logger.error(f"Failed to load point cloud: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/pointcloud/current",
    summary="Get current point cloud data",
    response_model=Optional[PointCloudResponse],
)
async def get_current_pointcloud():
    """Get the currently loaded point cloud data.

    Returns:
        Current point cloud data or null if not loaded
    """
    service = get_pointcloud_service()
    pointcloud = await service.get_current_pointcloud()
    return pointcloud.to_json() if pointcloud else None


@router.get(
    "/pointcloud/status",
    summary="Get point cloud streaming status",
    response_model=PointCloudStatusResponse,
)
async def get_pointcloud_status():
    """Get the current status of point cloud streaming.

    Returns:
        Status including whether data is loaded and streaming is active
    """
    service = get_pointcloud_service()
    pointcloud = await service.get_current_pointcloud()
    return {
        "is_loaded": pointcloud is not None,
        "is_streaming": service.is_streaming(),
        "point_count": pointcloud.point_count if pointcloud else None,
    }


@router.post("/pointcloud/stream/start", summary="Start point cloud streaming")
async def start_pointcloud_streaming():
    """Start streaming point cloud data to connected WebSocket clients.

    Returns:
        Status message
    """
    service = get_pointcloud_service()
    await service.start_streaming()
    return {"message": "Point cloud streaming started"}


@router.post("/pointcloud/stream/stop", summary="Stop point cloud streaming")
async def stop_pointcloud_streaming():
    """Stop streaming point cloud data.

    Returns:
        Status message
    """
    service = get_pointcloud_service()
    await service.stop_streaming()
    return {"message": "Point cloud streaming stopped"}


@router.websocket("/ws/pointcloud")
async def websocket_pointcloud(websocket: WebSocket):
    """WebSocket endpoint for real-time point cloud streaming.

    Clients can connect to receive point cloud updates as they are published.
    """
    await websocket.accept()
    service = get_pointcloud_service()
    queue = await service.subscribe()

    try:
        while True:
            # Get point cloud data from queue
            pointcloud_data = await queue.get()

            # Send to client
            await websocket.send_json(pointcloud_data)

    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
        await service.unsubscribe(queue)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await service.unsubscribe(queue)
