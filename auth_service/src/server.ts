// Import required modules
import express, { Request, Response } from "express";
import { Config } from "./config";
import app from "./app";
import logger from "./config/logger";

// Create Express app
const server = express();

// Use the app middleware
server.use(app);

// Start the server
server.listen(Config.PORT, () => {
    try {
        console.log(`Server is running on port ${Config.PORT}`);
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Error starting server: ${err.message}`);
        }
    }
});
