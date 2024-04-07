import app from "./app";
import config from "./config";
import { logger } from "./lib/logger";

app.listen(config.port, () => {
	logger.info("server is running on port:", config.port);
});
