import bcrypt from "bcrypt";
import { Effect } from "effect";
import { ZodError } from "zod";
import { Types } from "mongoose";

import { AuthenticationError, ParseError } from "./errors";
import {
	type LoginInput,
	loginSchema,
	type RegisterInput,
	registerSchema,
	type changePwInput,
	changePwSchema,
} from "./schemas";

export const parseRegisterInput = (
	data: unknown
): Effect.Effect<RegisterInput, ParseError, never> =>
	Effect.try({
		try: () => registerSchema.parse(data),
		catch: (e) => new ParseError((e as ZodError).message),
	});

export const parseLoginInput = (data: unknown): Effect.Effect<LoginInput, ParseError, never> =>
	Effect.try({
		try: () => loginSchema.parse(data),
		catch: (e) => new ParseError((e as ZodError).message),
	});

export const parseChangePwInput = (
	data: unknown
): Effect.Effect<changePwInput, ParseError, never> =>
	Effect.try({
		try: () => changePwSchema.parse(data),
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
