import { Effect } from "effect";
import { ZodError } from "zod";

import { ParseError } from "./errors";
import { type RegisterData,registerSchema } from "./schemas";

export const parseRegisterData = (data: unknown): Effect.Effect<RegisterData, ParseError, never> =>
	Effect.try({
		try: () => registerSchema.parse(data),
		catch: (e) => new ParseError((e as ZodError).message),
	});
