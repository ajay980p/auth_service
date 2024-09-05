import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../user/User";

// Define the refreshTokens table
export const refreshTokens = pgTable("refreshTokens", {
    id: serial("id").primaryKey(),
    userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
    refreshToken: varchar("refreshToken", { length: 500 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    created_at: timestamp("created_at").default(sql`current_timestamp`),
    updated_at: timestamp("updated_at").default(sql`current_timestamp`),
});