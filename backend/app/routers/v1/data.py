from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/v1",
    tags=["Data"],
)


class MessageResponse(BaseModel):
    message: str


@router.get(
    "/missions/list",
    summary="List all missions/sessions",
    response_model=MessageResponse,
)
async def get_missions_list():
    return {"message": "hello mks"}


@router.post(
    "/missions/start",
    summary="Start new mission logging",
    response_model=MessageResponse,
)
async def start_mission():
    return {"message": "hello mks"}


@router.post(
    "/missions/stop",
    summary="Stop current mission logging",
    response_model=MessageResponse,
)
async def stop_mission():
    return {"message": "hello mks"}


@router.get(
    "/missions/{mission_id}/metadata",
    summary="Get mission metadata",
    response_model=MessageResponse,
)
async def get_mission_metadata(mission_id: str):
    return {"message": "hello mks"}


@router.get(
    "/data/rosbag/{mission_id}",
    summary="Download rosbag file",
    response_model=MessageResponse,
)
async def download_rosbag(mission_id: str):
    return {"message": "hello mks"}


@router.get(
    "/data/telemetry/{mission_id}",
    summary="Query telemetry from mission",
    response_model=MessageResponse,
)
async def get_mission_telemetry(mission_id: str):
    return {"message": "hello mks"}


@router.get(
    "/data/commands/{mission_id}",
    summary="Get command history for mission",
    response_model=MessageResponse,
)
async def get_mission_commands(mission_id: str):
    return {"message": "hello mks"}


@router.get(
    "/data/events/{mission_id}",
    summary="Get mission events log",
    response_model=MessageResponse,
)
async def get_mission_events(mission_id: str):
    return {"message": "hello mks"}


@router.post(
    "/playback/start", summary="Start mission playback", response_model=MessageResponse
)
async def start_playback():
    return {"message": "hello mks"}


@router.post(
    "/playback/control",
    summary="Pause/resume/seek playback",
    response_model=MessageResponse,
)
async def control_playback():
    return {"message": "hello mks"}


@router.get(
    "/playback/status",
    summary="Get current playback status",
    response_model=MessageResponse,
)
async def get_playback_status():
    return {"message": "hello mks"}
