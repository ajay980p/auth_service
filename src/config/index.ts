import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`) });

// Read environment variables
const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_TOKEN_SECRET_KEY,
    CORS_ORIGIN,
    JWKS_URI,
    DATABASE_URL,
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE
} = process.env;

// Export configuration object
export const Config = {
    PORT: PORT || 3000,
    NODE_ENV: NODE_ENV || "development",
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_TOKEN_SECRET_KEY,
    CORS_ORIGIN,
    JWKS_URI,
    DATABASE_URL,
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE
};