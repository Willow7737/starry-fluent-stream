from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import translate, detect, feedback, health
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("starry-sts")

app = FastAPI(title="Starry Translation Service (STS)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translate.router, prefix="/v1")
app.include_router(detect.router, prefix="/v1")
app.include_router(feedback.router, prefix="/v1")
app.include_router(health.router, prefix="/v1")

@app.on_event("startup")
async def startup_event():
    log.info("Starting Starry STS...")
