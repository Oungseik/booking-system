import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(20),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
	name: z.string().min(4).max(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const changePwSchema = loginSchema.extend({
	newPassword: z.string().min(8).max(20),
});

export type changePwInput = z.infer<typeof changePwSchema>;
