import { defineConfig } from "drizzle-kit"
import { Config } from "./src/config/index";

export default defineConfig({
    schema: './src/entity/*.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: Config.DATABASE_URL as string,
    }
});