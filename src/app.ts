import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRouter from "./routes/auth/auth.route";
import "reflect-metadata";

// Create Express app
const app = express();

// Middlewares
app.use(express.json());

// Define routes
app.get("/", (req: Request, res: Response) => {
    return res.send("Welcome to auth service");
});

app.use("/auth", authRouter);

// Define error handling middleware
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error("Error log : ", err.message);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).send({
        errors: [
            {
                type: err.name,
                statusCode: statusCode,
                message: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

// Export the Express app
export default app;
