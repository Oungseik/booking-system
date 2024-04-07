import { Effect } from "effect";
import { model,Schema } from "mongoose";

import { DuplicateError } from "@/lib/errors";
import type { User as UserType } from "@/lib/schemas";

const userSchema = new Schema<UserType>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, require: true },
	},
	{ timestamps: true }
);

export const User = model("User", userSchema);

export const createUser = (user: UserType): Effect.Effect<UserType, DuplicateError, never> => {
	return Effect.tryPromise({
		try: () => User.create(user),
		catch: () => new DuplicateError("Email already in used"),
	});
};
