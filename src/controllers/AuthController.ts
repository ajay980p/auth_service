import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { Logger } from "winston";

export class AuthController {
    private userService: UserService;
    private logger: Logger;

    constructor(userService: UserService, logger: Logger) {
        this.userService = userService;
        this.logger = logger;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        // console.log("Body : ", req.body);
        // const { firstName, lastName, email, password } = req.body;
        // this.logger.debug("Registering user : ", { firstName, lastName, email });

        const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "john430@gmail.com",
            password: "password",
        };

        try {
            // const user = await this.userService.createUser({ firstName, lastName, email, password });
            const user = await this.userService.createUser(userData);
            res.status(201).send("User registered successfully");
        } catch (err) {
            next(err);
        }
    }
}
