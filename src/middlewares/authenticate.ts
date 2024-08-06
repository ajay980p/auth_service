import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { TokenService } from '../services/TokenService';
import logger from '../config/logger';

const router = express.Router();

// Define types for AuthRequest and AuthCookie
interface AuthRequest extends Request {
    auth?: any;
}

interface AuthCookie {
    accessToken: string;
}

const tokenService = new TokenService(logger);

// Authentication middleware
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies) {
        token = (req.cookies as AuthCookie).accessToken;
    }

    if (!token) {
        return res.send({ success: false, statusCode: 401, message: "No authorization token was found" });
    }

    try {
        const decoded = await tokenService.verifyAccessToken(token);
        req.auth = decoded as any;
        next();
    } catch (err) {
        return res.send({ success: false, statusCode: 401, message: "Invalid token" });
    }
};
export default router;