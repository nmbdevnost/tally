import { createMiddleware } from "hono/factory"
import { AuthVariables } from "../types/auth.types"

export const protectedMiddleware = createMiddleware<{
  Variables: AuthVariables
}>(async (c, next) => {
  const user = c.get("user")

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  return next()
})
