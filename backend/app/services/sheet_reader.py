import os
from typing import Dict, List
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials

from app.core.config import (
    GOOGLE_APPLICATION_CREDENTIALS,
    SPREADSHEET_ID,
    SHEET_NAME,
)


def get_sheet_service():
    creds = Credentials.from_service_account_file(
        GOOGLE_APPLICATION_CREDENTIALS,
        scopes=[
            "https://www.googleapis.com/auth/spreadsheets.readonly"
        ],
    )
    return build("sheets", "v4", credentials=creds)


def read_sheet(
    spreadsheet_id: str = SPREADSHEET_ID,
    sheet_name: str = SHEET_NAME,
) -> Dict[str, List]:
    service = get_sheet_service()

    result = (
        service.spreadsheets()
        .values()
        .get(
            spreadsheetId=spreadsheet_id,
            range=sheet_name,
        )
        .execute()
    )

    values = result.get("values", [])
    if not values:
        return {"columns": [], "records": []}

    headers = values[0]
    records = []

    for idx, row in enumerate(values[1:], start=2):
        row_data = dict(zip(headers, row))

        records.append(
            {
                "id": f"rec_{idx}",
                "row_id": idx,
                "data": row_data,
            }
        )

    return {
        "columns": headers,
        "records": records,
    }
