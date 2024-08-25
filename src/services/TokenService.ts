import fs from "fs";
import path from "path";
import { decode, JwtPayload, sign, verify } from "jsonwebtoken";
import { errorHandler } from "../validators/err-creators";
import { Logger } from "winston";
import { db } from "../config/data-source";
import { refreshTokens } from "../models";
import { refreshTokenPayload } from "../types";
import { eq } from "drizzle-orm";
import { Config } from "../config";

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
        const accessToken = sign(payload, this.privateKey, { algorithm: "RS256", expiresIn: Config.ACCESS_TOKEN_EXPIRE, issuer: "auth-service" });
        return accessToken;
    }

    async generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, "privateKey", { algorithm: "HS256", expiresIn: Config.REFRESH_TOKEN_EXPIRE, issuer: "auth-service", jwtid: String(payload.id) });
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

    async verifyAccessToken(accessTokenFromCookie: string, refreshTokenFromCookie: string) {
        return new Promise(async (resolve, reject) => {
            verify(accessTokenFromCookie, this.privateKey, { algorithms: ["RS256"] }, async (err, decoded) => {
                if (err && err.name === 'TokenExpiredError') {
                    // Decode the expired token to get the user ID
                    const decodedExpiredToken = decode(accessTokenFromCookie) as { id: number };
                    const userId = decodedExpiredToken.id;
                    this.logger.info("User id matched during decode : ", { userId })

                    try {
                        // Fetch the refresh token from the database using the user ID
                        const refreshTokenTable = await db.select().from(refreshTokens).where(eq(refreshTokens.userId, userId));
                        this.logger.info("Refresh Token matched ")


                        if (refreshTokenTable && refreshTokenTable[0].refreshToken === refreshTokenFromCookie) {
                            // Generate a new access token
                            const newAccessToken = await this.generateAccessToken({ id: userId });

                            return resolve({ accessToken: newAccessToken, id: userId });
                        } else {
                            this.logger.info("Refresh token does not match or user not found");
                            return reject(new Error('Refresh token does not match or user not found'));
                        }
                    } catch (err) {
                        this.logger.info("Error getting while verifying the token")
                        return reject(err);
                    }
                } else if (err) {
                    this.logger.info("Token not found.")
                    return reject(err);
                } else {
                    this.logger.info("Access token verified.")
                    resolve(decoded);
                }
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