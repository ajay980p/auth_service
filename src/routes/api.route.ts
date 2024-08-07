import express from "express";
import AuthRoute from "./auth/auth.route";
import TenantRoute from "./tenants/tenants.route";

const app = express();

app.use("/auth", AuthRoute);
app.use("/tenants", TenantRoute);

export default app;