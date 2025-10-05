from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import crud

router = APIRouter()

class FeedbackRequest(BaseModel):
    translation_id: Optional[str] = None
    original: str
    translation: str
    correction: Optional[str] = None
    rating: Optional[int] = None
    user_id: Optional[str] = None

@router.post('/feedback')
async def feedback(req: FeedbackRequest):
    # For now persist simple feedback to DB (crud layer will create table lazily/in future)
    await crud.save_feedback(dict(req))
    return {'status': 'ok'}
