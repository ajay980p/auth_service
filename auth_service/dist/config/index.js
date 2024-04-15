"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotenv_1 = require("dotenv");
// Load environment variables from .env file
(0, dotenv_1.config)();
// Read environment variables
const { PORT, NODE_ENV } = process.env;
// Export configuration object
exports.Config = {
    PORT: PORT || 3000,
    NODE_ENV: NODE_ENV || 'development',
};
