import { config } from "dotenv";
config();

// Read environment variables
const { PORT, NODE_ENV } = process.env;

// Export configuration object
export const Config = {
    PORT: PORT || 3000,
    NODE_ENV: NODE_ENV || "development",
};
