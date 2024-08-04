import { Logger } from "winston";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserService } from "../services/UserService";
import { CredentialService } from "../services/CredentialService";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/TokenService";

export class AuthController {
    private logger: Logger;
    private userService: UserService;
    private tokenService: TokenService;
    private credentialService: CredentialService;

    constructor(user: UserService, credentialService: CredentialService, tokenService: TokenService, logger: Logger) {
        this.userService = user;
        this.credentialService = credentialService;
        this.tokenService = tokenService;
        this.logger = logger;
    }

    async register(req: Request, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { firstName, lastName, email, password, role } = req.body;
        this.logger.debug("Registering user : ", { firstName, lastName, email, role });

        try {
            // Creating a User into the Database
            const user = await this.userService.createUser({ firstName, lastName, email, password, role });

            // Generating Access Token
            const payload: JwtPayload = { id: user.id }
            const accessToken = await this.tokenService.generateAccessToken(payload);

            // Generating Refresh Token
            const refreshToken = await this.tokenService.generateRefreshToken(payload);

            // Persisting Refresh Token into the Database
            await this.tokenService.persistRefreshToken({ userId: user.id, refreshToken });

            res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

            return res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            next(error);
            return;
        }
    }
}
