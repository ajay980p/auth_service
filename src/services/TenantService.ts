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

        const tenant = await this.checkTenantExists(tenantData.mailId);
        if (tenant) {
            const err = errorHandler(400, "Tenant already exists.", tenantData.mailId);
            throw err;
        }

        try {
            const result = await db.insert(TenantsTable).values(tenantData).returning({ id: TenantsTable.id });
            return result;
        } catch (err) {
            throw err;
        }
    }


    // To update Tenants Data
    async updateTenant(tenantData: { id: number; name: string; address: string, mailId: string }) {

        const tenant = await this.checkTenantExistsById(tenantData.id);
        if (!tenant) {
            const err = errorHandler(400, "Tenants doesn't exists for id : ", String(tenantData.id));
            throw err;
        }

        try {
            const result = await db.update(TenantsTable).set(tenantData).where(eq(TenantsTable.id, tenantData.id)
            ).returning({ id: TenantsTable.id });
            return result;
        } catch (err) {
            throw err;
        }
    }


    // To delete Tenants Data
    async deleteTenant(id: number) {

        const tenant = await this.checkTenantExistsById(id);
        if (!tenant) {
            const err = errorHandler(400, "Tenants doesn't exists for id : ", String(id));
            throw err;
        }

        try {
            const result = await db.delete(TenantsTable).where(eq(TenantsTable.id, id)).returning({ id: TenantsTable.id });
            return result;
        } catch (err) {
            throw err;
        }
    }


    // To get all Tenants Data
    async getAllTenants({ currentPage, pageSize }: { currentPage: number; pageSize: number }) {
        try {

            currentPage = currentPage > 0 ? currentPage : 1;
            pageSize = pageSize > 0 ? pageSize : 10;

            const offset = (currentPage - 1) * pageSize;

            // Query to count the total number of users
            const totalRecordsResult = await db.select({ count: count() }).from(TenantsTable);
            const totalRecords = totalRecordsResult[0].count;

            // Query to get paginated Tenant data
            const result = await db.select().from(TenantsTable).limit(pageSize).offset(offset);

            const tenantsDataForLog = result.map(res => ({
                ...res,
                created_at: res.created_at ? formatDateOnly(res.created_at) : null
            }));

            this.logger.info("Tenants Data fetched successfully", { users: tenantsDataForLog });

            return {
                totalRecords, tenantsData: tenantsDataForLog
            };
        } catch (err) {
            throw err;
        }
    }


    // To check if Tenant exists
    async checkTenantExists(mailId: string) {
        try {
            const result = await db.select().from(TenantsTable).where(eq(TenantsTable.mailId, mailId));
            return result[0];
        } catch (err) {
            throw err;
        }
    }


    // To check if Tenant exists by Id
    async checkTenantExistsById(id: number) {
        try {
            const result = await db.select().from(TenantsTable).where(eq(TenantsTable.id, id));
            return result[0];
        } catch (err) {
            throw err;
        }
    }


    // To update Tanant using Data present in the request
    // async updateTenantDataUsingColumn(tenantData: { id: number; name: string; address: string; mailId: string }, columnName: keyof typeof TenantsTable, columnValue: any) {
    //     try {
    //         const result = await db
    //             .update(TenantsTable)
    //             .set(tenantData)
    //             .where(eq(TenantsTable[columnName], columnValue))
    //             .returning({ id: TenantsTable.id });

    //         return result[0];
    //     } catch (err) {
    //         throw err;
    //     }
    // }
}
