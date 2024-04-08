import mongoose from "mongoose";

import app from "./app";
import config from "./config";
import { logger } from "./lib/logger";

app.listen(config.port, () => {
	logger.info("server is running on port:", config.port);

	mongoose
		.connect(config.dbUrl)
		.then(() => {
			logger.info("successfully connected to mongodb");
		})
		.catch((e) => {
			logger.error("failed to connect to mongodb");
			logger.error(e);
		});
});
