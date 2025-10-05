export type ToneType = "formal" | "friendly" | "literal" | "auto";

/**
 * Call the Starry Translation Service (STS) hosted at VITE_STS_API_URL
 * Falls back to throwing an error if the env var is missing or the request fails.
 *
 * Returns an object compatible with the frontend's expected shape:
 * { translation: string, confidence: number, latency: number, model: string, detectedLanguage?: string }
 */
export async function translate(
  text: string,
  sourceLang: string,
  targetLang: string,
  tone: ToneType
): Promise<{
  translation: string;
  confidence: number;
  latency: number;
  model: string;
  detectedLanguage?: string;
}> {
  const base = import.meta.env.VITE_STS_API_URL || "";
  if (!base) {
    throw new Error("VITE_STS_API_URL is not set. Please configure the backend URL in your environment.");
  }

  const url = `${base.replace(/\/$/, "")}/v1/translate`;
  const payload: any = {
    content: text,
    target_language: targetLang,
    tone: tone === "auto" ? undefined : tone,
  };
  if (sourceLang && sourceLang !== "auto") payload.source_language = sourceLang;

  const start = Date.now();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const latency = Date.now() - start;

  if (!res.ok) {
    const textErr = await res.text().catch(() => "");
    throw new Error(`STS responded with ${res.status}: ${textErr}`);
  }

  const data = await res.json();

  return {
    translation: data.translated_text ?? data.translation ?? "",
    confidence: typeof data.confidence === "number" ? data.confidence : 0,
    latency,
    model: data.model ?? "",
    detectedLanguage: data.source_language ?? undefined,
  };
}