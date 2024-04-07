import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
	res.json({ message: "Server is up and running!" });
});

export { router as checkhealthRouter };
