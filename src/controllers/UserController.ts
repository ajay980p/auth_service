import { Logger } from "winston";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { UserService } from "../services/UserService";
import { Request, Response, NextFunction } from "express";
import { Roles } from "../constants/constant";

export class UserController {
    private logger: Logger;
    private userService: UserService;

    constructor(logger: Logger, userService: UserService) {
        this.logger = logger;
        this.userService = userService;
    }

    async createUser(req: Request, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { firstName, lastName, email, password } = req.body as UserData;
        this.logger.info("Registering user through Tenant : ", { firstName, lastName, email, role: Roles.CONSUMER });

        try {
            const user = await this.userService.createUser({ firstName, lastName, email, password, role: Roles.CONSUMER });
            this.logger.info("User created successfully", { firstName, lastName, email, role: Roles.CONSUMER });

            return res.json({ statusCode: 201, message: "User created successfully", user });
        } catch (err) {
            next(err);
            return;
        }
    }


    // To delete a specific user
    async deleteUserById(req: Request, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { userId } = req.body;
        this.logger.info("Deleting user : ", { userId });

        try {
            await this.userService.deleteUser(userId);
            this.logger.info("User deleted successfully", { userId });

            return res.json({ statusCode: 200, message: "User deleted successfully", userId });
        } catch (err) {
            next(err);
            return;
        }
    }


}