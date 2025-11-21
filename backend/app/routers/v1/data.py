from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from ...database import get_db
from ...services.database_service import DatabaseService

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
    service = DatabaseService(db)
    missions = await service.list_missions()
    return [
        MissionResponse(
            id=m.id,
            name=m.name,
            start_time=m.start_time.isoformat(),
            end_time=m.end_time.isoformat() if m.end_time else None,
            status=m.status,
        )
        for m in missions
    ]


@router.post(
    "/missions/start",
    summary="Start new mission logging",
    response_model=MissionResponse,
)
async def start_mission(name: str = "Mission", db: AsyncSession = Depends(get_db)):
    service = DatabaseService(db)
    # Check if there's an active mission
    active = await service.get_active_mission()
    if active:
        raise HTTPException(status_code=400, detail="Active mission already exists")

    mission = await service.create_mission(name)
    return MissionResponse(
        id=mission.id,
        name=mission.name,
        start_time=mission.start_time.isoformat(),
        end_time=None,
        status=mission.status,
    )


@router.post(
    "/missions/stop",
    summary="Stop current mission logging",
)
async def stop_mission(db: AsyncSession = Depends(get_db)):
    service = DatabaseService(db)
    active = await service.get_active_mission()
    if not active:
        raise HTTPException(status_code=400, detail="No active mission")

    await service.end_mission(active.id)
    return {"message": "Mission stopped"}


@router.get(
    "/missions/{mission_id}/metadata",
    summary="Get mission metadata",
    response_model=MissionResponse,
)
async def get_mission_metadata(mission_id: int, db: AsyncSession = Depends(get_db)):
    service = DatabaseService(db)
    mission = await service.get_mission(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    return MissionResponse(
        id=mission.id,
        name=mission.name,
        start_time=mission.start_time.isoformat(),
        end_time=mission.end_time.isoformat() if mission.end_time else None,
        status=mission.status,
    )


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
    service = DatabaseService(db)
    logs = await service.get_telemetry_logs(mission_id, topic, limit)
    return [
        TelemetryLogResponse(
            id=log.id,
            timestamp=log.timestamp.isoformat(),
            topic=log.topic,
            data=log.data,
        )
        for log in logs
    ]


@router.get(
    "/data/commands/{mission_id}",
    summary="Get command history for mission",
    response_model=List[CommandLogResponse],
)
async def get_mission_commands(
    mission_id: int, limit: int = 50, db: AsyncSession = Depends(get_db)
):
    service = DatabaseService(db)
    logs = await service.get_command_logs(mission_id, limit)
    return [
        CommandLogResponse(
            id=log.id,
            timestamp=log.timestamp.isoformat(),
            command=log.command,
            parameters=log.parameters,
            status=log.status,
        )
        for log in logs
    ]


# Placeholder endpoints (not implemented yet)
@router.get(
    "/data/rosbag/{mission_id}",
    summary="Download rosbag file",
)
async def download_rosbag(mission_id: str):
    return {"message": "Not implemented"}


@router.get(
    "/data/events/{mission_id}",
    summary="Get mission events log",
)
async def get_mission_events(mission_id: str):
    return {"message": "Not implemented"}


@router.post("/playback/start", summary="Start mission playback")
async def start_playback():
    return {"message": "Not implemented"}


@router.post(
    "/playback/control",
    summary="Pause/resume/seek playback",
)
async def control_playback():
    return {"message": "Not implemented"}


@router.get(
    "/playback/status",
    summary="Get current playback status",
)
async def get_playback_status():
    return {"message": "Not implemented"}
