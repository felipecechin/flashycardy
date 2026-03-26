"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateDeck } from "@/db/queries/decks";
import { updateDeckSchema, type UpdateDeckInput } from "@/lib/schemas/decks";

export async function updateDeckAction(deckId: number, data: UpdateDeckInput) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsed = updateDeckSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const deck = await updateDeck(deckId, userId, {
    name: parsed.data.name,
    description: parsed.data.description,
  });

  revalidatePath(`/decks/${deckId}`);
  revalidatePath("/dashboard");
  return deck;
}
