import os, asyncio, logging
log = logging.getLogger('translation_engine')
try:
    from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer, pipeline
    HF_AVAILABLE = True
except Exception as e:
    HF_AVAILABLE = False

import aiohttp

MODEL_NAME = os.getenv('HF_MODEL', 'facebook/m2m100_418M')
HF_TOKEN = os.getenv('HF_TOKEN', '')

async def detect_language(text: str):
    # lightweight heuristic fallback: check presence of fasttext? For now return 'und'
    # If HF_AVAILABLE, use a small detect via inference API (not implemented fully)
    return ('und', 0.0)

async def translate_text(content: str, target: str, source=None, tone='auto', context='post'):
    """Return dict with translated_text, source_language, confidence, model"""
    if os.getenv('FALLBACK_ONLY','').lower() == 'true' or not HF_AVAILABLE:
        # call Hugging Face Inference API if HF_TOKEN provided
        if HF_TOKEN:
            url = f"https://api-inference.huggingface.co/models/{MODEL_NAME}"
            headers = {"Authorization": f"Bearer {HF_TOKEN}", "Accept": "application/json"}
            payload = {"inputs": content, "parameters": {"target_lang": target}}
            async with aiohttp.ClientSession() as s:
                async with s.post(url, headers=headers, json=payload, timeout=60) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        if isinstance(data, list) and len(data)>0 and 'translation_text' in data[0]:
                            return {'translated_text': data[0]['translation_text'], 'source_language': source or 'und', 'confidence': 0.9, 'model': MODEL_NAME}
                    text = await resp.text()
                    log.error('HF inference error: %s', text)
                    return {'translated_text': content, 'source_language': source or 'und', 'confidence': 0.0, 'model': 'fallback'}
        else:
            # no HF token -> return original text as fallback
            return {'translated_text': content, 'source_language': source or 'und', 'confidence': 0.0, 'model': 'none'}

    # Try using local transformers
    try:
        tokenizer = M2M100Tokenizer.from_pretrained(MODEL_NAME)
        model = M2M100ForConditionalGeneration.from_pretrained(MODEL_NAME)
        tokenizer.src_lang = source if source else 'auto'
        inputs = tokenizer(content, return_tensors="pt")
        generated = model.generate(**inputs, forced_bos_token_id=tokenizer.get_lang_id(target))
        translated = tokenizer.batch_decode(generated, skip_special_tokens=True)[0]
        return {'translated_text': translated, 'source_language': source or 'und', 'confidence': 0.9, 'model': MODEL_NAME}
    except Exception as e:
        log.exception('Local translation failed, falling back to HF inference if available')
        # fallback to inference API if token exists
        if HF_TOKEN:
            os.environ['FALLBACK_ONLY'] = 'true'
            return await translate_text(content, target, source, tone, context)
        return {'translated_text': content, 'source_language': source or 'und', 'confidence': 0.0, 'model': 'error'}

async def translate_batch(items):
    results = []
    for it in items:
        res = await translate_text(it.content, it.target_language, source=it.source_language, tone=it.tone, context=it.context)
        results.append(res)
    return results
