import express, { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';
import { authenticate } from '../../middlewares/authenticate';
import { UserController } from '../../controllers/UserController';
import { CredentialService } from '../../services/CredentialService';
import { UserService } from '../../services/UserService';
import { getAllUserDataValidator, updateUserDataValidator } from '../../validators/user-validators';
import { canAccess } from '../../middlewares/canAccess';
import { Roles } from '../../constants/constant';

const router = express.Router();
const credentialService = new CredentialService();
const userService = new UserService(credentialService, logger);
const userController = new UserController(logger, userService);

router.post('/getUserList', authenticate, getAllUserDataValidator, canAccess([Roles.ADMIN, Roles.CONSUMER]), (req: Request, res: Response, next: NextFunction) => {
    userController.getAllUserData(req, res, next);
});


router.post('/updateUser', authenticate, updateUserDataValidator, (req: Request, res: Response, next: NextFunction) => {
    userController.updateUserData(req, res, next);
});


export default router;
