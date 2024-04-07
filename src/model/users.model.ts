/**
 * Mongoose model and collection of utility operations to deal with `users` document
 * */

import { Effect, Option } from "effect";
import { type InferSchemaType, model, Schema, Types } from "mongoose";

import { DatabaseError, DuplicateError, NotExistError } from "@/lib/errors";

const userSchema = new Schema(
	{
		id: { type: Schema.Types.ObjectId, unique: true },
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		packages: [{ type: Schema.Types.ObjectId, ref: "Package" }],
		classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
	},
	{ timestamps: true }
);

userSchema.pre("save", function (next) {
	this.id = this._id;
	next();
});

export const User = model("User", userSchema);

export type User = InferSchemaType<typeof userSchema>;

export const createUser = (user: Partial<User>): Effect.Effect<User, DuplicateError, never> => {
	return Effect.tryPromise({
		try: () => User.create(user),
		catch: () => new DuplicateError("Email already in used"),
	});
};

export const findUserByEmail = (
	email: string
): Effect.Effect<User, NotExistError | DatabaseError, never> => findOne({ email });

export const findUserById = (
	id: Types.ObjectId
): Effect.Effect<User, NotExistError | DatabaseError, never> => findOne({ id });

const findOne = (
	entry: Partial<Pick<User, "email" | "id">>
): Effect.Effect<User, NotExistError | DatabaseError, never> =>
	Effect.tryPromise({
		try: () =>
			User.findOne(entry)
				.then((user) => (user ? Option.some(user) : Option.none()))
				.then(Option.getOrThrowWith(() => new NotExistError("User not exist"))),
		catch: (e) => {
			if (e instanceof NotExistError) {
				return e;
			}
			return new DatabaseError("unexpected error occured while find user by email");
		},
	});
