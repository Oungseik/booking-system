import { type InferSchemaType, model, Schema } from "mongoose";

import { countries } from "./countries";

const classSchema = new Schema({
	id: { type: Schema.Types.ObjectId },
	name: { type: String, required: true },
	duration: { type: String, required: true },
	place: { enum: countries, type: String, required: true, index: true },
	credit: { type: Number, required: true },
});

classSchema.pre("save", function (next) {
	this.id = this._id;
	next();
});

export const Class = model("Class", classSchema);

export type Class = InferSchemaType<typeof classSchema>;

// export const findUserById =
// 	(populate?: string | string[]) =>
// 	(id: Types.ObjectId): Effect.Effect<Class, NotExistError | DatabaseError, never> =>
// 		findOne({ id }, populate);

// const findOne = (
// 	entry: Partial<Pick<Class, "id">>,
// 	populate?: string | string[]
// ): Effect.Effect<Class, NotExistError | DatabaseError, never> =>
// 	Effect.tryPromise({
// 		try: () =>
// 			Class.findOne(entry, {}, { populate })
// 				.lean()
// 				.then((cls) => (cls ? Option.some(cls) : Option.none()))
// 				.then(Option.getOrThrowWith(() => new NotExistError("User not exist"))),
// 		catch: (e) => {
// 			if (e instanceof NotExistError) {
// 				return e;
// 			}
// 			return new DatabaseError("unexpected error occured while find user by email");
// 		},
// 	});
