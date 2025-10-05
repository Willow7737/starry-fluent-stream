import { useState } from "react";
import { TranslationHeader } from "@/components/TranslationHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ToneSelector, ToneType } from "@/components/ToneSelector";
import { TranslationInput } from "@/components/TranslationInput";
import { TranslationResult } from "@/components/TranslationResult";
import { TranslationHistory, TranslationHistoryItem } from "@/components/TranslationHistory";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { mockTranslate } from "@/lib/mockTranslation";
import { toast } from "sonner";

const Index = () => {
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("es");
  const [tone, setTone] = useState<ToneType>("friendly");
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState<{
    translation: string;
    confidence: number;
    latency: number;
    model: string;
  } | null>(null);
  
  const [history, setHistory] = useState<TranslationHistoryItem[]>(() => {
    const saved = localStorage.getItem("translation-history");
    return saved ? JSON.parse(saved) : [];
  });

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    setIsTranslating(true);
    
    try {
      const result = await mockTranslate(sourceText, sourceLang, targetLang, tone);
      setResult(result);

      // Add to history
      const newItem: TranslationHistoryItem = {
        id: Date.now().toString(),
        sourceText,
        translatedText: result.translation,
        sourceLang: result.detectedLanguage || sourceLang,
        targetLang,
        tone,
        timestamp: new Date(),
      };

      const updatedHistory = [newItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem("translation-history", JSON.stringify(updatedHistory));

      toast.success("Translation complete!");
    } catch (error) {
      toast.error("Translation failed. Please try again.");
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("translation-history");
    toast.success("History cleared");
  };

  const handleSelectHistory = (item: TranslationHistoryItem) => {
    setSourceText(item.sourceText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setTone(item.tone as ToneType);
    toast.success("Translation loaded from history");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <TranslationHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Translation Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language Selectors */}
            <div className="grid md:grid-cols-2 gap-4">
              <LanguageSelector
                value={sourceLang}
                onChange={setSourceLang}
                label="Source Language"
              />
              <LanguageSelector
                value={targetLang}
                onChange={setTargetLang}
                label="Target Language"
                excludeAuto
              />
            </div>

            {/* Tone Selector */}
            <ToneSelector value={tone} onChange={setTone} />

            {/* Text Input */}
            <TranslationInput value={sourceText} onChange={setSourceText} />

            {/* Translate Button */}
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText.trim()}
              className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-glow transition-smooth"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  Translate
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {/* Result */}
            {result && (
              <TranslationResult
                translation={result.translation}
                confidence={result.confidence}
                latency={result.latency}
                model={result.model}
                sourceLang={sourceLang === "auto" ? "en" : sourceLang}
                targetLang={targetLang}
              />
            )}
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <TranslationHistory
              history={history}
              onClear={handleClearHistory}
              onSelect={handleSelectHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
