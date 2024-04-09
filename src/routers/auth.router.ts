import bcrypt from "bcrypt";
import { Effect, pipe } from "effect";
import { Router } from "express";
import jwt from "jsonwebtoken";

import {
	comparePasswd,
	parseChangePwInput,
	parseLoginInput,
	parseRegisterInput,
} from "@/lib/parsers";

import config from "@/config";
import { createUser, findUserByEmail, updateOneByEmail } from "@/model/users.model";

const router = Router();

router.post("/register", async (req, res) => {
	const task = pipe(
		req.body,
		parseRegisterInput,
		Effect.flatMap((user) => createUser({ ...user, password: bcrypt.hashSync(user.password, 10) }))
	);

	const handler = Effect.match(task, {
		onSuccess: () => {
			res.json({ status: "success" });
		},
		onFailure: (e) => {
			switch (e._tag) {
				case "ParseError":
					res.status(400).json({ error: "Invalid inputs", message: e.message });
					break;
				case "DuplicateError":
					res.status(400).json({ error: "Email already in used", message: e.message });
					break;
			}
		},
	});

	Effect.runPromise(handler);
});

router.post("/login", async (req, res) => {
	const task = pipe(
		req.body,
		parseLoginInput,
		Effect.flatMap((body) => Effect.all([Effect.succeed(body), findUserByEmail(body.email)])),
		Effect.tap(([input, user]) => comparePasswd(input.password, user.password)),
		Effect.map(([_, user]) =>
			jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: "30d" })
		)
	);

	const handler = Effect.match(task, {
		onSuccess: (token) => {
			res.json({ status: "success", token });
		},
		onFailure: (e) => {
			switch (e._tag) {
				case "ParseError":
					res.status(400).json({ message: e.message });
					break;
				case "NotExistError":
					res.status(404).json({ message: e.message });
					break;
				case "AuthenticationError":
					res.status(404).json({ message: e.message });
					break;
				case "DatabaseError":
					res.status(500).json({ message: e.message });
					break;
			}
		},
	});

	Effect.runPromise(handler);
});

router.post("/change-password", async (req, res) => {
	const task = pipe(
		req.body,
		parseChangePwInput,
		Effect.flatMap((input) => Effect.all([Effect.succeed(input), findUserByEmail(input.email)])),
		Effect.tap(([input, user]) => comparePasswd(input.password, user.password)),
		Effect.flatMap(([input]) =>
			updateOneByEmail(input.email, { password: bcrypt.hashSync(input.newPassword, 10) })
		)
	);

	const handler = Effect.match(task, {
		onSuccess: (user) => {
			res.json({
				id: user.id,
				email: user.email,
				name: user.name,
				packages: user.packages,
				classes: user.classes,
			});
		},
		onFailure: (e) => {
			switch (e._tag) {
				case "ParseError":
					res.status(400).json({ message: e.message });
					break;
				case "NotExistError":
					res.status(404).json({ message: e.message });
					break;
				case "AuthenticationError":
					res.status(404).json({ message: e.message });
					break;
				case "DatabaseError":
					res.status(500).json({ message: e.message });
					break;
			}
		},
	});

	Effect.runPromise(handler);
});

export { router as authRouter };
