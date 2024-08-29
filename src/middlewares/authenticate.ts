import express, { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService';
import logger from '../config/logger';

const router = express.Router();

// Define types for AuthRequest and AuthCookie
interface AuthRequest extends Request {
    auth?: any;
}

interface AuthCookie {
    accessToken: string;
    refreshToken: string;
}

const tokenService = new TokenService(logger);

// Authentication middleware
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    if (req.cookies) {
        accessToken = (req.cookies as AuthCookie).accessToken;
        refreshToken = (req.cookies as AuthCookie).refreshToken;
    }

    if (!accessToken || !refreshToken) {
        return res.status(401).send({ success: false, statusCode: 401, message: "No authorization token was found" });
    }

    try {
        const decoded = await tokenService.verifyToken(accessToken, refreshToken);
        req.auth = decoded as any;
        next();
    } catch (err) {
        return res.status(401).send({ success: false, statusCode: 401, message: "Invalid token" });
    }
};
export default router;