import { config } from "dotenv"
import path from "path"

config({ path: path.resolve(__dirname, "../../../.env") })

import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { auth } from "./lib/auth"
import { authMiddleware } from "./middleware/auth.middleware"
import groupRoutes from "./routes/group.routes"

const app = new Hono()

app.use("*", logger())
app.use(
  "*",
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true,
  })
)
app.use("*", authMiddleware)

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))

app.get("/health", (c) => c.json({ status: "ok" }))
app.route("/api/groups", groupRoutes)

const PORT = Number(process.env.PORT) || 3000

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export type AppType = typeof app
