from pydantic import BaseModel
from typing import Optional
class TranslationItem(BaseModel):
    id: Optional[str]
    original_text: str
    translated_text: str
    target_language: str
    confidence: float
