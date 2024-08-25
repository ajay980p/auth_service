import express from "express";
import AuthRoute from "./auth/auth.route";
import UserRoute from "./users/users.route";
import TenantRoute from "./tenants/tenants.route";

const app = express();

app.use("/auth", AuthRoute);
app.use("/tenants", TenantRoute);
app.use("/users", UserRoute);

export default app;