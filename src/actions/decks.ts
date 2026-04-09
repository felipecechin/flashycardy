"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createDeck, updateDeck, deleteDeck, getDecksByUser } from "@/db/queries/decks";
import {
  createDeckSchema,
  type CreateDeckInput,
  updateDeckSchema,
  type UpdateDeckInput,
  deckIdSchema,
} from "@/lib/schemas/decks";

export async function createDeckAction(data: CreateDeckInput) {
  const { userId, has } = await auth();
  if (!userId) redirect("/");

  const parsed = createDeckSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  if (has({ feature: "3_deck_limit" })) {
    const existingDecks = await getDecksByUser(userId);
    if (existingDecks.length >= 3) {
      throw new Error("DECK_LIMIT_REACHED");
    }
  }

  const deck = await createDeck(userId, parsed.data.name, parsed.data.description);

  revalidatePath("/dashboard");
  return deck;
}

export async function deleteDeckAction(deckId: number) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsedId = deckIdSchema.safeParse(deckId);
  if (!parsedId.success) throw new Error("Invalid deck ID");

  await deleteDeck(parsedId.data, userId);

  revalidatePath("/dashboard");
}

export async function updateDeckAction(deckId: number, data: UpdateDeckInput) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsedId = deckIdSchema.safeParse(deckId);
  if (!parsedId.success) throw new Error("Invalid deck ID");

  const parsed = updateDeckSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const deck = await updateDeck(parsedId.data, userId, {
    name: parsed.data.name,
    description: parsed.data.description,
  });

  revalidatePath(`/decks/${parsedId.data}`);
  revalidatePath("/dashboard");
  return deck;
}
