import { ToneType } from "@/components/ToneSelector";

// Mock translation engine for demo purposes
export const mockTranslate = async (
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
}> => {
  // Simulate API latency
  const startTime = Date.now();
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  const latency = Date.now() - startTime;

  // Mock language detection
  const detectedLanguage = sourceLang === "auto" ? "en" : sourceLang;

  // Mock translations based on tone
  const getTonePrefix = (tone: ToneType) => {
    switch (tone) {
      case "formal":
        return "[Professional tone] ";
      case "friendly":
        return "[Casual tone] ";
      case "literal":
        return "[Word-for-word] ";
    }
  };

  // Simple mock translation (in production, this would call the actual translation API)
  const mockTranslations: Record<string, Record<string, string>> = {
    en: {
      es: "Esta es una traducción simulada al español.",
      fr: "Ceci est une traduction simulée en français.",
      de: "Dies ist eine simulierte Übersetzung ins Deutsche.",
      ja: "これは日本語へのモック翻訳です。",
      zh: "这是一个模拟翻译成中文。",
    },
  };

  const baseLang = detectedLanguage === "auto" ? "en" : detectedLanguage;
  const translations = mockTranslations[baseLang];
  const translation = translations?.[targetLang] || `${getTonePrefix(tone)}${text}`;

  // Mock confidence score (higher for common language pairs)
  const confidence = 0.85 + Math.random() * 0.14;

  // Mock model selection
  const models = ["Hugging Face M2M100", "DeepL", "Google Translate", "Gemini Translate"];
  const model = models[Math.floor(Math.random() * models.length)];

  return {
    translation,
    confidence,
    latency,
    model,
    detectedLanguage: sourceLang === "auto" ? detectedLanguage : undefined,
  };
};
