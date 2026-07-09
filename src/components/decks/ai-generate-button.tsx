"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AIGenerateButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        {/* render as span so there's no button-inside-button nesting */}
        <TooltipTrigger render={<span className="inline-flex" tabIndex={0} />}>
          <Button
            variant="outline"
            className="gap-2 pointer-events-none"
            disabled
          >
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI flashcard generation is disabled in this demo.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
