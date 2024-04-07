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

router.post("/login", async (req, res) => {
	const task = pipe(
		req.body,
		parseLoginInput,
		Effect.flatMap((body) => Effect.all([Effect.succeed(body), findUserByEmail(body.email)])),
		Effect.tap(([input, user]) => comparePasswd(input.password, user.password))
	);

	const main = Effect.match(task, {
		onSuccess: ([_, user]) => {
			const token = jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: "30d" });
			res.json({ status: "success", token });
		},
		onFailure: (e) => {
			switch (e._tag) {
				case "ParseError":
					return res.status(400).json({ message: e.message });
				case "NotExistError":
					return res.status(404).json({ message: e.message });
				case "AuthenticationError":
					return res.status(404).json({ message: e.message });
				case "DatabaseError":
					return res.status(500).json({ message: e.message });
			}
		},
	});

	Effect.runPromise(main);
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

	const main = Effect.match(task, {
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
					return res.status(400).json({ message: e.message });
				case "NotExistError":
					return res.status(404).json({ message: e.message });
				case "AuthenticationError":
					return res.status(404).json({ message: e.message });
				case "DatabaseError":
					return res.status(500).json({ message: e.message });
			}
		},
	});

	Effect.runPromise(main);
});

export { router as authRouter };
