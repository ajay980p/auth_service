import express, { Request, Response, NextFunction } from "express";
import { Config } from "./config";
import logger from "./config/logger";
// import bodyParser from "body-parser";
import AuthRoute from "./routes/auth";
import cors from "cors";

// Create Express app
const app = express();

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
app.use("/auth", AuthRoute);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    logger.error(`Error: ${err.message}`);

    return res.send({
        type: err.name,
        statusCode: statusCode,
        message: err.message,
        errors: err.errors,
    });
});

// Start the server
app.listen(Config.PORT, () => {
    console.log(`Server is running on port ${Config.PORT}`);
}).on("error", (err) => {
    logger.error(`Error starting server: ${err.message}`);
});
