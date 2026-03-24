import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDecksByUserWithCards } from "@/db/queries/decks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Layers } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const decks = await getDecksByUserWithCards(userId);

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Decks</h1>
            <p className="mt-1 text-muted-foreground">
              {decks.length === 0
                ? "Get started by creating your first deck."
                : `${decks.length} deck${decks.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <Button className="cursor-pointer gap-2">
            <Plus className="h-4 w-4" />
            New Deck
          </Button>
        </div>

        {/* Empty state */}
        {decks.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Layers className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold">No decks yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a deck to start studying with flashcards.
              </p>
              <Button className="mt-6 cursor-pointer gap-2">
                <Plus className="h-4 w-4" />
                Create your first deck
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Deck grid */}
        {decks.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <Card
                key={deck.id}
                className="group cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-base">
                      {deck.name}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  {deck.description && (
                    <CardDescription className="line-clamp-2 text-sm">
                      {deck.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full cursor-pointer gap-2 text-muted-foreground group-hover:text-foreground"
                  >
                    <BookOpen className="h-4 w-4" />
                    Study
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
