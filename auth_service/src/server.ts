// Import required modules
import express, { Request, Response } from 'express';
import { Config } from './config';
import app from './app';

// Create Express app
const server = express();

// Use the app middleware
server.use(app);

// Start the server
server.listen(Config.PORT, () => {
    console.log(`Server is running on port ${Config.PORT}`);
});
