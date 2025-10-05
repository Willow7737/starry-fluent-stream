import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranslationInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export const TranslationInput = ({ value, onChange, maxLength = 5000 }: TranslationInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Text to Translate</label>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter text to translate..."
          className="min-h-[200px] bg-secondary/50 border-border resize-none focus:border-primary transition-smooth"
          maxLength={maxLength}
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {value.length} / {maxLength}
        </div>
      </div>
    </div>
  );
};
