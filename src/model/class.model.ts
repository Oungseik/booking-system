import { type InferSchemaType,model, Schema } from "mongoose";

import { countries } from "./countries";

const classSchema = new Schema({
	name: { type: String, required: true },
	duration: { type: String, required: true },
	place: { enum: countries, type: String, required: true, index: true },
	credit: { type: Number, required: true },
});

export const Class = model("Class", classSchema);

export type Class = InferSchemaType<typeof classSchema>;
