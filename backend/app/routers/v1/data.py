from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ...database import get_db

router = APIRouter(
    prefix="/api/v1",
    tags=["Data"],
)


class MissionResponse(BaseModel):
    id: int
    name: str
    start_time: str
    end_time: Optional[str]
    status: str


class TelemetryLogResponse(BaseModel):
    id: int
    timestamp: str
    topic: str
    data: str


class CommandLogResponse(BaseModel):
    id: int
    timestamp: str
    command: str
    parameters: str
    status: str


@router.get(
    "/missions/list",
    summary="List all missions/sessions",
    response_model=List[MissionResponse],
)
async def get_missions_list(db: AsyncSession = Depends(get_db)):
    raise NotImplementedError("Not implemented yet")


@router.post(
    "/missions/start",
    summary="Start new mission logging",
    response_model=MissionResponse,
)
async def start_mission(name: str = "Mission", db: AsyncSession = Depends(get_db)):
    raise NotImplementedError("Not implemented yet")


@router.post(
    "/missions/stop",
    summary="Stop current mission logging",
)
async def stop_mission(db: AsyncSession = Depends(get_db)):
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/missions/{mission_id}/metadata",
    summary="Get mission metadata",
    response_model=MissionResponse,
)
async def get_mission_metadata(mission_id: int, db: AsyncSession = Depends(get_db)):
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/data/telemetry/{mission_id}",
    summary="Query telemetry from mission",
    response_model=List[TelemetryLogResponse],
)
async def get_mission_telemetry(
    mission_id: int,
    topic: Optional[str] = None,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/data/commands/{mission_id}",
    summary="Get command history for mission",
    response_model=List[CommandLogResponse],
)
async def get_mission_commands(
    mission_id: int, limit: int = 50, db: AsyncSession = Depends(get_db)
):
    raise NotImplementedError("Not implemented yet")


# Placeholder endpoints (not implemented yet)
@router.get(
    "/data/rosbag/{mission_id}",
    summary="Download rosbag file",
)
async def download_rosbag(mission_id: str):
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/data/events/{mission_id}",
    summary="Get mission events log",
)
async def get_mission_events(mission_id: str):
    raise NotImplementedError("Not implemented yet")


@router.post("/playback/start", summary="Start mission playback")
async def start_playback():
    raise NotImplementedError("Not implemented yet")


@router.post(
    "/playback/control",
    summary="Pause/resume/seek playback",
)
async def control_playback():
    raise NotImplementedError("Not implemented yet")


@router.get(
    "/playback/status",
    summary="Get current playback status",
)
async def get_playback_status():
    raise NotImplementedError("Not implemented yet")
