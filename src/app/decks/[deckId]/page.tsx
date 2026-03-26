import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getDeckWithCards } from "@/db/queries/decks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard } from "lucide-react";
import { AddCardModal } from "@/components/decks/add-card-modal";
import { EditDeckModal } from "@/components/decks/edit-deck-modal";

interface DeckPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { deckId } = await params;
  const deckIdNum = Number(deckId);
  if (isNaN(deckIdNum)) notFound();

  const deck = await getDeckWithCards(deckIdNum, userId);
  if (!deck) notFound();

  const cardCount = deck.cards.length;

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Back nav */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to decks
        </Link>

        {/* Deck header */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight truncate">
                {deck.name}
              </h1>
              <Badge variant="secondary" className="shrink-0">
                {cardCount} {cardCount === 1 ? "card" : "cards"}
              </Badge>
            </div>
            {deck.description && (
              <p className="mt-2 text-muted-foreground max-w-xl">
                {deck.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <EditDeckModal
              deckId={deck.id}
              currentName={deck.name}
              currentDescription={deck.description}
            />
            <AddCardModal deckId={deck.id} />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Empty state */}
        {cardCount === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <CreditCard className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold">No cards yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first card to start studying this deck.
              </p>
              <AddCardModal deckId={deck.id} variant="empty-state" />
            </CardContent>
          </Card>
        )}

        {/* Cards grid */}
        {cardCount > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deck.cards.map((card) => (
              <Card
                key={card.id}
                className="flex flex-col overflow-hidden transition-colors hover:border-primary/50"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Front
                  </CardTitle>
                  <p className="text-base font-medium leading-snug">
                    {card.front}
                  </p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 flex-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Back
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {card.back}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
