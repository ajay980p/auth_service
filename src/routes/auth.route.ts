import express, { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
import logger from '../config/logger';
import { UserService } from '../services/UserService';
import { CredentialService } from '../services/CredentialService';
import { TokenService } from '../services/TokenService';
import registerValidator from '../validators/register-validator';
import loginValidators from '../validators/login-validators';

const router = express.Router();
const credentialService = new CredentialService();
const userService = new UserService(credentialService, logger);
const tokenService = new TokenService(logger);
const authController = new AuthController(userService, credentialService, tokenService, logger);

router.post('/register', registerValidator, (req: Request, res: Response, next: NextFunction) => {
    authController.register(req, res, next);
});

router.post('/login', loginValidators, (req: Request, res: Response, next: NextFunction) => {
    authController.login(req, res, next);
});

router.post('/self', (req: Request, res: Response, next: NextFunction) => {
    authController.self(req, res, next);
});


router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    authController.logout(req, res, next);
});

export default router;
