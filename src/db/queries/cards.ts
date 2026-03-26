import { db } from "@/db";
import { cardsTable, decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createCard(
  deckId: number,
  userId: string,
  front: string,
  back: string
) {
  // Verify the deck belongs to this user before inserting
  const deck = await db.query.decksTable.findFirst({
    where: and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)),
  });
  if (!deck) throw new Error("Deck not found");

  const [card] = await db
    .insert(cardsTable)
    .values({ deckId, front, back })
    .returning();
  return card;
}

export async function updateCard(
  cardId: number,
  userId: string,
  data: { front?: string; back?: string }
) {
  // Verify ownership via the parent deck
  const card = await db.query.cardsTable.findFirst({
    where: eq(cardsTable.id, cardId),
    with: { deck: true },
  });
  if (!card || card.deck.userId !== userId) throw new Error("Card not found");

  const [updated] = await db
    .update(cardsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(cardsTable.id, cardId))
    .returning();
  return updated;
}

export async function deleteCard(cardId: number, userId: string) {
  const card = await db.query.cardsTable.findFirst({
    where: eq(cardsTable.id, cardId),
    with: { deck: true },
  });
  if (!card || card.deck.userId !== userId) throw new Error("Card not found");

  await db.delete(cardsTable).where(eq(cardsTable.id, cardId));
}
