/**
 * Mongoose model and collection of utility operations to deal with `users` document
 * */

import { Effect, Option } from "effect";
import { model, Schema } from "mongoose";

import { DatabaseError, DuplicateError, NotExistError } from "@/lib/errors";
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

export const findUserByEmail = (email: string) =>
	Effect.tryPromise({
		try: () =>
			User.findOne({ email })
				.then((user) => (user ? Option.some(user) : Option.none()))
				.then(Option.getOrThrowWith(() => new NotExistError("User not exist"))),
		catch: (e) => {
			if (e instanceof NotExistError) {
				return e;
			}
			return new DatabaseError("unexpected error occured while find user by email");
		},
	});
