import { TenantsTable } from "../models";
import { ITenant } from "../types";
import { db } from "../config/data-source";
import { count, eq } from "drizzle-orm";
import { errorHandler } from "../validators/err-creators";
import { formatDateOnly } from "../helpers/utility";
import { Logger } from "winston";

export class TenantService {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    // To create a new Tenants
    async create(tenantData: ITenant) {
        try {
            const tenant = await this.checkTenantExists(tenantData.mailId);
            if (tenant) {
                const err = errorHandler(400, "Tenant already exists.", tenantData.mailId);
                throw err;
            }

            const result = await db.insert(TenantsTable).values(tenantData).returning({ id: TenantsTable.id });
            this.logger.info("Tenant created successfully", { id: result[0].id });
            return result;
        } catch (err) {
            this.logger.error("Error while creating tenant: ", err);
            throw err;
        }
    }

    // To update Tenants Data
    async updateTenant(tenantData: { id: number; name: string; address: string, mailId: string }) {
        try {
            const tenant = await this.checkTenantExistsById(tenantData.id);
            if (!tenant) {
                const err = errorHandler(400, "Tenant doesn't exist for id: ", String(tenantData.id));
                throw err;
            }

            const result = await db.update(TenantsTable).set(tenantData).where(eq(TenantsTable.id, tenantData.id)).returning({ id: TenantsTable.id });
            this.logger.info("Tenant updated successfully", { id: result[0].id });
            return result;
        } catch (err) {
            this.logger.error("Error while updating tenant: ", err);
            throw err;
        }
    }

    // To delete Tenants Data
    async deleteTenant(id: number) {
        try {
            const tenant = await this.checkTenantExistsById(id);
            if (!tenant) {
                const err = errorHandler(400, "Tenant doesn't exist for id: ", String(id));
                throw err;
            }

            const result = await db.delete(TenantsTable).where(eq(TenantsTable.id, id)).returning({ id: TenantsTable.id });
            this.logger.info("Tenant deleted successfully", { id: result[0].id });
            return result;
        } catch (err) {
            this.logger.error("Error while deleting tenant: ", err);
            throw err;
        }
    }

    // To get all Tenants Data
    async getAllTenants({ currentPage, pageSize }: { currentPage: number; pageSize: number }) {
        try {
            currentPage = currentPage > 0 ? currentPage : 1;
            pageSize = pageSize > 0 ? pageSize : 10;

            const offset = (currentPage - 1) * pageSize;

            const totalRecordsResult = await db.select({ count: count() }).from(TenantsTable);
            const totalRecords = totalRecordsResult[0].count;

            const result = await db.select().from(TenantsTable).limit(pageSize).offset(offset);

            const tenantsDataForLog = result.map(res => ({
                ...res,
                created_at: res.created_at ? formatDateOnly(res.created_at) : null
            }));

            this.logger.info("Tenants Data fetched successfully", { tenants: tenantsDataForLog });

            return { totalRecords, tenantsData: tenantsDataForLog };
        } catch (err) {
            this.logger.error("Error while fetching tenants data: ", err);
            throw err;
        }
    }

    // To check if Tenant exists
    async checkTenantExists(mailId: string) {
        try {
            const result = await db.select().from(TenantsTable).where(eq(TenantsTable.mailId, mailId));
            return result[0];
        } catch (err) {
            this.logger.error("Error while checking tenant existence: ", err);
            throw err;
        }
    }

    // To check if Tenant exists by Id
    async checkTenantExistsById(id: number) {
        try {
            const result = await db.select().from(TenantsTable).where(eq(TenantsTable.id, id));
            return result[0];
        } catch (err) {
            this.logger.error("Error while checking tenant existence by ID: ", err);
            throw err;
        }
    }
}