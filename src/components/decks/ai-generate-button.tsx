"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateCardsWithAIAction } from "@/actions/cards";

interface AIGenerateButtonProps {
  canUseAI: boolean;
  deckId: number;
  deckName: string;
  deckDescription: string | null;
}

export function AIGenerateButton({
  canUseAI,
  deckId,
  deckName,
  deckDescription,
}: AIGenerateButtonProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const hasDescription = !!deckDescription?.trim();

  async function handleGenerate() {
    if (!canUseAI) {
      router.push("/pricing");
      return;
    }

    setIsGenerating(true);
    try {
      await generateCardsWithAIAction(deckId, deckName, deckDescription);
      toast.success("20 cards generated successfully!");
    } catch {
      toast.error("Failed to generate cards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  // Missing description — disabled button with tooltip regardless of plan
  if (!hasDescription) {
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
            <p>Add a deck description to enable AI card generation.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Has description and AI access — functional button, no tooltip needed
  if (canUseAI) {
    return (
      <Button
        variant="outline"
        className="cursor-pointer gap-2"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {isGenerating ? "Generating…" : "Generate with AI"}
      </Button>
    );
  }

  // Has description but no AI access — tooltip explains it's a Pro feature
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<span className="inline-flex" />}>
          <Button
            variant="outline"
            className="cursor-pointer gap-2"
            onClick={handleGenerate}
          >
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a Pro feature. Click to upgrade.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
