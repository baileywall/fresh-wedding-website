import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import "jsr:@std/dotenv/load";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// Create a database pool with three connections that are lazily established
const pool = new Pool(databaseUrl, 3, true);

// Connect to the database
export const connection = await pool.connect();
