from fastapi import APIRouter
from fastapi.responses import JSONResponse
import os

router = APIRouter()

@router.get('/health')
async def health():
    return JSONResponse({'status':'ok','uptime':True})

@router.get('/metrics')
async def metrics():
    # Minimal Prometheus-style metrics endpoint (placeholder)
    return """# HELP sts_translations_total Total translations performed\n# TYPE sts_translations_total counter\nsts_translations_total 0\n"""
