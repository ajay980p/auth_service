import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";

export class AuthController {
    private userService: UserService;
    private logger: Logger;

    constructor(userService: UserService, logger: Logger) {
        this.userService = userService;
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
            res.status(201).send("User registered successfully");
        } catch (err) {
            next(err);
        }
    }
}
