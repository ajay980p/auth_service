"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const app_1 = __importDefault(require("./app"));
// Create Express app
const server = (0, express_1.default)();
// Use the app middleware
server.use(app_1.default);
// Start the server
server.listen(config_1.Config.PORT, () => {
    console.log(`Server is running on port ${config_1.Config.PORT}`);
});
