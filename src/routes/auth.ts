import express, { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register-validator";
import loginValidators from "../validators/login-validators";
import { CredentialService } from "../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import { AuthRequest } from "../types";
import { authenticate } from "../middlewares/authenticate";


const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const credentialService = new CredentialService();
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const userService = new UserService(userRepository, credentialService, logger);
const authController = new AuthController(userService, credentialService, tokenService, logger);

router.post("/register", registerValidator, (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next));

router.post("/login", loginValidators, (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next));

router.post("/self", authenticate as RequestHandler, (req: Request, res: Response, next: NextFunction) =>
    authController.self(req as AuthRequest, res, next) as unknown as RequestHandler);

router.post("/logout", authenticate as RequestHandler, (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req, res, next));

export default router;
