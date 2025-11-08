from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/v1",
    tags=["Tasks"],
)


class MessageResponse(BaseModel):
    message: str


@router.post(
    "/tasks/post-landing/cache-status",
    summary="Log cache status",
    response_model=MessageResponse,
)
async def log_cache_status():
    return {"message": "hello mks"}


@router.post(
    "/tasks/post-landing/keyboard-input",
    summary="Log keyboard interaction",
    response_model=MessageResponse,
)
async def log_keyboard_input():
    return {"message": "hello mks"}


@router.post(
    "/tasks/space-resources/site-image",
    summary="Submit site image",
    response_model=MessageResponse,
)
async def submit_site_image():
    return {"message": "hello mks"}


@router.post(
    "/tasks/space-resources/water-calculation",
    summary="Submit water calculation",
    response_model=MessageResponse,
)
async def submit_water_calculation():
    return {"message": "hello mks"}


@router.post(
    "/tasks/excavation/rock-cleared",
    summary="Log rock clearing",
    response_model=MessageResponse,
)
async def log_rock_cleared():
    return {"message": "hello mks"}


@router.post(
    "/tasks/excavation/regolith-transported",
    summary="Log regolith transport",
    response_model=MessageResponse,
)
async def log_regolith_transported():
    return {"message": "hello mks"}


@router.post(
    "/tasks/excavation/paver-assembled",
    summary="Log paver assembly",
    response_model=MessageResponse,
)
async def log_paver_assembled():
    return {"message": "hello mks"}


@router.get(
    "/tasks/autonomous/placard-locations",
    summary="Get known placard locations",
    response_model=MessageResponse,
)
async def get_placard_locations():
    return {"message": "hello mks"}


@router.post(
    "/tasks/autonomous/placard-image",
    summary="Submit placard image",
    response_model=MessageResponse,
)
async def submit_placard_image():
    return {"message": "hello mks"}


@router.post(
    "/tasks/autonomous/cube-detected",
    summary="Log cube detection",
    response_model=MessageResponse,
)
async def log_cube_detected():
    return {"message": "hello mks"}
