from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from ..database import Mission, TelemetryLog, CommandLog
from datetime import datetime, timezone
from typing import List, Optional
import json


class DatabaseService:
    def __init__(self, session: AsyncSession):
        self.session = session

    # Mission operations
    async def create_mission(self, name: str) -> Mission:
        mission = Mission(name=name)
        self.session.add(mission)
        await self.session.commit()
        await self.session.refresh(mission)
        return mission

    async def get_mission(self, mission_id: int) -> Optional[Mission]:
        result = await self.session.execute(
            select(Mission).where(Mission.id == mission_id)
        )
        return result.scalar_one_or_none()

    async def get_active_mission(self) -> Optional[Mission]:
        result = await self.session.execute(
            select(Mission).where(Mission.status == "active")
        )
        return result.scalar_one_or_none()

    async def end_mission(self, mission_id: int, status: str = "completed") -> bool:
        result = await self.session.execute(
            update(Mission)
            .where(Mission.id == mission_id)
            .values(end_time=datetime.now(timezone.utc), status=status)
        )
        await self.session.commit()
        return result.rowcount > 0

    async def list_missions(self) -> List[Mission]:
        result = await self.session.execute(
            select(Mission).order_by(Mission.start_time.desc())
        )
        return list(result.scalars().all())

    # Telemetry logging
    async def log_telemetry(
        self, mission_id: int, topic: str, data: dict
    ) -> TelemetryLog:
        log = TelemetryLog(mission_id=mission_id, topic=topic, data=json.dumps(data))
        self.session.add(log)
        await self.session.commit()
        await self.session.refresh(log)
        return log

    async def get_telemetry_logs(
        self, mission_id: int, topic: Optional[str] = None, limit: int = 100
    ) -> List[TelemetryLog]:
        query = select(TelemetryLog).where(TelemetryLog.mission_id == mission_id)
        if topic:
            query = query.where(TelemetryLog.topic == topic)
        query = query.order_by(TelemetryLog.timestamp.desc()).limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    # Command logging
    async def log_command(
        self, mission_id: int, command: str, parameters: dict
    ) -> CommandLog:
        log = CommandLog(
            mission_id=mission_id, command=command, parameters=json.dumps(parameters)
        )
        self.session.add(log)
        await self.session.commit()
        await self.session.refresh(log)
        return log

    async def update_command_status(self, command_id: int, status: str) -> bool:
        result = await self.session.execute(
            update(CommandLog).where(CommandLog.id == command_id).values(status=status)
        )
        await self.session.commit()
        return result.rowcount > 0

    async def get_command_logs(
        self, mission_id: int, limit: int = 50
    ) -> List[CommandLog]:
        result = await self.session.execute(
            select(CommandLog)
            .where(CommandLog.mission_id == mission_id)
            .order_by(CommandLog.timestamp.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
