import fs from "fs";
import path from "path";
import { decode, sign, verify } from "jsonwebtoken";
import { errorHandler } from "../validators/err-creators";
import { Logger } from "winston";
import { db } from "../config/data-source";
import { refreshTokens, users } from "../models";
import { JwtPayload, refreshTokenPayload } from "../types";
import { eq } from "drizzle-orm";
import { Config } from "../config";
import { createJwtPayload } from "../controllers/createJwtPayload";

export class TokenService {
    private logger: Logger;
    private privateKey: Buffer;
    private publicKey: Buffer;

    constructor(logger: Logger) {
        this.logger = logger;
        try {
            this.privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'));
            this.publicKey = fs.readFileSync(path.join(__dirname, '../../certs/public.pem'));
        } catch (err) {
            const error = errorHandler(500, "Error while reading key files.", "key");
            throw error;
        }
    }


    async generateAccessToken(payload: JwtPayload) {
        const accessToken = sign(payload, this.privateKey, { algorithm: "RS256", expiresIn: Config.ACCESS_TOKEN_EXPIRE, issuer: "auth-service" });
        return accessToken;
    }


    async generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, "ILKQmtYNWqkaMSij0bwKmQwbRzIH6ARrDi8e2Xmkrv4", { algorithm: "HS256", expiresIn: Config.REFRESH_TOKEN_EXPIRE, issuer: "auth-service", jwtid: String(payload.id) });
        return refreshToken;
    }


    async persistRefreshToken({ userId, refreshToken }: refreshTokenPayload) {
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
        const existingRefreshToken = await db.select().from(refreshTokens).where(eq(refreshTokens.userId, userId)).limit(1);
        if (existingRefreshToken.length > 0) {
            return await db.update(refreshTokens).set({ refreshToken, expiresAt }).where(eq(refreshTokens.userId, userId));
        } else {
            return await db.insert(refreshTokens).values({ userId, refreshToken, expiresAt });
        }
    }


    async verifyToken(accessTokenFromCookie: string, refreshTokenFromCookie: string) {
        try {
            const decoded = await this.verifyAccessToken(accessTokenFromCookie);
            this.logger.info("Access token verified.");
            return Promise.resolve(decoded as unknown as { accessToken: string, id: number, role: string });
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return this.handleExpiredToken(accessTokenFromCookie, refreshTokenFromCookie);
            } else {
                this.logger.error("Error verifying access token:", error);
                throw error;
            }
        }
    }


    async handleExpiredToken(accessTokenFromCookie: string, refreshTokenFromCookie: string) {
        const decodedExpiredToken = decode(accessTokenFromCookie) as JwtPayload | null;
        if (!decodedExpiredToken?.id) {
            this.logger.info("Expired token is invalid or missing ID.");
            throw new Error('Expired token is invalid or missing ID.');
        }

        const userId = decodedExpiredToken.id;
        this.logger.info("User id matched during decode:", { userId });

        const refreshTokenTable = await db.select().from(refreshTokens).where(eq(refreshTokens.userId, userId));
        this.logger.info("Refresh Token matched");

        if (refreshTokenTable.length > 0 && refreshTokenTable[0].refreshToken === refreshTokenFromCookie) {

            const user = await db.select().from(users).where(eq(users.id, userId));

            const payload = createJwtPayload(user);
            const newAccessToken = await this.generateAccessToken(payload);
            const decodedToken = decode(newAccessToken) as JwtPayload;
            if (!decodedToken?.role) {
                throw new Error('New access token is invalid or missing role.');
            }
            return { id: userId, role: decodedToken.role };
        } else {
            throw new Error('Refresh token does not match or user not found');
        }
    }


    async verifyAccessToken(accessToken: string): Promise<JwtPayload | undefined> {
        return new Promise((resolve, reject) => {
            verify(accessToken, this.publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
                if (err) {
                    this.logger.info("Error verifying access token:", err);
                    return reject(err);
                }
                resolve(decoded as JwtPayload);
            });
        });
    }


    async verifyRefreshToken(token: string) {
        return new Promise((resolve, reject) => {
            verify(token, "ILKQmtYNWqkaMSij0bwKmQwbRzIH6ARrDi8e2Xmkrv4", { algorithms: ["HS256"] }, (err, decoded) => {
                if (err) {
                    // Wrap the error in a new Error object if it's not already one
                    return reject(err instanceof Error ? err : new Error(err as string));
                }
                if (!decoded) {
                    return reject(new Error('Token verification failed: Decoded payload is null or undefined'));
                }
                resolve(decoded);
            });
        });
    }
}