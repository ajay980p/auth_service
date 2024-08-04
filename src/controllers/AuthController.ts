import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { CredentialService } from "../services/CredentialService";


export class AuthController {
    private logger: Logger;
    private userService: UserService;
    private credentialService: CredentialService;

    constructor(user: UserService, credentialService: CredentialService, logger: Logger) {
        this.userService = user;
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

        const { firstName, lastName, email, password, role } = req.body;
        this.logger.debug("Registering user : ", { firstName, lastName, email, role });

        try {
            // Creating a User into the Database
            const user = await this.userService.createUser({ firstName, lastName, email, password, role });
            return res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            next(error);
        }
    }
}
