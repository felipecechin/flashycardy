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
} from "@/lib/schemas/cards";

export async function createCardAction(deckId: number, data: CreateCardInput) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsed = createCardSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const card = await createCard(deckId, userId, parsed.data.front, parsed.data.back);

  revalidatePath(`/decks/${deckId}`);
  return card;
}

export async function updateCardAction(
  cardId: number,
  deckId: number,
  data: UpdateCardInput
) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsed = updateCardSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const card = await updateCard(cardId, userId, parsed.data);

  revalidatePath(`/decks/${deckId}`);
  return card;
}

export async function deleteCardAction(cardId: number, deckId: number) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  await deleteCard(cardId, userId);

  revalidatePath(`/decks/${deckId}`);
}
