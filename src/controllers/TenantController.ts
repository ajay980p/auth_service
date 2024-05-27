import { NextFunction, Request, Response } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";

export class TenantController {

    constructor(private tenantService: TenantService, private logger: Logger) { }

    async createTenant(req: CreateTenantRequest, res: Response, next: NextFunction) {

        const { name, address } = req.body;
        this.logger.debug(`Getting data towards Tenant Controller : `, { name, address })

        try {
            const tenant = await this.tenantService.create({ name, address })
            res.send({ success: true, data: { id: tenant.id } })

            this.logger.info(`Tenant created: `, { id: tenant.id })

        } catch (err) {
            next(err)
        }
    }


}