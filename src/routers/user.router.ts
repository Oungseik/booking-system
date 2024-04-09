import { Effect, pipe } from "effect";
import { Router } from "express";

import { parseId } from "@/lib/parsers";

import { findUserByEmail, findUserById } from "@/model/users.model";

const router = Router();

router.get("/", async (req, res) => {
	const populate = req.query.populate as string | string[];
	const task = pipe(req.email, (email) => findUserByEmail(email, populate));
	const main = Effect.match(task, {
		onSuccess(user) {
			res.json({
				id: user.id,
				email: user.email,
				name: user.name,
				packages: user.packages,
				classes: user.classes,
			});
		},
		onFailure(e) {
			switch (e._tag) {
				case "NotExistError":
					res.status(404).json({ message: e.message });
					break;
				case "DatabaseError":
					res.status(500).json({ message: e.message });
					break;
			}
		},
	});

	Effect.runPromise(main);
});

router.get("/:id", async (req, res) => {
	const populate = req.query.populate as string | string[];
	const task = pipe(
		req.params.id,
		parseId,
		Effect.flatMap((id) => findUserById(id, populate))
	);
	const main = Effect.match(task, {
		onSuccess(user) {
			res.json({
				id: user.id,
				email: user.email,
				name: user.name,
				packages: user.packages,
				classes: user.classes,
			});
		},
		onFailure(e) {
			switch (e._tag) {
				// In the case of the id is invalid, consider as user not exist with that id
				case "ParseError":
				case "NotExistError":
					res.status(404).json({ message: "User does not exist" });
					break;
				case "DatabaseError":
					res.status(500).json({ message: e.message });
					break;
			}
		},
	});

	Effect.runPromise(main);
});

// TODO: should include change password and reset password

export { router as userRouter };
