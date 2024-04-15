import express, { NextFunction, Request, Response } from 'express';

// Create Express app
const app = express();

// Define routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});


app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: err.message,
    });

})

export default app;
