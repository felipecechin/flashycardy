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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Layers, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { CreateDeckModal } from "@/components/decks/create-deck-modal";

export default async function DashboardPage() {
  const { userId, has } = await auth();
  if (!userId) redirect("/");
  const decks = await getDecksByUserWithCards(userId);
  const isFreePlan = has({ feature: "3_deck_limit" });
  const atDeckLimit = isFreePlan && decks.length >= 3;

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
          <CreateDeckModal deckCount={decks.length} />
        </div>

        {/* Free plan usage alert */}
        {isFreePlan && (
          <Alert variant={atDeckLimit ? "destructive" : "default"} className="mb-6">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>
              {atDeckLimit ? "Deck limit reached" : "Free plan"}
            </AlertTitle>
            <AlertDescription>
              {atDeckLimit ? (
                <>
                  You&apos;ve used all 3 decks on the free plan.{" "}
                  <Link href="/pricing" className="font-medium underline underline-offset-4">
                    Upgrade to Pro
                  </Link>{" "}
                  for unlimited decks.
                </>
              ) : (
                <>
                  {decks.length} / 3 decks used.{" "}
                  <Link href="/pricing" className="font-medium underline underline-offset-4">
                    Upgrade to Pro
                  </Link>{" "}
                  for unlimited decks.
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state */}
        {decks.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Layers className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold">No decks yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a deck to start studying with flashcards.
              </p>
              <CreateDeckModal
                deckCount={decks.length}
                trigger={
                  <Button className="mt-6 cursor-pointer gap-2">
                    <Plus className="h-4 w-4" />
                    Create your first deck
                  </Button>
                }
              />
            </CardContent>
          </Card>
        )}

        {/* Deck grid */}
        {decks.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <Link
                key={deck.id}
                href={`/decks/${deck.id}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-lg"
                tabIndex={0}
              >
                <Card className="w-full h-full cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-1 text-base">
                      {deck.name}
                    </CardTitle>
                    {deck.description && (
                      <CardDescription className="line-clamp-2 text-sm">
                        {deck.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Updated{" "}
                      {new Date(deck.updatedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
