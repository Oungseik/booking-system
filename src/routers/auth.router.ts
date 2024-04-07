import { Effect, pipe } from "effect";
import { Router } from "express";

import { parseRegisterData } from "@/lib/parsers";

import { createUser } from "@/model/user.model";

const router = Router();

// router.post("/login", async (req, res) => {});

router.post("/register", async (req, res) => {
	const task = pipe(req.body, parseRegisterData, Effect.flatMap(createUser));

	const main = Effect.match(task, {
		onSuccess: () => {
			return res.json({ status: "success" });
		},
		onFailure: (e) => {
			switch (e._tag) {
				case "ParseError":
					return res.status(400).json({ error: "Invalid inputs", message: e.message });
				case "DuplicateError":
					return res.status(400).json({ error: "Email already in used", message: e.message });
			}
		},
	});

	Effect.runPromise(main);
});

export { router as authRouter };
