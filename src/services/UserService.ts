import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import { Logger } from "winston";
import bcrypt from "bcrypt";
import { CredentialService } from "./CredentialService";
import { errorHandler } from "../validators/err-creators";
const saltRounds = 10;

export class UserService {
    private userRepository: Repository<User>;
    private logger: Logger;
    private credentialService: CredentialService;

    constructor(userRepository: Repository<User>, credentialService: CredentialService, logger: Logger) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.credentialService = credentialService;
    }

    // To Register User
    async createUser({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({ where: { email: email } });

        if (user) {
            const err = errorHandler(400, "Email already exists", email);
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

    // To Login User
    async loginUser({ email, password }: { email: string; password: string }) {
        const user = await this.findByEmail(email);

        try {
            // To compare hashed password
            const passwordMatched = await this.credentialService.comparePassword(password, user.password);
            if (!passwordMatched) {
                const err = errorHandler(400, "Email or Password doesn't exists", email);
                throw err;
            }

            this.logger.info("User Password matched successfully", { id: user.id });
            return user;
        } catch (err) {
            this.logger.error("Error while User Login : ");
            throw err;
        }
    }

    // Check Email Exists into the Database or not
    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email: email } });

        if (!user) {
            const err = errorHandler(400, "Email doesn't exists", email);
            throw err;
        } else {
            return user;
        }
    }
}
