# Starry Translation Service (STS) - Server

Lightweight FastAPI-based translation microservice designed to integrate with the Starry frontend testing portal included in this repo.

## About
This service translates user-generated content, preserves tone, and can write translations back to a Firestore database. It is intended to be run as a local dev server or deployed on Render using the provided `render.yaml`.

The server supports two operation modes:
- **Local model mode** (default): attempts to use a local Hugging Face model (`facebook/m2m100_418M`). This requires more memory but is free to run when available.
- **Fallback/Inference mode**: uses the Hugging Face Inference API when `FALLBACK_ONLY=true` or when a local model isn't available. Set `HF_TOKEN` in env to enable this.

## Quick start (local)
1. Copy `.env.example` to `.env` and set `FIREBASE_SERVICE_ACCOUNT_B64` (base64 JSON of your service account) if you want Firestore writes.
2. Build and run with Docker:
   ```bash
   docker build -t starry-sts-server .
   docker run -p 8000:8000 --env-file .env starry-sts-server
   ```
3. Visit `http://localhost:8000/docs` for interactive API docs (Swagger UI).

## Endpoints (high level)
- `POST /v1/detect-language` — detect language
- `POST /v1/translate` — translate a piece of text (supports write_back for posts)
- `POST /v1/translate/batch` — translate multiple items
- `POST /v1/feedback` — user feedback (saved to local DB)
- `GET /v1/health` — health check
- `GET /v1/metrics` — minimal metrics

## Firestore integration
Provide `FIREBASE_SERVICE_ACCOUNT_B64` as a base64-encoded service account JSON. The service will decode and set `GOOGLE_APPLICATION_CREDENTIALS` automatically.

## Notes & next steps
- This is a developer-focused scaffold intended for testing and integration with the frontend portal. For production, add robust error handling, proper DB migrations (Alembic), and secure secrets storage.
- If you plan to host large models on Render, ensure your plan supports the memory/CPU requirements or use `FALLBACK_ONLY=true` with `HF_TOKEN`.

## License
MIT
