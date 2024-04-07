import { type InferSchemaType,model, Schema } from "mongoose";

import { countries } from "./countries";

const plan = ["Basic", "Pro", "Platinum"] as const;

const packageSchema = new Schema(
	{
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
	next();
});

export const Package = model("Package", packageSchema);

export type Package = InferSchemaType<typeof packageSchema>;
