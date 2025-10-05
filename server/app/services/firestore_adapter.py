import os, base64, json, logging
log = logging.getLogger('firestore_adapter')
try:
    from google.cloud import firestore
    FIRESTORE_AVAILABLE = True
except Exception as e:
    FIRESTORE_AVAILABLE = False

def init_firestore_client():
    key_b64 = os.getenv('FIREBASE_SERVICE_ACCOUNT_B64', '')
    if not key_b64:
        log.warning('No FIREBASE_SERVICE_ACCOUNT_B64 provided - Firestore disabled')
        return None
    try:
        key_json = base64.b64decode(key_b64)
        with open('/tmp/firebase_sa.json', 'wb') as f:
            f.write(key_json)
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/tmp/firebase_sa.json'
        if FIRESTORE_AVAILABLE:
            return firestore.Client()
        return None
    except Exception as e:
        log.exception('Failed to initialize Firestore client: %s', e)
        return None

_client = init_firestore_client()

def maybe_write_translation(document_type, collection, document_id, target_language, translated_text, meta):
    """Write translation to posts OR create a translations subcollection for comments/messages"""
    if not _client:
        log.info('Firestore client not initialized; skipping write')
        return {'status':'disabled'}
    try:
        if document_type == 'post':
            doc_ref = _client.collection(collection).document(document_id)
            doc_ref.update({
                'translatedContent': translated_text,
                'isTranslated': True,
                'translationsMeta': {
                    'model': meta.get('model'),
                    'confidence': meta.get('confidence'),
                    'tone': meta.get('tone', 'auto'),
                    'translated_at': firestore.SERVER_TIMESTAMP if 'firestore' in globals() else None
                }
            })
            return {'status':'ok','collection':collection,'document_id':document_id}
        else:
            # write to translations subcollection
            ts_ref = _client.collection('translations').document(collection).collection(document_id)
            item = {
                'original_text': meta.get('original_text') or '',
                'translated_text': translated_text,
                'target_language': target_language,
                'confidence': meta.get('confidence'),
                'model': meta.get('model'),
                'created_by_service': 'starry-sts'
            }
            ts_ref.add(item)
            return {'status':'ok','collection':f'translations/{collection}/{document_id}'}
    except Exception as e:
        log.exception('Failed to write to Firestore: %s', e)
        return {'status':'error','error':str(e)}
