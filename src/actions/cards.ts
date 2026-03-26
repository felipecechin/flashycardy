"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCard } from "@/db/queries/cards";
import { createCardSchema, type CreateCardInput } from "@/lib/schemas/cards";

export async function createCardAction(deckId: number, data: CreateCardInput) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const parsed = createCardSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const card = await createCard(deckId, userId, parsed.data.front, parsed.data.back);

  revalidatePath(`/decks/${deckId}`);
  return card;
}
