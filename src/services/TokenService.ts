import fs from "fs";
import path from "path";
import { JwtPayload, sign } from "jsonwebtoken";
import { errorHandler } from "../validators/err-creators";
import { Logger } from "winston";
import { db } from "../config/data-source";
import { refreshTokens } from "../models";
import { refreshTokenPayload } from "../types";

export class TokenService {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    // To generate an access token, we need to sign the payload with the private key.
    async generateAccessToken(payLoad: JwtPayload) {
        let privateKey: Buffer;
        try {
            privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'));
        } catch (err) {
            const error = errorHandler(500, "Error while reading private key file.", "key");
            throw error;
        }

        const accessToken = sign(payLoad, privateKey, { algorithm: "RS256", expiresIn: "1h", issuer: "auth-service" });
        return accessToken;
    }


    // To generate a refresh token, we need to sign the payload with a secret key.
    async generateRefreshToken(payLoad: JwtPayload) {
        const refreshToken = sign(payLoad, "privateKey", { algorithm: "HS256", expiresIn: "1y", issuer: "auth-service", jwtid: String(payLoad.id) });
        return refreshToken;
    }


    // To persist the refresh token, we need to store it in the database.
    async persistRefreshToken({ userId, refreshToken }: refreshTokenPayload) {
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
        const newRefreshToken = await db.insert(refreshTokens).values({ userId, refreshToken, expiresAt });
        return newRefreshToken;
    }


}