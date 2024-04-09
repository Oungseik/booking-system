import { Router } from "express";
import { classes } from "@/data";
import { Effect, Option, pipe } from "effect";
import type { Class } from "@/model/classes.model";
import type { Package } from "@/model/packages.model";
import { findUserByEmail, type User } from "@/model/users.model";
import { BookingError, NotExistError } from "@/lib/errors";

const router = Router();

router.get("/", async (req, res) => {
	const country = req.query.country as string | string[];
	if (typeof country === "string") {
		const result = Object.values(classes).filter((pkg) => pkg.place === country);
		return res.json({ packages: result, total: result.length });
	} else if (Array.isArray(country)) {
		const result = Object.values(classes).filter((pkg) => country.includes(pkg.place));
		return res.json({ packages: result, total: result.length });
	}
	res.json({ classes, total: classes.length });
});

const bookTheClass = (
	pkg: Package,
	cls: Class
): Effect.Effect<{ pkg: Package; cls: Class }, BookingError, never> =>
	Effect.suspend(() => {
		return pkg.country !== cls.place
			? Effect.fail(new BookingError(`only allow to book the class from ${pkg.country}`))
			: Effect.succeed({ pkg: { ...pkg, credit: pkg.credit - cls.credit }, cls });
	});

const getClass = (cls: typeof classes) => (id: string) =>
	Effect.try({
		try: () => Option.fromNullable(cls[id]).pipe(Option.getOrThrow),
		catch: () => new NotExistError(),
	});

// get the user
router.post("/book/:id", async (req, res) => {
	const id = req.params.id;
	const cls = getClass(classes)(id);

	const program = pipe(req.email, (email) => findUserByEmail(email, "packages"));

	res.json({
		message: "success",
	});
});

export { router as classesRouter };
