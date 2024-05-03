import express, { Request, Response, NextFunction } from "express";
import { Config } from "./config";
import logger from "./config/logger";
// import bodyParser from "body-parser";
import AuthRoute from "./routes/auth";

// Create Express app
const app = express();

// Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

// Define routes
app.use("/auth", AuthRoute);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(Config.PORT, () => {
    console.log(`Server is running on port ${Config.PORT}`);
}).on("error", (err) => {
    logger.error(`Error starting server: ${err.message}`);
});
