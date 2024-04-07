import cors from "cors";
import express from "express";

import { checkhealthRouter } from "./routers/checkhealth.router";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/health", checkhealthRouter);
app.use("/api/users", userRouter);

export default app;
