from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.translation_engine import detect_language

router = APIRouter()

class DetectRequest(BaseModel):
    text: str
    hint: Optional[str] = None

class DetectResponse(BaseModel):
    language: str
    confidence: float

@router.post('/detect-language', response_model=DetectResponse)
async def detect(req: DetectRequest):
    lang, conf = await detect_language(req.text)
    return { 'language': lang, 'confidence': conf }
