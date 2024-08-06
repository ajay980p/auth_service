import fs from "fs";
import path from "path";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { errorHandler } from "../validators/err-creators";
import { Logger } from "winston";
import { db } from "../config/data-source";
import { refreshTokens } from "../models";
import { refreshTokenPayload } from "../types";
import { eq } from "drizzle-orm";

export class TokenService {
    private logger: Logger;
    private privateKey: Buffer;
    // private publicKey: Buffer;

    constructor(logger: Logger) {
        this.logger = logger;
        try {
            this.privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'));
            // this.publicKey = fs.readFileSync(path.join(__dirname, '../../certs/public.pem'));
        } catch (err) {
            const error = errorHandler(500, "Error while reading key files.", "key");
            throw error;
        }
    }

    async generateAccessToken(payload: JwtPayload) {
        const accessToken = sign(payload, this.privateKey, { algorithm: "RS256", expiresIn: "20sec", issuer: "auth-service" });
        return accessToken;
    }

    async generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, "privateKey", { algorithm: "HS256", expiresIn: "1y", issuer: "auth-service", jwtid: String(payload.id) });
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

    async verifyAccessToken(token: string) {
        return new Promise((resolve, reject) => {
            verify(token, this.privateKey, { algorithms: ["RS256"] }, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }

    async verifyRefreshToken(token: string) {
        return new Promise((resolve, reject) => {
            verify(token, "privateKey", { algorithms: ["HS256"] }, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }
}