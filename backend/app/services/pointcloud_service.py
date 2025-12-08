"""Point Cloud data service for WebRTC streaming.

Handles point cloud data generation, preprocessing, and WebRTC streaming.
"""

import asyncio
import json
import logging
from typing import Optional, List
import numpy as np

logger = logging.getLogger(__name__)


class PointCloudData:
    """Represents point cloud data structure."""

    def __init__(self, positions: List[float], colors: Optional[List[float]] = None):
        """Initialize point cloud data.

        Args:
            positions: Flattened array of [x, y, z, x, y, z, ...] coordinates
            colors: Optional flattened array of [r, g, b, r, g, b, ...] colors (0-1 range)
        """
        self.positions = np.array(positions, dtype=np.float32)
        self.colors = np.array(colors, dtype=np.float32) if colors else None
        self.point_count = len(positions) // 3

    def to_json(self) -> dict:
        """Convert to JSON-serializable format."""
        return {
            "positions": self.positions.tolist(),
            "colors": self.colors.tolist() if self.colors is not None else None,
            "point_count": self.point_count,
        }


class PointCloudService:
    """Service for managing point cloud data and streaming."""

    def __init__(self):
        """Initialize the point cloud service."""
        self._current_pointcloud: Optional[PointCloudData] = None
        self._subscribers: List[asyncio.Queue] = []
        self._is_streaming = False

    async def load_pointcloud(
        self, positions: List[float], colors: Optional[List[float]] = None
    ) -> PointCloudData:
        """Load point cloud data.

        Args:
            positions: Point positions as flattened array
            colors: Optional point colors as flattened array

        Returns:
            Loaded PointCloudData object

        Raises:
            ValueError: If positions array is invalid
        """
        if len(positions) % 3 != 0:
            raise ValueError("Positions array must be divisible by 3 (x, y, z)")

        self._current_pointcloud = PointCloudData(positions, colors)
        logger.info(f"Loaded point cloud with {self._current_pointcloud.point_count} points")

        # Notify all subscribers of new data
        await self._notify_subscribers()

        return self._current_pointcloud

    async def get_current_pointcloud(self) -> Optional[PointCloudData]:
        """Get the current point cloud data.

        Returns:
            Current PointCloudData or None if not loaded
        """
        return self._current_pointcloud

    async def start_streaming(self) -> None:
        """Start point cloud streaming."""
        self._is_streaming = True
        logger.info("Point cloud streaming started")

    async def stop_streaming(self) -> None:
        """Stop point cloud streaming."""
        self._is_streaming = False
        logger.info("Point cloud streaming stopped")

    async def subscribe(self) -> asyncio.Queue:
        """Subscribe to point cloud updates.

        Returns:
            asyncio.Queue for receiving point cloud updates
        """
        queue: asyncio.Queue = asyncio.Queue()
        self._subscribers.append(queue)
        return queue

    async def unsubscribe(self, queue: asyncio.Queue) -> None:
        """Unsubscribe from point cloud updates.

        Args:
            queue: The queue to remove from subscribers
        """
        if queue in self._subscribers:
            self._subscribers.remove(queue)

    async def _notify_subscribers(self) -> None:
        """Notify all subscribers of current point cloud data."""
        if not self._current_pointcloud:
            return

        data = self._current_pointcloud.to_json()

        # Create list of queues to notify to avoid modifying list during iteration
        queues_to_notify = self._subscribers.copy()

        for queue in queues_to_notify:
            try:
                queue.put_nowait(data)
            except asyncio.QueueFull:
                logger.warning("Subscriber queue full, dropping point cloud update")

    def is_streaming(self) -> bool:
        """Check if streaming is active.

        Returns:
            True if streaming is active
        """
        return self._is_streaming


# Global service instance
_pointcloud_service: Optional[PointCloudService] = None


def get_pointcloud_service() -> PointCloudService:
    """Get or create the global point cloud service.

    Returns:
        PointCloudService instance
    """
    global _pointcloud_service
    if _pointcloud_service is None:
        _pointcloud_service = PointCloudService()
    return _pointcloud_service
