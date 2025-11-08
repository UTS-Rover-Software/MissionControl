import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from routers.v1.telemetry import router as telemetry_router
from routers.v1.control import router as control_router
from routers.v1.cameras import router as cameras_router
from routers.v1.visualization import router as visualization_router
from routers.v1.alerts import router as alerts_router
from routers.v1.data import router as data_router
from routers.v1.config import router as config_router
from routers.v1.tasks import router as tasks_router
from routers.v1.system import router as system_router

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app = FastAPI(
    title="UTS RS Mission Control",
    description="Backend API blah blah",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API v1 routers
app.include_router(telemetry_router)
app.include_router(control_router)
app.include_router(cameras_router)
app.include_router(visualization_router)
app.include_router(alerts_router)
app.include_router(data_router)
app.include_router(config_router)
app.include_router(tasks_router)
app.include_router(system_router)


@app.websocket("/api/v1/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time data subscriptions.

    Clients can subscribe to topics by sending JSON messages with:
    {"action": "subscribe", "topics": ["topic1", "topic2", ...]}

    Available topics:
    - telemetry.vescs: VESC motor data
    - telemetry.encoders: Encoder readings
    - telemetry.rgbd: RGBD camera data and IMU
    - telemetry.payload: Payload sensor data
    - telemetry.all: All telemetry data
    - cameras.{camera_id}: Live video feed from specific camera
    - slam.map: SLAM map updates
    - pose.current: Current rover position/orientation
    - alerts.live: Real-time alerts and faults
    - health.checks: System health status updates
    - playback.stream: Mission playback data
    """
    await websocket.accept()
    await websocket.send_text("Connected to WebSocket!")
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        pass


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}
