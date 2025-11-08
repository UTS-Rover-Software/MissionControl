from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/v1/cameras",
    tags=["Cameras"],
)


class MessageResponse(BaseModel):
    message: str


@router.get(
    "/list", summary="Get available camera feeds", response_model=MessageResponse
)
async def get_camera_list():
    return {"message": "hello mks"}


@router.post(
    "/{camera_id}/config",
    summary="Configure camera settings",
    response_model=MessageResponse,
)
async def configure_camera(camera_id: str):
    return {"message": "hello mks"}


@router.get(
    "/{camera_id}/snapshot",
    summary="Get single frame capture",
    response_model=MessageResponse,
)
async def get_camera_snapshot(camera_id: str):
    return {"message": "hello mks"}


@router.get(
    "/{camera_id}/status",
    summary="Get camera status and parameters",
    response_model=MessageResponse,
)
async def get_camera_status(camera_id: str):
    return {"message": "hello mks"}
