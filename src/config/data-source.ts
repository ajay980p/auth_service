import "reflect-metadata";
import { Config } from "./index";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";

const queryString = Config.DATABASE_URL as string;

export const connection = postgres(queryString);   // Create a connection to the database

export const db = drizzle(connection);  // Initialize the database connection