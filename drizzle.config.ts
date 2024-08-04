import { defineConfig } from "drizzle-kit"
import { Config } from "./src/config/index";

console.log("Url : " + Config.DATABASE_URL);

export default defineConfig({
    schema: './src/models/*.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: Config.DATABASE_URL as string,
    }
});