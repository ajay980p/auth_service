import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from "./index";


export const AppDataSource = new DataSource({
    type: "mysql",
    host: Config.DB_HOST,
    // port: Number(Config.DB_PORT),
    port: 3305,
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ["src/entity/*.ts"],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});