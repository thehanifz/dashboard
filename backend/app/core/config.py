import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

# === GOOGLE CREDENTIAL ===
GOOGLE_APPLICATION_CREDENTIALS = os.getenv(
    "GOOGLE_APPLICATION_CREDENTIALS"
)

SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")

# === RAW DATA SHEET ===
SHEET_NAME = os.getenv("SHEET_NAME")

# === STATUS MASTER CONFIG ===
STATUS_SHEET_NAME = os.getenv("STATUS_SHEET_NAME")
STATUS_COL_PRIMARY = os.getenv("STATUS_COL_PRIMARY")
STATUS_COL_DETAIL = os.getenv("STATUS_COL_DETAIL")

# === SECURITY & SERVER CONFIG ===
# Default ke /api jika tidak di-set, karena kita akan pindah ke reverse proxy
ROOT_PATH = os.getenv("ROOT_PATH", "/api")

# Helper function untuk parse comma-separated string
def parse_cors(v: str) -> List[str]:
    if not v:
        return ["*"]
    return [x.strip() for x in v.split(",") if x]

BACKEND_CORS_ORIGINS = parse_cors(os.getenv("BACKEND_CORS_ORIGINS", "*"))