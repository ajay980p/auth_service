import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { TenantsTable } from "./tenants";

// Define the User table
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    firstName: varchar("firstName", { length: 100 }).unique().notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    password: varchar("password", { length: 100 }).notNull(),
    tenantId: integer("tenantId").references(() => TenantsTable.id),
    role: varchar("role", { length: 50 }).notNull(),
    updated_at: timestamp("updated_at").default(sql`current_timestamp`),
    created_at: timestamp("created_at").default(sql`current_timestamp`),
});