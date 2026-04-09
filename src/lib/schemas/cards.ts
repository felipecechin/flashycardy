import { z } from "zod";

export const cardIdSchema = z.number().int().positive();
export const deckIdSchema = z.number().int().positive();

export const createCardSchema = z.object({
  front: z.string().min(1, "Front is required").max(500, "Max 500 characters"),
  back: z.string().min(1, "Back is required").max(500, "Max 500 characters"),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;

export const updateCardSchema = z.object({
  front: z.string().min(1, "Front is required").max(500, "Max 500 characters"),
  back: z.string().min(1, "Back is required").max(500, "Max 500 characters"),
});

export type UpdateCardInput = z.infer<typeof updateCardSchema>;

export const generateCardsWithAISchema = z.object({
  deckId: z.number().int().positive(),
  deckName: z.string().min(1).max(100),
  deckDescription: z.string().max(500).nullable(),
});

export type GenerateCardsWithAIInput = z.infer<typeof generateCardsWithAISchema>;
