import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define the Tenants table
export const TenantsTable = pgTable("tenants", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    address: varchar("address", { length: 100 }).notNull(),
    created_at: timestamp("created_at").default(sql`current_timestamp`),
    updated_at: timestamp("updated_at").default(sql`current_timestamp`),
});