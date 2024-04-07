import jwt from "jsonwebtoken";
import type { Handler } from "express";
import config from "@/config";

const authenticateToken = ((req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Unauthorized: Missing token" });
	}

	jwt.verify(token, config.jwtSecret, (err, payload) => {
		if (err) {
			return res.status(403).json({ error: "Forbidden: Invalid token" });
		}

		//@ts-expect-error - using js feature
		req.email = payload?.email;

		next();
	});
}) satisfies Handler;

export { authenticateToken };
