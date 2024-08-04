import express, { Request, Response, NextFunction, RequestHandler } from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import { Tenant } from "../entity/Tenant";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import tenantValidators from "../validators/tenant-validators";
import { authenticate } from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants/constant";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);


router.post("/create", authenticate as RequestHandler, canAccess([Roles.ADMIN]), tenantValidators, (req: Request, res: Response, next: NextFunction) =>
    tenantController.createTenant(req, res, next));


export default router;