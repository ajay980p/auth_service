import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { JwtPayload, sign } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Config } from "../config";
import { CredentialService } from "../services/CredentialService";

export class AuthController {
    private userService: UserService;
    private credentialService: CredentialService;
    private logger: Logger;

    constructor(userService: UserService, credentialService: CredentialService, logger: Logger) {
        this.userService = userService;
        this.credentialService = credentialService;
        this.logger = logger;
    }

    async register(req: Request, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }


        const { firstName, lastName, email, password } = req.body;
        this.logger.debug("Registering user : ", { firstName, lastName, email });

        try {
            const user = await this.userService.createUser({ firstName, lastName, email, password });

            // Generating Access Token
            let privateKey: Buffer;
            try {
                privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'));
            } catch (err) {
                const error = createHttpError(500, "Error while reading private key file.");
                next(error);
                return;
            }

            const payLoad: JwtPayload = { userId: user.id };
            const accessToken = sign(payLoad, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });

            // Generating Refresh Token
            const publicKey = fs.readFileSync(path.join(__dirname, '../../certs/public.pem'), "utf-8");
            const refreshToken = sign(payLoad, 'secretKey', {
                algorithm: "HS256",
                expiresIn: "1y",
                issuer: "auth-service",
            });

            // Sending the tokens as cookies
            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
            });

            res.cookie("refreshToken", Config.REFRESH_TOKEN_SECRET_KEY, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 365,
            });

            res.status(201).send("User registered successfully");
        } catch (err) {
            next(err);
        }
    }


    async login(req: Request, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { email, password } = req.body;
        this.logger.debug("Login user : ", { email });




        // Generate Access Token
        // send the token as cookie
        // send the response


        try {
            // Check if email exists in database
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const err = createHttpError(400, "Email or Password doesn't exists");
                next(err);
                return;
            }

            // Check if password matched
            const passwordMatched = await this.credentialService.comparePassword(password, user.password);
            if (!passwordMatched) {
                const err = createHttpError(400, "Email or Password doesn't exists");
                next(err);
                return;
            }

            const user1 = await this.userService.loginUser({ email, password });

            res.status(201).send("User registered successfully");
        } catch (err) {
            next(err);
        }
    }
}
