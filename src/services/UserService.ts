import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import { Logger } from "winston";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
const saltRounds = 10;

export class UserService {
    private userRepository: Repository<User>;
    private logger: Logger;

    constructor(userRepository: Repository<User>, logger: Logger) {
        this.userRepository = userRepository;
        this.logger = logger;
    }

    async createUser({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({ where: { email: email } });

        if (user) {
            const err = createHttpError(400, "Email already exists");
            throw err;
        }

        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hashPassword = await bcrypt.hash(password, salt);

            const user = await this.userRepository.save({ firstName, lastName, email, password: hashPassword });
            this.logger.info("User created successfully", { id: user.id });
            return user;
        } catch (err) {
            this.logger.error("Error while creating user : ");
            throw err;
        }
    }
}
