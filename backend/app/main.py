from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.records import router as records_router
from app.api.status import router as status_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://192.168.100.3:5174",
        "https://v5174.thehanifz.fun",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:8000",
        "http://192.168.100.3:8000",
        "http://192.168.100.3:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

app.include_router(records_router)
app.include_router(status_router)
