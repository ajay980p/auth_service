import { JwtPayload, sign } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { errorHandler } from "../validators/err-creators";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";

export class TokenService {

    constructor(private refreshTokenRepository: Repository<RefreshToken>) { }

    async generateAccessToken(payLoad: JwtPayload) {

        // Generating Access Token
        let privateKey: Buffer;
        try {
            privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'));
        } catch (err) {
            const error = errorHandler(500, "Error while reading private key file.", "key");

            throw error;
        }

        const accessToken = sign(payLoad, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });

        return accessToken;
    }


    async generateRefreshToken(payLoad: JwtPayload) {

        const refreshToken = sign(payLoad, 'secretkey', {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: payLoad.id
        });

        return refreshToken;
    }

    async persistRefreshToken(user: User) {

        const newRefreshToken = await this.refreshTokenRepository.save({ user: user, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), });

        return newRefreshToken;
    }

}