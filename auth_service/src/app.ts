import express, { NextFunction, Request, Response } from 'express';
import logger from "./config/logger";

// Create Express app
const app = express();

// Define routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Define error handling middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {

    try {
        throw new Error("Something went wrong");
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error("Error log : ", error.message);
        }
    }
});

// Export the Express app
export default app;