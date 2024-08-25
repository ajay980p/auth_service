import express, { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';
import { authenticate } from '../../middlewares/authenticate';
import { UserController } from '../../controllers/UserController';
import { CredentialService } from '../../services/CredentialService';
import { UserService } from '../../services/UserService';

const router = express.Router();
const credentialService = new CredentialService();
const userService = new UserService(credentialService, logger);
const userController = new UserController(logger, userService);

router.post('/getUserList', authenticate, (req: Request, res: Response, next: NextFunction) => {
    userController.getAllUserData(req, res, next);
});


export default router;
