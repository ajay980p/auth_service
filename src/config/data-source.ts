import "reflect-metadata";
import { Config } from "./index";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";
import * as schema from "../models";

const queryString = Config.DATABASE_URL as string;

export const connection = postgres(queryString);   // Create a connection to the database

export const db = drizzle(connection, { schema });  // Initialize the database connection