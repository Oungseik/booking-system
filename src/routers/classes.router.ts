import { Router } from "express";
import { classes } from "@/data";

const router = Router();

router.get("/", async (req, res) => {
	const country = req.query.country as string | string[];
	if (typeof country === "string") {
		const result = Object.values(classes).filter((pkg) => pkg.place === country);
		return res.json({ packages: result, total: result.length });
	} else if (Array.isArray(country)) {
		const result = Object.values(classes).filter((pkg) => country.includes(pkg.place));
		return res.json({ packages: result, total: result.length });
	}
	res.json({ classes, total: classes.length });
});

export { router as classesRouter };
