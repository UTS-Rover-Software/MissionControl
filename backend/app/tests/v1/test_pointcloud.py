"""Tests for point cloud service and API endpoints."""

import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch

from ...services.pointcloud_service import (
    PointCloudService,
    PointCloudData,
    get_pointcloud_service,
)


class TestPointCloudData:
    """Tests for PointCloudData class."""

    def test_initialization_with_positions_only(self):
        """Test creating point cloud with positions only."""
        positions = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0]
        pc = PointCloudData(positions)

        assert pc.point_count == 2
        assert len(pc.positions) == 6
        assert pc.colors is None

    def test_initialization_with_colors(self):
        """Test creating point cloud with positions and colors."""
        positions = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0]
        colors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0]
        pc = PointCloudData(positions, colors)

        assert pc.point_count == 2
        assert len(pc.positions) == 6
        assert len(pc.colors) == 6

    def test_to_json(self):
        """Test JSON serialization."""
        positions = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0]
        colors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0]
        pc = PointCloudData(positions, colors)

        json_data = pc.to_json()

        assert json_data["point_count"] == 2
        assert json_data["positions"] == positions
        assert json_data["colors"] == colors


class TestPointCloudService:
    """Tests for PointCloudService."""

    @pytest.fixture
    def service(self):
        """Create a fresh service instance for each test."""
        return PointCloudService()

    @pytest.mark.asyncio
    async def test_load_pointcloud_valid(self, service):
        """Test loading valid point cloud data."""
        positions = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0]
        colors = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0]

        result = await service.load_pointcloud(positions, colors)

        assert result.point_count == 2
        assert result.colors is not None

    @pytest.mark.asyncio
    async def test_load_pointcloud_invalid_positions(self, service):
        """Test loading with invalid positions array."""
        positions = [0.0, 0.0]  # Not divisible by 3

        with pytest.raises(ValueError):
            await service.load_pointcloud(positions)

    @pytest.mark.asyncio
    async def test_get_current_pointcloud_before_load(self, service):
        """Test getting point cloud before any is loaded."""
        result = await service.get_current_pointcloud()
        assert result is None

    @pytest.mark.asyncio
    async def test_get_current_pointcloud_after_load(self, service):
        """Test getting point cloud after loading."""
        positions = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0]
        await service.load_pointcloud(positions)

        result = await service.get_current_pointcloud()

        assert result is not None
        assert result.point_count == 2

    @pytest.mark.asyncio
    async def test_streaming_start_stop(self, service):
        """Test starting and stopping streaming."""
        assert service.is_streaming() is False

        await service.start_streaming()
        assert service.is_streaming() is True

        await service.stop_streaming()
        assert service.is_streaming() is False

    @pytest.mark.asyncio
    async def test_subscribe_notification(self, service):
        """Test subscription and notification."""
        positions = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0]
        queue = await service.subscribe()

        await service.load_pointcloud(positions)

        # Get notification from queue
        data = await asyncio.wait_for(queue.get(), timeout=1.0)

        assert data["point_count"] == 2
        assert len(data["positions"]) == 6

    @pytest.mark.asyncio
    async def test_unsubscribe(self, service):
        """Test unsubscribing from notifications."""
        queue = await service.subscribe()
        assert len(service._subscribers) == 1

        await service.unsubscribe(queue)
        assert len(service._subscribers) == 0

    @pytest.mark.asyncio
    async def test_multiple_subscribers(self, service):
        """Test multiple subscribers receive notifications."""
        positions = [0.0, 0.0, 0.0]
        queue1 = await service.subscribe()
        queue2 = await service.subscribe()

        await service.load_pointcloud(positions)

        # Both queues should receive the data
        data1 = await asyncio.wait_for(queue1.get(), timeout=1.0)
        data2 = await asyncio.wait_for(queue2.get(), timeout=1.0)

        assert data1["point_count"] == 1
        assert data2["point_count"] == 1


class TestPointCloudEndpoints:
    """Tests for point cloud API endpoints."""

    @pytest.fixture
    def app(self):
        """Create a test app instance."""
        from fastapi import FastAPI

        app = FastAPI()
        from ...routers.v1.visualization import router

        app.include_router(router)
        return app

    def test_load_pointcloud_endpoint(self, app):
        """Test POST /api/v1/pointcloud/load endpoint."""
        client = TestClient(app)
        payload = {
            "positions": [0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
            "colors": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0],
        }

        response = client.post("/api/v1/pointcloud/load", json=payload)

        assert response.status_code == 200
        data = response.json()
        assert data["point_count"] == 2
        assert len(data["positions"]) == 6

    def test_load_pointcloud_invalid_endpoint(self, app):
        """Test POST endpoint with invalid data."""
        client = TestClient(app)
        payload = {"positions": [0.0, 0.0]}  # Not divisible by 3

        response = client.post("/api/v1/pointcloud/load", json=payload)

        # Should return 400 because positions array is invalid
        assert response.status_code == 400

    def test_get_current_pointcloud_endpoint(self, app):
        """Test GET /api/v1/pointcloud/current endpoint."""
        client = TestClient(app)

        # Load first
        payload = {"positions": [0.0, 0.0, 0.0, 1.0, 1.0, 1.0]}
        client.post("/api/v1/pointcloud/load", json=payload)

        # Get current
        response = client.get("/api/v1/pointcloud/current")

        assert response.status_code == 200
        data = response.json()
        assert data["point_count"] == 2

    def test_get_pointcloud_status_endpoint(self, app):
        """Test GET /api/v1/pointcloud/status endpoint."""
        client = TestClient(app)
        response = client.get("/api/v1/pointcloud/status")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["is_loaded"], bool)
        assert isinstance(data["is_streaming"], bool)

    def test_start_streaming_endpoint(self, app):
        """Test POST /api/v1/pointcloud/stream/start endpoint."""
        client = TestClient(app)
        response = client.post("/api/v1/pointcloud/stream/start")

        assert response.status_code == 200
        assert "started" in response.json()["message"].lower()

    def test_stop_streaming_endpoint(self, app):
        """Test POST /api/v1/pointcloud/stream/stop endpoint."""
        client = TestClient(app)

        # Start first
        client.post("/api/v1/pointcloud/stream/start")

        # Stop
        response = client.post("/api/v1/pointcloud/stream/stop")

        assert response.status_code == 200
        assert "stopped" in response.json()["message"].lower()
