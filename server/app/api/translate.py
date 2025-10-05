from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Any, List
from app.services.translation_engine import translate_text, translate_batch
from app.services.firestore_adapter import maybe_write_translation

router = APIRouter()

class TranslateRequest(BaseModel):
    content: str
    source_language: Optional[str] = None
    target_language: str
    context: Optional[str] = 'post'
    tone: Optional[str] = 'auto'
    user_id: Optional[str] = None
    document_type: Optional[str] = None
    document_id: Optional[str] = None
    firestore_collection: Optional[str] = None
    write_back: Optional[bool] = False

class TranslateResponse(BaseModel):
    translated_text: str
    source_language: Optional[str]
    confidence: float
    cache_hit: bool = False
    model: str
    firestore_write: Optional[Any] = None

@router.post("/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    if not req.content or not req.target_language:
        raise HTTPException(status_code=400, detail="content and target_language are required")
    result = await translate_text(req.content, req.target_language, source=req.source_language, tone=req.tone, context=req.context)
    firestore_result = None
    if req.write_back and req.document_type and req.document_id:
        firestore_result = maybe_write_translation(
            req.document_type, req.firestore_collection or f"{req.document_type}s", req.document_id,
            req.target_language, result['translated_text'], result
        )
    return {
        "translated_text": result['translated_text'],
        "source_language": result.get('source_language'),
        "confidence": result.get('confidence', 0.0),
        "cache_hit": False,
        "model": result.get('model', 'unknown'),
        "firestore_write": firestore_result
    }

@router.post("/translate/batch")
async def translate_batch_endpoint(items: List[TranslateRequest]):
    responses = await translate_batch(items)
    return responses
