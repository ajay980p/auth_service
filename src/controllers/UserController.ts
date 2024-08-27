import { Logger } from "winston";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { UserService } from "../services/UserService";
import { Request, Response, NextFunction } from "express";

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

        const { firstName, lastName, email, password, role } = req.body as UserData;
        this.logger.info("Registering user through Tenant : ", { firstName, lastName, email, role: role });

        try {
            const user = await this.userService.createUser({ firstName, lastName, email, password, role: role });
            this.logger.info("User created successfully", { firstName, lastName, email, role: role });

            return res.status(201).json({ status: "success", statusCode: 201, message: "User created successfully", user });
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

            return res.status(200).json({ statusCode: 200, message: "User deleted successfully", userId });
        } catch (err) {
            next(err);
            return;
        }
    }


    // To Get All Users Data
    async getAllUserData(req: Request, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array()[0] });
            next(err);
            return;
        }

        const { currentPage, pageSize, search, searchRole } = req.body;
        this.logger.info("Retrieving all user Data : ");

        try {
            const usersData = await this.userService.getAllUserData({ currentPage, pageSize, search, searchRole });
            this.logger.info("User Data fetched successfully", { data: usersData });

            return res.status(200).json({ status: "success", statusCode: 200, message: "User Data fetched successfully", data: usersData });
        } catch (err) {
            next(err);
            return;
        }
    }


    // To Get All Users Data
    async updateUserData(req: Request, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { userId, firstName, lastName, email, role } = req.body;
        this.logger.info("Retrieving all user Data : ");

        try {
            const usersData = await this.userService.updateUserData({ userId, firstName, lastName, email, role });
            this.logger.info("User Data fetched successfully", { data: usersData });

            return res.status(200).json({ status: "success", statusCode: 200, message: "User Data Updated successfully", data: usersData });
        } catch (err) {
            next(err);
            return;
        }
    }


}