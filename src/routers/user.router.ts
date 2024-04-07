import bcrypt from "bcrypt";
import { Effect, pipe } from "effect";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { authenticateToken } from "@/middlewares/authentication.middleware";

import { comparePasswd, parseLoginData, parseRegisterData } from "@/lib/parsers";

import config from "@/config";
import { createUser, findUserByEmail } from "@/model/user.model";

const router = Router();

router.post("/register", async (req, res) => {
	const task = pipe(
		req.body,
		parseRegisterData,
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
		parseLoginData,
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

router.use(authenticateToken);

router.get("/", async (req, res) => {
	const task = pipe(req.email, findUserByEmail);
	const main = Effect.match(task, {
		onSuccess(user) {
			res.json({ email: user.email, name: user.name });
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

// TODO: should include change password and reset password

export { router as userRouter };
