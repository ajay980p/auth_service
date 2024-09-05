import { NextFunction, Request, Response } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export class TenantController {
    private logger: Logger;
    private tenantService: TenantService;

    constructor(tenantService: TenantService, logger: Logger) {
        this.tenantService = tenantService;
        this.logger = logger;
    }


    // To create a new Tenants
    async createTenant(req: CreateTenantRequest, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { name, address, mailId } = req.body;
        this.logger.info(`Getting data towards Tenant Controller: `, { name, address, mailId });

        try {
            const tenant = await this.tenantService.create({ name, address, mailId });
            this.logger.info(`Tenant created: `, { id: tenant[0].id });

            return res.status(201).json({ status: "success", statusCode: 201, message: "Tenant created successfully", data: { id: tenant[0].id } });
        } catch (err) {
            next(err);
            return;
        }
    }


    // To update Tenants Data
    async updateTenant(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { id, name, address, mailId } = req.body;
        this.logger.info(`Getting data towards Tenant Controller: `, { id, name, address, mailId });

        try {
            const tenant = await this.tenantService.updateTenant({ id, name, address, mailId });
            this.logger.info(`Tenant updated: `, { id: tenant[0].id });

            return res.status(200).json({ statusCode: 200, message: "Tenant updated successfully", data: { id: tenant[0].id } });
        } catch (err) {
            next(err);
            return;
        }
    }


    // To delete Tenants Data
    async deleteTenant(req: Request, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { id } = req.body;
        this.logger.info(`Getting data towards Tenant Controller: `, { id });

        try {
            const tenant = await this.tenantService.deleteTenant(id);
            this.logger.info(`Tenant deleted successfully : `, { id: tenant[0].id });

            return res.status(200).json({ statusCode: 200, message: "Tenant deleted successfully", data: { id: tenant[0].id } });
        } catch (err) {
            next(err);
            return;
        }
    }


    // To get all Tenants
    async getAllTenants(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const err = createHttpError(400, "Validation failed", { errors: result.array() });
            next(err);
            return;
        }

        const { currentPage, pageSize } = req.body;
        this.logger.info(`Getting data towards Tenant Controller: `);

        try {
            const tenants = await this.tenantService.getAllTenants({ currentPage, pageSize });
            this.logger.info(`All Tenants data fetched successfully`);

            return res.status(200).json({ status: "success", statusCode: 200, message: "All Tenants data fetched successfully", data: tenants });
        } catch (err) {
            next(err);
            return;
        }
    }
}
