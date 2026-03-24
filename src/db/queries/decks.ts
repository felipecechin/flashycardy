import { db } from "@/db";
import { decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getDecksByUser(userId: string) {
  return db.select().from(decksTable).where(eq(decksTable.userId, userId));
}

export async function getDecksByUserWithCards(userId: string) {
  return db.query.decksTable.findMany({
    where: eq(decksTable.userId, userId),
    with: { cards: true },
    orderBy: (decks, { desc }) => [desc(decks.updatedAt)],
  });
}

export async function getDeckWithCards(deckId: number, userId: string) {
  return db.query.decksTable.findFirst({
    where: and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)),
    with: { cards: true },
  });
}

export async function createDeck(
  userId: string,
  name: string,
  description?: string
) {
  const [deck] = await db
    .insert(decksTable)
    .values({ userId, name, description })
    .returning();
  return deck;
}

export async function updateDeck(
  deckId: number,
  userId: string,
  data: { name?: string; description?: string }
) {
  const [deck] = await db
    .update(decksTable)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
    .returning();
  return deck;
}

export async function deleteDeck(deckId: number, userId: string) {
  await db
    .delete(decksTable)
    .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)));
}
