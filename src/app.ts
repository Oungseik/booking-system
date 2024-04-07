import cors from "cors";
import express from "express";

import { authenticateToken } from "./middlewares/authentication.middleware";
import { authRouter } from "./routers/auth.router";
import { checkhealthRouter } from "./routers/checkhealth.router";
import { classesRouter } from "./routers/classes.router";
import { packagesRouter } from "./routers/packages.router";
import { userRouter } from "./routers/user.router";

declare global {
	namespace Express {
		interface Request {
			email: string;
		}
	}
}

const app = express();

app.use(express.json());
app.use(cors());

app.use("/health", checkhealthRouter);
app.use("/api/auth", authRouter);

app.use(authenticateToken);
app.use("/api/users", userRouter);
app.use("/api/packages", packagesRouter);
app.use("/api/classes", classesRouter);

export default app;
