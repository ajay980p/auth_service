import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { CredentialService } from "../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { AuthRequest } from "../types";

export class AuthController {
    private userService: UserService;
    private credentialService: CredentialService;
    private logger: Logger;
    private tokenService: TokenService;

    constructor(userService: UserService, credentialService: CredentialService, tokenService: TokenService, logger: Logger) {
        this.userService = userService;
        this.credentialService = credentialService;
        this.logger = logger;
        this.tokenService = tokenService;
    }


    // To Register User
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
            const payLoad: JwtPayload = { id: user.id };
            const accessToken = await this.tokenService.generateAccessToken(payLoad);

            // Persisting the refresh Token in the database
            const newRefreshToken = await this.tokenService.persistRefreshToken(user);
            // Generating Refresh Token
            const refreshToken = await this.tokenService.generateRefreshToken({ ...payLoad, id: String(newRefreshToken.id) });

            // Sending the tokens as cookies
            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 365,
            });

            res.send({ success: true, statusCode: 200, message: "User registered successfully" });
        } catch (err) {
            next(err);
        }
    }


    // Consumer Login
    async login(req: Request, res: Response, next: NextFunction) {

        // Check the validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { email, password } = req.body;
        this.logger.debug("Login user : ", { email });

        try {
            // Check if email exists and password matched
            const user = await this.userService.loginUser({ email, password });

            // Generating Access Token
            const payLoad: JwtPayload = { userId: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
            const accessToken = await this.tokenService.generateAccessToken(payLoad);

            // Sending the tokens as cookies
            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
            });

            res.send({ success: true, statusCode: 200, message: "User Login successfully", data: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
        } catch (err) {
            next(err);
        }
    }


    // To Validate User
    async self(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.findById(req.auth.id);
            if (!user) {
                return res.status(404).send({ success: false, statusCode: 404, message: "User not found" });
            }

            return res.send({
                success: true,
                statusCode: 200,
                message: "User is authenticated",
                user: {
                    id: Number(user.id),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                }
            })
        } catch (err) {
            next(err);
        }
    }


    // To  logout User
    async logout(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (err) {
            next(err);
            return;
        }
    }
}
