import pytest
from ...database import init_db, get_db
from ...services.database_service import DatabaseService
import json


@pytest.mark.asyncio
async def test_create_mission():
    # Setup
    await init_db()
    async for session in get_db():
        service = DatabaseService(session)

        # Test
        mission = await service.create_mission("Test Mission")
        assert mission.name == "Test Mission"
        assert mission.status == "active"
        assert mission.end_time is None


@pytest.mark.asyncio
async def test_get_mission():
    async for session in get_db():
        service = DatabaseService(session)

        # Create mission
        mission = await service.create_mission("Test Mission")

        # Test retrieval
        retrieved = await service.get_mission(mission.id)
        assert retrieved is not None
        assert retrieved.id == mission.id


@pytest.mark.asyncio
async def test_end_mission():
    async for session in get_db():
        service = DatabaseService(session)

        # Create and end mission
        mission = await service.create_mission("Test Mission")
        success = await service.end_mission(mission.id, "completed")

        assert success
        updated = await service.get_mission(mission.id)
        assert updated.status == "completed"
        assert updated.end_time is not None


@pytest.mark.asyncio
async def test_log_telemetry():
    async for session in get_db():
        service = DatabaseService(session)

        # Create mission
        mission = await service.create_mission("Test Mission")

        # Log telemetry
        data = {"temperature": 25.5, "voltage": 12.1}
        log = await service.log_telemetry(mission.id, "sensors/vesc", data)

        assert log.mission_id == mission.id
        assert log.topic == "sensors/vesc"
        assert json.loads(log.data) == data


@pytest.mark.asyncio
async def test_get_telemetry_logs():
    async for session in get_db():
        service = DatabaseService(session)

        # Create mission and logs
        mission = await service.create_mission("Test Mission")
        await service.log_telemetry(mission.id, "topic1", {"value": 1})
        await service.log_telemetry(mission.id, "topic2", {"value": 2})

        # Test retrieval
        logs = await service.get_telemetry_logs(mission.id)
        assert len(logs) == 2

        # Test topic filter
        topic_logs = await service.get_telemetry_logs(mission.id, "topic1")
        assert len(topic_logs) == 1
        assert topic_logs[0].topic == "topic1"


@pytest.mark.asyncio
async def test_log_command():
    async for session in get_db():
        service = DatabaseService(session)

        # Create mission
        mission = await service.create_mission("Test Mission")

        # Log command
        params = {"speed": 1.0, "direction": "forward"}
        log = await service.log_command(mission.id, "move", params)

        assert log.mission_id == mission.id
        assert log.command == "move"
        assert json.loads(log.parameters) == params


@pytest.mark.asyncio
async def test_update_command_status():
    async for session in get_db():
        service = DatabaseService(session)

        # Create mission and command
        mission = await service.create_mission("Test Mission")
        command = await service.log_command(mission.id, "move", {})

        # Update status
        success = await service.update_command_status(command.id, "acknowledged")
        assert success

        # Verify
        logs = await service.get_command_logs(mission.id)
        assert logs[0].status == "acknowledged"
