import json
from app.db import models

async def save_feedback(payload: dict):
    conn = models.conn
    cur = conn.cursor()
    cur.execute('INSERT INTO feedback (payload) VALUES (?)', (json.dumps(payload),))
    conn.commit()
    return True
