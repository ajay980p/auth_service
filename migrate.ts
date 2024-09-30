import { migrate } from "drizzle-orm/postgres-js/migrator"
import { connection, db } from "./api/config/data-source";

(async () => {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await connection.end();
})()