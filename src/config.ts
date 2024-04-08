/**
 * Import your all ENVIRONMENTAL VARIABLES here
 */
import dotenv from "dotenv";
dotenv.config();

export const config = {
	port: process.env.PORT || 8080,
	NODE_ENV: process.env.NODE_ENV,
	jwtSecret: process.env.JWT_SECRET || "JWT_SECRET",
	dbUrl: process.env.MONGODB_URL || "mongodb://localhost:27017/booking_system",
};

export default config;
