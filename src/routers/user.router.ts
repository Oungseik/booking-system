import { Effect, pipe } from "effect";
import { Router } from "express";

import { parseId } from "@/lib/parsers";

import { findUserByEmail, findUserById } from "@/model/users.model";

const router = Router();

router.get("/", async (req, res) => {
	const task = pipe(req.email, findUserByEmail);
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
					return res.status(404).json({ message: e.message });
				case "DatabaseError":
					return res.status(500).json({ message: e.message });
			}
		},
	});

	Effect.runPromise(main);
});

router.get("/:id", async (req, res) => {
	const task = pipe(req.params.id, parseId, Effect.flatMap(findUserById));
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
					return res.status(404).json({ message: "User does not exist" });
				case "DatabaseError":
					return res.status(500).json({ message: e.message });
			}
		},
	});

	Effect.runPromise(main);
});

// TODO: should include change password and reset password

export { router as userRouter };
