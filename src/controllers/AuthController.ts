import { Logger } from "winston";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserService } from "../services/UserService";
import { CredentialService } from "../services/CredentialService";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/TokenService";

interface AuthRequest extends Request {
    auth?: any;
}
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


    // To Register a new User 
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

            return res.json({ statusCode: 201, message: "User created successfully", user });
        } catch (error) {
            next(error);
            return;
        }
    }

    // To implement the login method, add the following code to the AuthController class:
    async login(req: Request, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { email, password } = req.body;
        this.logger.debug("New Request to login a User : ", { email, password: "********" });

        try {
            // To check User exist or not
            let user = await this.userService.loginUser({ email, password });

            // Generating Access Token
            const payload: JwtPayload = { id: user.id }
            const accessToken = await this.tokenService.generateAccessToken(payload);

            // Generating Refresh Token
            const refreshToken = await this.tokenService.generateRefreshToken(payload);

            // Persisting Refresh Token into the Database
            await this.tokenService.persistRefreshToken({ userId: user.id, refreshToken });

            res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

            return res.json({ statusCode: 200, message: "User Login successfully", data: { id: user.id, firsName: user.firstName, lastName: user.lastName, email: user.email, tenantId: user.tenantId, role: user.role } });
        } catch (error) {
            next(error);
            return;
        }
    }


    // To implement the token verification method, add the following code to the AuthController class:
    async self(req: AuthRequest, res: Response, next: NextFunction) {
        const { id } = req.auth;

        try {
            const user = await this.userService.findByUserId(id);
            res.send({ statusCode: 200, message: "User found successfully", data: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, tenantId: user.tenantId, role: user.role } });
        } catch (err) {
            next(err);
            return;
        }
    }


    // To implement the logout method, add the following code to the AuthController class:
    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        const { id } = req.auth;

        this.logger.debug("Request to logout a User : ", { id });

        try {
            const isDeleted = await this.userService.logoutUser(id);
            return res.json({ statusCode: 200, message: "User logout successfully", data: { id: id } });
        } catch (error) {
            next(error);
            return;
        }
    }
}