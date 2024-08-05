import { users } from "../models/User";
import { UserData } from "../types";
import { Logger } from "winston";
import { errorHandler } from "../validators/err-creators";
import { db } from "../config/data-source";
import { eq } from 'drizzle-orm';
import bcrypt from "bcrypt";
import { CredentialService } from "./CredentialService";
import { refreshTokens } from "../models";

const saltRounds = 10;
export class UserService {
    private logger: Logger;
    private credentialService: CredentialService;

    constructor(credentialService: CredentialService, logger: Logger) {
        this.credentialService = credentialService;
        this.logger = logger;
    }

    // To Register User
    async createUser({ firstName, lastName, email, password, role }: UserData) {

        const user = await this.findByEmail(email);
        if (user) {
            const err = errorHandler(400, "Email already exists.", email);
            throw err;
        }

        try {
            // To hash password
            const salt = await bcrypt.genSalt(saltRounds);
            const hashPassword = await bcrypt.hash(password, salt);

            const insertedUser = await db.insert(users).values({ firstName, lastName, email, password: hashPassword, role }).returning({ id: users.id });
            this.logger.info("User created successfully", { id: users.id });
            return insertedUser[0];
        } catch (err) {
            this.logger.error("Error while creating user : ");
            throw err;
        }
    }

    // Check Email Exists into the Database or not
    async findByEmail(email: string) {
        const user = await db.query.users.findFirst({ where: eq(users.email, email), });
        return user;
    }

    // Find User by Id
    async findByUserId(userId: number) {
        const user = await db.query.users.findFirst({ where: eq(users.id, userId), });

        if (!user) {
            const err = errorHandler(400, "User doesn't exists", String(userId));
            throw err;
        } else {
            this.logger.info("User found by ID", { user });
            return user;
        }
    }

    // To Login User
    async loginUser({ email, password }: { email: string; password: string }) {
        const user = await this.findByEmail(email);

        try {
            if (!user) {
                const err = errorHandler(400, "Email or Password doesn't exists", email);
                throw err;
            }

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


    // To logout User
    async logoutUser(userId: number) {
        try {
            const isDeleted = await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId)).returning({ id: refreshTokens.id });
            console.log("isDeleted or not : ", isDeleted);
            this.logger.info("User logout successfully", { id: userId });
            return isDeleted;
        } catch (err) {
            this.logger.error("Error while User Logout : ");
            throw err;
        }
    }

}