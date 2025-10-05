import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, Trash2, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  tone: string;
  timestamp: Date;
}

interface TranslationHistoryProps {
  history: TranslationHistoryItem[];
  onClear: () => void;
  onSelect: (item: TranslationHistoryItem) => void;
}

export const TranslationHistory = ({ history, onClear, onSelect }: TranslationHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="p-8 bg-card border-border">
        <div className="text-center text-muted-foreground">
          <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No translation history yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Translation History</h3>
          <Badge variant="secondary" className="text-xs">{history.length}</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="divide-y divide-border">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full p-4 text-left hover:bg-secondary/30 transition-smooth"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">
                    {item.sourceLang.toUpperCase()}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">
                    {item.targetLang.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-foreground line-clamp-2">{item.sourceText}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.translatedText}</p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
