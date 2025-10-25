import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content cannot be empty")
    .max(500, "Message content must be no more than 500 characters"),
});
