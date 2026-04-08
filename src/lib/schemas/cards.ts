import { z } from "zod";

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
