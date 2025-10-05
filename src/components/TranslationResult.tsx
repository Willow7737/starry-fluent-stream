import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TranslationResultProps {
  translation: string;
  confidence: number;
  latency: number;
  model: string;
  sourceLang: string;
  targetLang: string;
}

export const TranslationResult = ({
  translation,
  confidence,
  latency,
  model,
  sourceLang,
  targetLang,
}: TranslationResultProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translation);
    setCopied(true);
    toast.success("Translation copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return "text-accent";
    if (conf >= 0.7) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <Card className="p-6 bg-card border-border space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-medium text-foreground">Translation Result</h3>
            <Badge variant="outline" className="text-xs border-accent/30 text-accent">
              {sourceLang.toUpperCase()} → {targetLang.toUpperCase()}
            </Badge>
          </div>
          <p className="text-lg text-foreground leading-relaxed">{translation}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="shrink-0 hover:bg-accent/10 hover:text-accent hover:border-accent transition-smooth"
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Sparkles className={`h-4 w-4 ${getConfidenceColor(confidence)}`} />
          <span className="text-xs text-muted-foreground">Confidence:</span>
          <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Latency:</span>
          <span className="text-sm font-medium text-foreground">{latency}ms</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-secondary/50">
            {model}
          </Badge>
        </div>
      </div>
    </Card>
  );
};
