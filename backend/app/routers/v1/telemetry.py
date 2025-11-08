from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/v1/telemetry",
    tags=["Telemetry"],
)


class MessageResponse(BaseModel):
    message: str


@router.get(
    "/latest",
    summary="Get most recent telemetry snapshot",
    response_model=MessageResponse,
)
async def get_latest_telemetry():
    return {"message": "hello mks"}


@router.get(
    "/health",
    summary="Get system health status aggregation",
    response_model=MessageResponse,
)
async def get_telemetry_health():
    return {"message": "hello mks"}


@router.get(
    "/sensors/vescs", summary="Get latest VESC data", response_model=MessageResponse
)
async def get_sensors_vescs():
    return {"message": "hello mks"}


@router.get(
    "/sensors/encoders",
    summary="Get latest encoder readings",
    response_model=MessageResponse,
)
async def get_sensors_encoders():
    return {"message": "hello mks"}


@router.get(
    "/sensors/rgbd",
    summary="Get latest RGBD camera data and IMU",
    response_model=MessageResponse,
)
async def get_sensors_rgbd():
    return {"message": "hello mks"}


@router.get(
    "/sensors/payload",
    summary="Get latest payload sensor data",
    response_model=MessageResponse,
)
async def get_sensors_payload():
    return {"message": "hello mks"}
