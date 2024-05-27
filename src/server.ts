import express, { Request, Response, NextFunction } from "express";
import { Config } from "./config";
import logger from "./config/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./config/data-source";
import Api from "./routes/api"

// Create Express app
const app = express();

// Adding cookie parser middleware
app.use(cookieParser());

// Adding Cors middleware
app.use(cors({
    origin: Config.CORS_ORIGIN,
    credentials: true
}))

// Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

// Define routes
app.use("/api", Api);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    logger.error(`Error: ${err.message}`);

    return res.send({
        success: false,
        statusCode: statusCode,
        // type: err.name,
        message: err.message,
        errors: err.errors,
    });
});


const startServer = () => {
    try {
        app.listen(Config.PORT, () => {
            AppDataSource.initialize();  // To make connection with database
            logger.info("Database connected successfully");
            logger.info(`Server is running on port ${Config.PORT}`);
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Error starting server: ${err.message}`);
        } else {
            logger.error(`Unknown error starting server: ${String(err)}`);
        }
    }
};

void startServer();