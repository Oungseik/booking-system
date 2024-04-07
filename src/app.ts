import cors from "cors";
import express from "express";

import { authRouter } from "./routers/auth.router";
import { checkhealthRouter } from "./routers/checkhealth.router";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/health", checkhealthRouter);
app.use("/api/auth", authRouter);

export default app;
