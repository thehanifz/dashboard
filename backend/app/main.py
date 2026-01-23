from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.records import router as records_router
from app.api.status import router as status_router
from app.core.config import BACKEND_CORS_ORIGINS, ROOT_PATH

# Setting root_path penting agar Swagger UI (/docs) tahu dia berada di sub-path /api
app = FastAPI(root_path=ROOT_PATH)

app.add_middleware(
    CORSMiddleware,
    allow_origins=BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True, "message": "Backend is running behind proxy"}

app.include_router(records_router)
app.include_router(status_router)