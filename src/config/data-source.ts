import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from "./index";
import { RefreshToken } from "../entity/RefreshToken";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,
    // port: Number(Config.DB_PORT),
    port: 1024,
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    // synchronize: Config.NODE_ENV === "test" || Config.NODE_ENV === "dev", // Don't use this in production
    synchronize: false,
    logging: false,
    entities: [User, RefreshToken],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});