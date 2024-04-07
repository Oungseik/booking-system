import app from "./app";
import config from "./config";
import { logger } from "./lib/logger";
import mongoose from "mongoose";

app.listen(config.port, () => {
	logger.info("server is running on port:", config.port);

	mongoose
		.connect("mongodb://localhost:27017/booking_system")
		.then(() => {
			logger.info("successfully connected to mongodb");
		})
		.catch((e) => {
			logger.error("failed to connect to mongodb");
			logger.error(e);
		});
});
