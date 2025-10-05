import { Languages, Sparkles } from "lucide-react";

export const TranslationHeader = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-50" />
            <div className="relative bg-gradient-primary p-3 rounded-xl">
              <Languages className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Starry Tran
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Translation Intelligence System
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
