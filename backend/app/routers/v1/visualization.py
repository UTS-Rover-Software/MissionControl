from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/v1",
    tags=["Visualization"],
)


class MessageResponse(BaseModel):
    message: str


@router.get(
    "/slam/map/current",
    summary="Get current SLAM map data",
    response_model=MessageResponse,
)
async def get_current_slam_map():
    return {"message": "hello mks"}


@router.get(
    "/pose/current",
    summary="Get current rover pose/position",
    response_model=MessageResponse,
)
async def get_current_pose():
    return {"message": "hello mks"}
