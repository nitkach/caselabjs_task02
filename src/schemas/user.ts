import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(50),
  email: z.string().trim().email("Invalid email format"),
  age: z.number().int().min(18, "Age must be at least 18").max(99).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
