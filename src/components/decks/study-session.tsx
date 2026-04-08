"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  RefreshCw,
} from "lucide-react";

interface StudyCard {
  id: number;
  front: string;
  back: string;
}

interface StudySessionProps {
  deckId: number;
  deckName: string;
  cards: StudyCard[];
}

type CardResult = "correct" | "incorrect";
type Results = Record<number, CardResult>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function StudySession({ deckId, deckName, cards }: StudySessionProps) {
  const [deck, setDeck] = useState<StudyCard[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDeck(shuffle(cards));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<Results>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = deck[currentIndex];
  const gradedCount = Object.keys(results).length;
  const progress = (gradedCount / deck.length) * 100;
  const correctCount = Object.values(results).filter((r) => r === "correct").length;
  const incorrectCount = Object.values(results).filter((r) => r === "incorrect").length;

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= deck.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, deck.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleResult = useCallback(
    (result: CardResult) => {
      setResults((prev) => ({ ...prev, [currentIndex]: result }));
      handleNext();
    },
    [currentIndex, handleNext]
  );

  const handleRestart = useCallback(() => {
    setDeck(shuffle(cards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({});
    setIsComplete(false);
  }, [cards]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " ") { e.preventDefault(); handleFlip(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); handlePrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); handleNext(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleFlip, handlePrev, handleNext]);

  const handleRestartWrong = useCallback(() => {
    const wrongCards = deck.filter((_, i) => results[i] === "incorrect");
    setDeck(shuffle(wrongCards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({});
    setIsComplete(false);
  }, [deck, results]);

  if (isComplete) {
    const pct = Math.round((correctCount / deck.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-primary/10 p-5">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Session Complete!</h2>
          <p className="text-muted-foreground text-lg">
            You reviewed all {deck.length} cards in{" "}
            <span className="font-medium text-foreground">{deckName}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
          <div className="flex flex-col items-center gap-1 rounded-xl border bg-card p-4">
            <span className="text-3xl font-bold text-green-500">{correctCount}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Correct
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border bg-card p-4">
            <span className="text-3xl font-bold">{pct}%</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Score
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border bg-card p-4">
            <span className="text-3xl font-bold text-red-500">{incorrectCount}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Missed
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Button onClick={handleRestart} className="flex-1 gap-2">
            <RefreshCw className="h-4 w-4" />
            Study Again
          </Button>
          {incorrectCount > 0 && (
            <Button
              variant="outline"
              onClick={handleRestartWrong}
              className="flex-1 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Missed ({incorrectCount})
            </Button>
          )}
        </div>

        <Link
          href={`/decks/${deckId}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to deck
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex items-center gap-4">
        <Progress value={progress} className="flex-1 h-2" />
        <Badge variant="secondary" className="shrink-0 tabular-nums">
          {currentIndex + 1} / {deck.length}
        </Badge>
      </div>

      {/* Score counters */}
      <div className="flex items-center gap-3 mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-1.5 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          {correctCount}
        </div>
        <div className="flex-1 text-center text-xs text-muted-foreground">
          running score
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-500">
          {incorrectCount}
          <XCircle className="h-4 w-4" />
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="relative mx-auto w-full max-w-2xl cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "320px",
          }}
        >
          {/* Front */}
          <Card
            className="absolute inset-0 flex items-center justify-center p-8 select-none border-2"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardContent className="p-0 text-center w-full">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Front
              </p>
              <p className="text-2xl font-semibold leading-snug">{currentCard.front}</p>
              <p className="mt-8 text-xs text-muted-foreground">Click to reveal answer</p>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className="absolute inset-0 flex items-center justify-center p-8 select-none border-2 border-primary/40"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CardContent className="p-0 text-center w-full">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Back
              </p>
              <p className="text-2xl font-semibold leading-snug">{currentCard.back}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-3">
        {!isFlipped ? (
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              className="gap-1.5"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              Prev
            </Button>
            <Button size="lg" className="flex-1 gap-2" onClick={handleFlip}>
              <RotateCcw className="h-4 w-4" />
              Flip Card
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-1.5"
              onClick={handleNext}
            >
              {currentIndex + 1 >= deck.length ? "Finish" : "Skip"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              className="gap-1.5"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              Prev
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
              onClick={() => handleResult("incorrect")}
            >
              <XCircle className="h-5 w-5" />
              Didn&apos;t Know
            </Button>
            <Button
              size="lg"
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleResult("correct")}
            >
              <CheckCircle2 className="h-5 w-5" />
              Got It
            </Button>
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-muted-foreground">
        {isFlipped
          ? "How well did you know this card?"
          : "Click the card or button to flip it"}
      </p>
    </div>
  );
}
