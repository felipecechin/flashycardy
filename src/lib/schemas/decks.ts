import { z } from "zod";

export const deckSchema = z.object({
  name: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

export const updateDeckSchema = deckSchema;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

export const createDeckSchema = deckSchema;
export type CreateDeckInput = z.infer<typeof createDeckSchema>;
