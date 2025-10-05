import { Button } from "@/components/ui/button";
import { MessageCircle, Briefcase, Type } from "lucide-react";

export type ToneType = "friendly" | "formal" | "literal";

interface ToneSelectorProps {
  value: ToneType;
  onChange: (value: ToneType) => void;
}

const tones = [
  { value: "friendly" as ToneType, label: "Friendly", icon: MessageCircle, description: "Casual & warm" },
  { value: "formal" as ToneType, label: "Formal", icon: Briefcase, description: "Professional" },
  { value: "literal" as ToneType, label: "Literal", icon: Type, description: "Word-for-word" },
];

export const ToneSelector = ({ value, onChange }: ToneSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Translation Tone</label>
      <div className="grid grid-cols-3 gap-2">
        {tones.map((tone) => {
          const Icon = tone.icon;
          const isActive = value === tone.value;
          
          return (
            <Button
              key={tone.value}
              variant={isActive ? "default" : "outline"}
              onClick={() => onChange(tone.value)}
              className={`flex flex-col h-auto py-3 px-2 transition-smooth ${
                isActive 
                  ? "bg-gradient-primary shadow-glow border-primary" 
                  : "bg-secondary/30 hover:bg-secondary/50 border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                {tone.label}
              </span>
              <span className={`text-[10px] ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {tone.description}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
