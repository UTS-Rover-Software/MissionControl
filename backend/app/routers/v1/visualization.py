from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
import logging

from ...services.pointcloud_service import get_pointcloud_service

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
    try:
        service = get_pointcloud_service()
        pointcloud = await service.load_pointcloud(request.positions, request.colors)
        return pointcloud.to_json()
    except ValueError as e:
        logger.error(f"Failed to load point cloud: {e}")
        raise


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
