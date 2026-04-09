"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCard, updateCard, deleteCard, createManyCards } from "@/db/queries/cards";
import {
  createCardSchema,
  type CreateCardInput,
  updateCardSchema,
  type UpdateCardInput,
} from "@/lib/schemas/cards";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

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

const generatedCardsSchema = z.object({
  cards: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
    })
  ),
});

export async function generateCardsWithAIAction(
  deckId: number,
  deckName: string,
  deckDescription: string | null
) {
  const { userId, has } = await auth();
  if (!userId) redirect("/");

  const canUseAI =
    has({ plan: "pro" }) && has({ feature: "ai_flashcard_generation" });
  if (!canUseAI) throw new Error("Upgrade to Pro to use AI flashcard generation.");

  const { output } = await generateText({
    model: openai("gpt-4o"),
    output: Output.object({ schema: generatedCardsSchema }),
    prompt: `Generate 20 flashcards for the following study deck.

Deck title: ${deckName}
Deck description: ${deckDescription}

Use the deck title and description to infer the most natural card format for this subject. Choose whatever front/back structure will make the cards most useful for studying — the format should fit the content, not the other way around.

Rules:
- One focused idea per card
- Keep both sides concise and direct
- No bullet points or markdown formatting
- Do not include labels like "Front:" or "Back:" in the card content`,
  });

  await createManyCards(deckId, userId, output.cards);

  revalidatePath(`/decks/${deckId}`);
}
