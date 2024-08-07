import { TenantsTable } from "../models";
import { ITenant } from "../types";
import { db } from "../config/data-source";
import { eq } from "drizzle-orm";
import { errorHandler } from "../validators/err-creators";

export class TenantService {

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
    async getAllTenants() {
        try {
            const result = await db.select().from(TenantsTable);
            return result;
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
