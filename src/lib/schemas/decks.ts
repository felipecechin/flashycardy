import { z } from "zod";

export const updateDeckSchema = z.object({
  name: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
