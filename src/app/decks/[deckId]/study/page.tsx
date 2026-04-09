import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDeckWithCards } from "@/db/queries/decks";
import { ArrowLeft, CreditCard } from "lucide-react";
import { StudySession } from "@/components/decks/study-session";

interface StudyPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { userId } = await auth();
  const { deckId } = await params;
  const deckIdNum = Number(deckId);
  if (isNaN(deckIdNum)) notFound();

  const deck = await getDeckWithCards(deckIdNum, userId!);
  if (!deck) notFound();

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Back nav */}
        <Link
          href={`/decks/${deckId}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to deck
        </Link>

        {/* Header */}
        <div className="mt-4 mb-10">
          <h1 className="text-3xl font-bold tracking-tight">{deck.name}</h1>
          {deck.description && (
            <p className="mt-1 text-muted-foreground">{deck.description}</p>
          )}
        </div>

        {/* Empty state */}
        {deck.cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <CreditCard className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold">No cards to study</h2>
            <p className="text-sm text-muted-foreground">
              Add some cards to this deck before starting a study session.
            </p>
            <Link
              href={`/decks/${deckId}`}
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium transition-all hover:bg-muted"
            >
              Go to deck
            </Link>
          </div>
        )}

        {/* Study session */}
        {deck.cards.length > 0 && (
          <StudySession
            deckId={deckIdNum}
            deckName={deck.name}
            cards={deck.cards.map((c) => ({
              id: c.id,
              front: c.front,
              back: c.back,
            }))}
          />
        )}
      </div>
    </main>
  );
}
