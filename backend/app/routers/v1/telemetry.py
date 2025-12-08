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
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/health",
    summary="Get system health status aggregation",
    response_model=MessageResponse,
)
async def get_telemetry_health():
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/sensors/vescs", summary="Get latest VESC data", response_model=MessageResponse
)
async def get_sensors_vescs():
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/sensors/encoders",
    summary="Get latest encoder readings",
    response_model=MessageResponse,
)
async def get_sensors_encoders():
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/sensors/rgbd",
    summary="Get latest RGBD camera data and IMU",
    response_model=MessageResponse,
)
async def get_sensors_rgbd():
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/sensors/payload",
    summary="Get latest payload sensor data",
    response_model=MessageResponse,
)
async def get_sensors_payload():
    raise NotImplementedError("Not implemented yet")
