import bcrypt from "bcrypt";
import { Effect } from "effect";
import { ZodError } from "zod";
import { Types } from "mongoose";

import { AuthenticationError, ParseError } from "./errors";
import { type LoginData, loginSchema, type RegisterData, registerSchema } from "./schemas";

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

export const parseId = (id: string): Effect.Effect<Types.ObjectId, ParseError, never> =>
	Effect.try({
		try: () => new Types.ObjectId(id),
		catch: () => new ParseError("Invalid MongoDB ID"),
	});
