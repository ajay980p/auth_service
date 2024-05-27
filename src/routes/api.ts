import express from "express";
import AuthRoute from "./auth";
import TenantRoute from "./tenant";

const app = express();

app.use("/auth", AuthRoute);
app.use("/tenants", TenantRoute);

export default app;