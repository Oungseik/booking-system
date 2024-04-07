import { z } from "zod";

export const registerSchema = z.object({
	name: z.string().min(4).max(20),
	email: z.string().email(),
	password: z.string().min(8).max(20),
});

export type RegisterData = z.infer<typeof userSchema>;

export const userSchema = registerSchema;

export type User = z.infer<typeof userSchema>;
