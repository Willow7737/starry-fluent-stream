# Minimal DB placeholders. For a production system, replace with SQLAlchemy + Alembic migrations.
import sqlite3, os
DB_PATH = os.getenv('DATABASE_URL', 'sqlite:///./data.db').replace('sqlite:///', '')
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cur = conn.cursor()
cur.execute('CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, payload TEXT)')
conn.commit()
