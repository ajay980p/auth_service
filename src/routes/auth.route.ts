import express, { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
import logger from '../config/logger';
import { UserService } from '../services/UserService';
import { CredentialService } from '../services/CredentialService';

const router = express.Router();
const credentialService = new CredentialService();
const userService = new UserService(credentialService, logger);
const authController = new AuthController(userService, credentialService, logger);

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    authController.register(req, res, next);
});

export default router;
