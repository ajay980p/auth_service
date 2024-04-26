import express, { NextFunction, Request, Response } from 'express';
import logger from "./config/logger";
import { HttpError } from "http-errors";

// Create Express app
const app = express();

// Define routes
app.get('/', (req: Request, res: Response) => {
    return res.send("Welcome to auth service");
});

// Define error handling middleware
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {

    logger.error("Error log : ", err.message);

    const statusCode = err.statusCodev || 500;

    return res.status(statusCode).send({
        errors: [
            {
                type: err.name,
                message: err.message,
                path: "",
                location: ""
            }
        ]
    });
});

// Export the Express app
export default app;