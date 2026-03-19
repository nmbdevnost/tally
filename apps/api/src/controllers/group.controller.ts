import { Context } from "hono"
import { groupService } from "../services/group.service"

export const groupController = {
  async getAll(c: Context) {
    const user = c.get("user")
    const groups = await groupService.getUserGroups(user.id)
    return c.json({ data: groups })
  },

  async getById(c: Context) {
    const { id } = c.req.param()
    const group = await groupService.getGroupById(id)
    return c.json({ data: group })
  },

  async create(c: Context) {
    const user = c.get("user")
    const body = await c.req.json()
    const group = await groupService.createGroup(user.id, body)
    return c.json({ data: group }, 201)
  },

  async update(c: Context) {
    const { id } = c.req.param()
    const body = await c.req.json()
    const group = await groupService.updateGroup(id, body)
    return c.json({ data: group })
  },

  async remove(c: Context) {
    const { id } = c.req.param()
    await groupService.deleteGroup(id)
    return c.json({ message: "Group deleted successfully" })
  },

  async getMembers(c: Context) {
    const { id } = c.req.param()
    const members = await groupService.getGroupMembers(id)
    return c.json({ data: members })
  },

  async addMember(c: Context) {
    const { id } = c.req.param()
    const body = await c.req.json()
    const member = await groupService.addGroupMember(id, body.userId)
    return c.json({ data: member }, 201)
  },

  async removeMember(c: Context) {
    const { memberId } = c.req.param()
    await groupService.removeGroupMember(memberId)
    return c.json({ message: "Member removed successfully" })
  },
}
