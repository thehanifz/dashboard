from fastapi import APIRouter
from app.services.sheet_reader import read_sheet
from fastapi import HTTPException
from pydantic import BaseModel
import json

from app.services.status_reader import read_status_master
from app.services.sheet_writer import update_cells

router = APIRouter(prefix="/records", tags=["records"])
class StatusUpdatePayload(BaseModel):
    status: str
    detail: str | None = None

@router.post("/{row_id}/status")
def update_record_status(row_id: int, payload: StatusUpdatePayload):
    if row_id < 2:
        raise HTTPException(
            status_code=400,
            detail="row_id must be >= 2 (row 1 is header)",
        )

    # Check if detail is a JSON string containing column updates
    if payload.detail and payload.detail.startswith('{'):
        try:
            # Parse the JSON string to get column updates
            updates = json.loads(payload.detail)
            if isinstance(updates, dict):
                # This is a general column update request
                update_cells(row_id=row_id, updates=updates)

                return {
                    "ok": True,
                    "row_id": row_id,
                    "updates": updates,
                }
        except json.JSONDecodeError:
            # If JSON parsing fails, continue with normal status update
            pass

    # Normal status update flow
    master = read_status_master()

    status = payload.status.strip()
    detail = (payload.detail or "").strip()

    if status not in master["mapping"]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{status}'",
        )

    if detail and detail not in master["mapping"][status]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid detail '{detail}' for status '{status}'",
        )

    updates = {
        master["status_column"]: status,
    }

    if detail:
        updates[master["detail_column"]] = detail

    update_cells(row_id=row_id, updates=updates)

    return {
        "ok": True,
        "row_id": row_id,
        "status": status,
        "detail": detail or "-",
    }


class GeneralUpdatePayload(BaseModel):
    updates: dict[str, str]


@router.post("/{row_id}/cells")
def update_record_cells(row_id: int, payload: GeneralUpdatePayload):
    if row_id < 2:
        raise HTTPException(
            status_code=400,
            detail="row_id must be >= 2 (row 1 is header)",
        )

    updates = payload.updates

    # Validate that all columns exist in the sheet
    sheet_data = read_sheet()
    if sheet_data["columns"]:
        invalid_columns = [col for col in updates.keys() if col not in sheet_data["columns"]]
        if invalid_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid columns: {invalid_columns}. Available columns: {sheet_data['columns']}"
            )

    update_cells(row_id=row_id, updates=updates)

    return {
        "ok": True,
        "row_id": row_id,
        "updates": updates,
    }


@router.get("")
def get_records():
    return read_sheet()


@router.post("/by-id/{record_id}/status")
def update_record_status_by_id(record_id: str, payload: StatusUpdatePayload):
    records = read_sheet()["records"]

    record = next(
        (r for r in records if r["id"] == record_id),
        None,
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"Record '{record_id}' not found",
        )

    row_id = record["row_id"]

    if row_id < 2:
        raise HTTPException(
            status_code=400,
            detail="row_id must be >= 2 (header row)",
        )

    master = read_status_master()

    status = payload.status.strip()
    detail = (payload.detail or "").strip()

    if status not in master["mapping"]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{status}'",
        )

    if detail and detail not in master["mapping"][status]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid detail '{detail}' for status '{status}'",
        )

    updates = {master["status_column"]: status}
    if detail:
        updates[master["detail_column"]] = detail

    update_cells(row_id=row_id, updates=updates)

    return {
        "ok": True,
        "record_id": record_id,
        "row_id": row_id,
        "status": status,
        "detail": detail or "-",
    }
