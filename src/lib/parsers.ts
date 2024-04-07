import bcrypt from "bcrypt";
import { Effect } from "effect";
import { ZodError } from "zod";

import { AuthenticationError,ParseError } from "./errors";
import { type LoginData, loginSchema,type RegisterData, registerSchema } from "./schemas";

export const parseRegisterData = (data: unknown): Effect.Effect<RegisterData, ParseError, never> =>
	Effect.try({
		try: () => registerSchema.parse(data),
		catch: (e) => new ParseError((e as ZodError).message),
	});

export const parseLoginData = (data: unknown): Effect.Effect<LoginData, ParseError, never> =>
	Effect.try({
		try: () => loginSchema.parse(data),
		catch: (e) => new ParseError((e as ZodError).message),
	});

export const comparePasswd = (passwd: string, encrypted: string) =>
	Effect.suspend(() =>
		bcrypt.compareSync(passwd, encrypted)
			? Effect.succeed(passwd)
			: Effect.fail(new AuthenticationError("Password not correct"))
	);
