import { Effect, Option, pipe } from "effect";
import { Router } from "express";

import { NotExistError } from "@/lib/errors";
import { paymentCharge } from "@/lib/mock";

import { packages } from "@/data";

import { createPackage } from "@/model/packages.model";
import { updateOneByEmail } from "@/model/users.model";

const router = Router();

const getPackage = (pkgs: typeof packages) => (id: string) =>
	Effect.try({
		try: () => Option.fromNullable(pkgs[id]).pipe(Option.getOrThrow),
		catch: () => new NotExistError(),
	});

/** get all available packages */
router.get("/", async (_, res) => {
	res.json({ packages, total: packages.length });
});

router.post("/subscribe/:packageId", (req, res) => {
	const task = pipe(
		req.params.packageId,
		getPackage(packages),
		Effect.tap((pkg) => paymentCharge({ price: pkg.price })),
		Effect.flatMap(createPackage),
		Effect.flatMap((pkg) =>
			updateOneByEmail(req.email, { $push: { packages: [pkg.id!] } }, ["packages"])
		)
	);

	const main = Effect.match(task, {
		onSuccess: (user) => {
			res.json({ status: "success", user });
		},
		onFailure: (e) => {
			switch (e._tag) {
				case "NotExistError":
					return res.status(404).json({ message: e.message });
				case "PaymentError":
				case "DatabaseError":
					return res.status(500).json({ message: e.message });
			}
		},
	});

	Effect.runPromise(main);
});

export { router as packagesRouter };
