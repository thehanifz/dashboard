from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
from app.core.config import (
    GOOGLE_APPLICATION_CREDENTIALS,
    SPREADSHEET_ID,
    STATUS_SHEET_NAME,
    STATUS_COL_PRIMARY,
    STATUS_COL_DETAIL,
)


def normalize(text: str) -> str:
    return text.strip().lower()


def read_status_master():
    creds = Credentials.from_service_account_file(
        GOOGLE_APPLICATION_CREDENTIALS,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"],
    )

    service = build("sheets", "v4", credentials=creds)

    try:
        result = (
            service.spreadsheets()
            .values()
            .get(
                spreadsheetId=SPREADSHEET_ID,
                range=STATUS_SHEET_NAME,
            )
            .execute()
        )
    except Exception as e:
        print(f"Error accessing Google Sheets API: {str(e)}")
        # Return default structure with column names but empty data
        return {
            "primary": [],
            "mapping": {},
            "status_column": STATUS_COL_PRIMARY,
            "detail_column": STATUS_COL_DETAIL
        }

    values = result.get("values", [])
    if not values:
        return {"primary": [], "mapping": {}, "status_column": STATUS_COL_PRIMARY, "detail_column": STATUS_COL_DETAIL}

    headers = values[0]
    rows = values[1:]

    # === NORMALIZE HEADER MAP ===
    header_map = {normalize(h): idx for idx, h in enumerate(headers)}

    primary_key = normalize(STATUS_COL_PRIMARY)
    detail_key = normalize(STATUS_COL_DETAIL)

    if primary_key not in header_map:
        raise RuntimeError(
            f"Primary status column '{STATUS_COL_PRIMARY}' "
            f"not found in sheet '{STATUS_SHEET_NAME}'. "
            f"Available columns: {headers}"
        )

    idx_primary = header_map[primary_key]
    idx_detail = header_map.get(detail_key)  # boleh None

    mapping = {}

    for row in rows:
        if len(row) <= idx_primary:
            continue

        primary = row[idx_primary].strip()
        if not primary:
            continue

        detail = "-"
        if idx_detail is not None and len(row) > idx_detail:
            detail = row[idx_detail].strip() or "-"

        mapping.setdefault(primary, []).append(detail)

    return {
        "primary": list(mapping.keys()),
        "mapping": mapping,
        "status_column": STATUS_COL_PRIMARY,
        "detail_column": STATUS_COL_DETAIL,
    }
