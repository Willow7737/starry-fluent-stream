Starry Translation — Frontend Portal

A lightweight web portal for the Starry Translation Service (STS). Built with Vite + React + TypeScript and designed to demo translation, tone-preservation, and history features while integrating with a FastAPI backend.


---

Table of contents

About

Live demo / Deployments

Features

Repository layout

Quick start — Frontend (dev)

Frontend environment variables

Running the backend locally (optional)

API — endpoints & examples

How the frontend chooses live vs mock translation

Production build & Vercel notes

Android / Mobile integration

Troubleshooting

Contributing

License & credits



---

About

This repository contains the frontend portal for the Starry Translation Service (STS). The portal demonstrates translation features (including tone and detection), keeps a local history, and can be wired to a live STS backend (FastAPI) for real translations.

It was intentionally built so the UI works offline with a mocked translation engine (for demos), but can call a live backend when the VITE_STS_API_URL environment variable is supplied.


---

Live demo / Deployments

Frontend: deployed on Vercel (set VITE_STS_API_URL in project environment variables and redeploy).

Backend: a sample deployment URL commonly used in this project is https://starry-translation.onrender.com (your deployment may vary).



---

Features

Live translation via STS (POST /v1/translate).

Tone support (e.g., formal, friendly, literal), passed to the backend where supported.

Local mock translation fallback so the UI remains usable offline/during development.

Translation history (client-side), quick re-run of past translations.

Clean Vite + React + TypeScript stack, ready for production builds.



---

Repository layout

/ (repo root)
├─ src/                      # Frontend (Vite + React + TypeScript)
│  ├─ pages/                 # Pages (Index.tsx main portal)
│  ├─ components/            # UI components (selectors, input, result, history)
│  └─ lib/                   # Helpers: mockTranslation.ts + translationClient.ts
├─ server/                   # FastAPI backend (separate service)
│  ├─ app/                   # Python FastAPI app and API routes
│  └─ render.yaml             # Render deployment config (if used)
├─ package.json              # Frontend build & deps
└─ README.md                 # <-- this file

> Note: src/lib/translationClient.ts is the frontend file that calls the STS API. src/lib/mockTranslation.ts is retained as an offline demo fallback.




---

Quick start — Frontend (dev)

Prerequisites

Node.js 18+ (recommended)

npm (or pnpm/yarn)


Install & run locally

# from repo root (frontend folder where package.json is)
npm install
# add environment variables in a .env.local or use your shell ENV (see below)
npm run dev

Open http://localhost:5173 (or the port Vite reports) and use the portal.

If you want the frontend to use the live backend while developing, create a .env.local at the frontend root with the following content:

VITE_STS_API_URL=https://starry-translation.onrender.com

Then restart the dev server so import.meta.env.VITE_STS_API_URL is available to Vite.

> Important: Vite reads import.meta.env.* at build time. When you deploy to Vercel (or another host), set the environment variable in the host's project settings and re-deploy so the correct value is embedded in the build.




---

Frontend environment variables

VITE_STS_API_URL — the base URL of the Starry Translation Service (e.g. https://starry-translation.onrender.com). Must be set for live translations.


Example .env.local:

VITE_STS_API_URL=https://starry-translation.onrender.com


---

Running the backend locally (optional)

The server is a FastAPI microservice located in /server. Quick local start (Python + uvicorn):

# example quick run from /server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# copy example env
cp example.env .env
# run server (development)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Server notes / env vars (server):

HF_TOKEN — (optional) Hugging Face token for inference fallback.

FIREBASE_SERVICE_ACCOUNT_B64 — (optional) base64 encoded firebase service account for Firestore writes.

FALLBACK_ONLY — set to true to skip local heavy models and always use inference/backends.

DATABASE_URL — database for local metrics or feedback storage.


If you prefer containerized execution, the server includes a Dockerfile — build and run it with Docker if needed.


---

API — endpoints & examples

POST /v1/translate

Request body (JSON):

{
  "content": "Hello, world",
  "source_language": "auto",      // optional, omit or "auto" to let the server detect
  "target_language": "es",
  "tone": "friendly",            // optional
  "context": "post"              // optional
}

Example curl:

curl -X POST "$VITE_STS_API_URL/v1/translate" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello","target_language":"es","tone":"friendly"}'

Response (example):

{
  "translated_text": "Hola",
  "source_language": "en",
  "confidence": 0.92,
  "cache_hit": false,
  "model": "Hugging Face M2M100",
  "firestore_write": null
}

POST /v1/translate/batch accepts an array of the same request objects and returns an array of responses.

Other utility endpoints:

GET /v1/health — basic health check

GET /v1/metrics — minimal metrics (if enabled)



---

How the frontend chooses live vs mock translation

src/lib/translationClient.ts is the live client. It reads import.meta.env.VITE_STS_API_URL and POSTs to /v1/translate.

The main page (src/pages/Index.tsx) attempts the live call first. If it fails (network or non-OK response), it shows a toast warning and falls back to src/lib/mockTranslation.ts so the UI remains usable.


If you want the app to require the live backend (no fallback), remove the fallback try/catch in Index.tsx and surface errors directly to the user.


---

Production build & Vercel notes

1. Set the VITE_STS_API_URL environment variable in the Vercel project settings (Production & Preview as needed).


2. Trigger a new Vercel deployment (Vercel will run npm run build).



Why this matters: Vite embeds import.meta.env values at build time. Changing the Vercel env after a deployment will not change the already-built files — you must re-deploy.


---

Android / Mobile integration

Any mobile client can call the STS HTTP API directly (same JSON contract used by the frontend). Use HTTPS and handle latency/retries on the client.

A minimal Android example using OkHttp was included in the project notes — you can adapt it to Retrofit if you prefer typed models.


---

Troubleshooting & FAQ

Q: I set VITE_STS_API_URL but translations still use the mock.

Make sure you restarted/rebuilt the frontend after setting the env var (Vite reads vars at build time). For local dev, restart npm run dev; for Vercel, set the env var in the dashboard and redeploy.


Q: I get CORS errors from the browser.

The server ships with FastAPI CORSMiddleware defaulting to *. If you customized server CORS_ALLOW_ORIGINS, check server/app/core/config.py and ensure the value includes your frontend origin.


Q: I see Live translation failed toasts.

Inspect the browser console and network tab for the failing request and server response. The frontend also surfaces the server HTTP status in the toast.


Q: How do I remove the mock fallback entirely?

Edit src/pages/Index.tsx and remove the fallback try/catch block so the UI propagates the live error.



---

Contributing

1. Fork the repo and open a branch.


2. Keep the frontend and backend changes split into separate commits when possible.


3. Open a PR with a clear description and testing steps.




---

License & credits

This project is provided under the MIT license (or change to your preferred license). The frontend scaffold uses Vite + React + TypeScript and the backend uses FastAPI.


---

If you want, I can:

commit this README.md to your repo and generate a git patch for you to apply,

remove the mock fallback and make the app strictly live-only,

or expand the Android sample to a full Retrofit/Kotlin client.


Which of those would you like next?

