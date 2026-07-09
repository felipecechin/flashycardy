"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCard, updateCard, deleteCard } from "@/db/queries/cards";
import {
  createCardSchema,
  type CreateCardInput,
  updateCardSchema,
  type UpdateCardInput,
  cardIdSchema,
  deckIdSchema,
} from "@/lib/schemas/cards";

export async function createCardAction(deckId: number, data: CreateCardInput) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsedDeckId = deckIdSchema.safeParse(deckId);
  if (!parsedDeckId.success) throw new Error("Invalid deck ID");

  const parsed = createCardSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const card = await createCard(parsedDeckId.data, userId, parsed.data.front, parsed.data.back);

  revalidatePath(`/decks/${parsedDeckId.data}`);
  return card;
}

export async function updateCardAction(
  cardId: number,
  deckId: number,
  data: UpdateCardInput
) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsedCardId = cardIdSchema.safeParse(cardId);
  if (!parsedCardId.success) throw new Error("Invalid card ID");

  const parsedDeckId = deckIdSchema.safeParse(deckId);
  if (!parsedDeckId.success) throw new Error("Invalid deck ID");

  const parsed = updateCardSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const card = await updateCard(parsedCardId.data, userId, parsed.data);

  revalidatePath(`/decks/${parsedDeckId.data}`);
  return card;
}

export async function deleteCardAction(cardId: number, deckId: number) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsedCardId = cardIdSchema.safeParse(cardId);
  if (!parsedCardId.success) throw new Error("Invalid card ID");

  const parsedDeckId = deckIdSchema.safeParse(deckId);
  if (!parsedDeckId.success) throw new Error("Invalid deck ID");

  await deleteCard(parsedCardId.data, userId);

  revalidatePath(`/decks/${parsedDeckId.data}`);
}

export async function generateCardsWithAIAction() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // AI flashcard generation is disabled for all plans in this deployment (portfolio demo).
  throw new Error("AI flashcard generation is currently disabled.");
}
