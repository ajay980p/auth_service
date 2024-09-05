import express, { Request, Response, NextFunction } from "express";
import { Config } from "../src/config";
import logger from "../src/config/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "../src/config/data-source";
import { drizzle } from 'drizzle-orm/postgres-js';
import Api from "../src/routes/api.route";

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


app.get('/', (req, res) => {
    res.send('Hello World!');
});



// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    logger.error(`Error: ${err.message}`);

    return res.status(statusCode).send({
        success: false,
        statusCode: statusCode,
        // type: err.name,
        message: err.message,
        errors: err.errors,
    });
});


const startServer = () => {
    try {
        app.listen(8080, async () => {
            await drizzle(connection); // Initialize database connection
            logger.info("Database connected successfully");
            logger.info(`Server is running on port 8080`);
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Error starting server: ${err.message}`);
        } else {
            logger.error(`Unknown error starting server: ${String(err)}`);
        }
    }
};

startServer();