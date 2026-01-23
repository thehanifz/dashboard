from fastapi import APIRouter
from app.services.status_reader import read_status_master

router = APIRouter(prefix="/status", tags=["status"])


@router.get("")
def get_status():
    return read_status_master()
