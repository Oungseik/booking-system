import { Effect, Option } from "effect";
import { type InferSchemaType, model, Schema, Types } from "mongoose";

import { DatabaseError, NotExistError } from "@/lib/errors";

import { countries } from "./countries";

const plan = ["Basic", "Pro", "Platinum"] as const;

const packageSchema = new Schema(
	{
		id: { type: Schema.Types.ObjectId, unique: true },
		uid: { type: String, required: true },
		name: { type: String, required: true },
		country: { enum: countries, type: String, required: true },
		credit: { type: Number, required: true },
		price: { type: Number, required: true },
		expiredDate: { type: Date, required: true },
		plan: { enum: plan, type: String, required: true },
		isExpired: { type: Boolean },
	},
	{
		timestamps: true,
	}
);

packageSchema.pre("save", function (next) {
	this.isExpired = this.expiredDate < new Date();
	this.id = this._id;
	next();
});

export const Package = model("Package", packageSchema);

export type Package = InferSchemaType<typeof packageSchema>;

// --------------------------------------------------
//  Helper functions section
// --------------------------------------------------

export const createPackage = (
	pkg: Partial<Package>
): Effect.Effect<Package, DatabaseError, never> => {
	return Effect.tryPromise({
		try: () => Package.create(pkg),
		catch: () => new DatabaseError("Unexpected error occured while create package"),
	});
};

export const updatePackageById = (
	id: Types.ObjectId,
	update: Record<string, unknown>,
	populate?: string | string[]
): Effect.Effect<Package, DatabaseError | NotExistError, never> => {
	return Effect.tryPromise({
		try: () =>
			Package.findByIdAndUpdate(id, update, { new: true, populate })
				.then((pkg) => (pkg ? Option.some(pkg) : Option.none()))
				.then(Option.getOrThrowWith(() => new NotExistError("No package to update"))),
		catch: (e) =>
			e instanceof NotExistError
				? e
				: new DatabaseError("Unexpected error occured while update package"),
	});
};
