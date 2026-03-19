import { Hono } from "hono"
import { groupController } from "../controllers/group.controller"
import { protectedMiddleware } from "../middleware/protected.middleware"

const groupRoutes = new Hono()

groupRoutes.use("*", protectedMiddleware)

groupRoutes.get("/", groupController.getAll)
groupRoutes.post("/", groupController.create)
groupRoutes.get("/:id", groupController.getById)
groupRoutes.patch("/:id", groupController.update)
groupRoutes.delete("/:id", groupController.remove)
groupRoutes.get("/:id/members", groupController.getMembers)
groupRoutes.post("/:id/members", groupController.addMember)
groupRoutes.delete("/:id/members/:memberId", groupController.removeMember)

export default groupRoutes
