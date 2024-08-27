import express, { Request, Response, NextFunction } from 'express';
import { AuthController } from '../../controllers/AuthController';
import logger from '../../config/logger';
import { UserService } from '../../services/UserService';
import { CredentialService } from '../../services/CredentialService';
import { TokenService } from '../../services/TokenService';
import registerValidator from '../../validators/register-validator';
import loginValidators from '../../validators/login-validators';
import { authenticate } from '../../middlewares/authenticate';
import { UserController } from '../../controllers/UserController';
import { canAccess } from '../../middlewares/canAccess';
import { Roles } from '../../constants/constant';
import { createUserDataValidator, deleteUserIdValidator } from '../../validators/user-validators';

const router = express.Router();
const credentialService = new CredentialService();
const userService = new UserService(credentialService, logger);
const tokenService = new TokenService(logger);
const authController = new AuthController(userService, credentialService, tokenService, logger);
const userController = new UserController(logger, userService);

router.post('/register', registerValidator, (req: Request, res: Response, next: NextFunction) => {
    authController.register(req, res, next);
});

router.post('/login', loginValidators, (req: Request, res: Response, next: NextFunction) => {
    authController.login(req, res, next);
});

router.post('/self', authenticate, (req: Request, res: Response, next: NextFunction) => {
    authController.self(req, res, next);
});

router.post('/logout', authenticate, (req: Request, res: Response, next: NextFunction) => {
    authController.logout(req, res, next);
});


router.post('/createUser', authenticate, createUserDataValidator, canAccess([Roles.ADMIN, Roles.CONSUMER]), (req: Request, res: Response, next: NextFunction) => {
    userController.createUser(req, res, next);
});


router.post('/deleteUser', authenticate, canAccess([Roles.ADMIN, Roles.CONSUMER]), deleteUserIdValidator, (req: Request, res: Response, next: NextFunction) => {
    userController.deleteUserById(req, res, next);
});


export default router;
