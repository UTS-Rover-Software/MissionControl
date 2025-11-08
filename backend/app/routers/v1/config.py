from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/v1",
    tags=["Configuration"],
)


class MessageResponse(BaseModel):
    message: str


@router.get(
    "/config/rover",
    summary="Get all rover configuration",
    response_model=MessageResponse,
)
async def get_rover_config():
    return {"message": "hello mks"}


@router.post(
    "/config/rover",
    summary="Update rover configuration",
    response_model=MessageResponse,
)
async def update_rover_config():
    return {"message": "hello mks"}


@router.get(
    "/config/presets",
    summary="List configuration presets",
    response_model=MessageResponse,
)
async def get_config_presets():
    return {"message": "hello mks"}


@router.post(
    "/config/presets/{preset_name}",
    summary="Load configuration preset",
    response_model=MessageResponse,
)
async def load_config_preset(preset_name: str):
    return {"message": "hello mks"}


@router.post(
    "/config/validate",
    summary="Validate configuration before applying",
    response_model=MessageResponse,
)
async def validate_config():
    return {"message": "hello mks"}
