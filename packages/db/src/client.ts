import { neon } from "@neondatabase/serverless"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/neon-http"
import path from "path"
import * as schema from "./schemas"

config({ path: path.resolve(__dirname, "../../../.env") })

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })
