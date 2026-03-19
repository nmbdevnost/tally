import { groups } from "@tally/db"
import { groupMemberRepository } from "../repositories/group-member.repository"
import { groupRepository } from "../repositories/group.repository"

export const groupService = {
  /** Returns all groups for a user */
  async getUserGroups(userId: string) {
    return groupRepository.findAllByUserId(userId)
  },

  /** Returns a group by ID, throws if not found */
  async getGroupById(id: string) {
    const group = await groupRepository.findById(id)
    if (!group) throw new Error("Group not found")
    return group
  },

  /** Creates a group and adds the creator as owner */
  async createGroup(
    userId: string,
    data: Omit<typeof groups.$inferInsert, "id" | "createdById">
  ) {
    const group = await groupRepository.create({
      ...data,
      createdById: userId,
    })

    await groupMemberRepository.create({
      groupId: group.id,
      userId,
      role: "owner",
    })

    return group
  },

  /** Updates a group by ID */
  async updateGroup(id: string, data: Partial<typeof groups.$inferInsert>) {
    const group = await groupRepository.update(id, data)
    if (!group) throw new Error("Group not found")
    return group
  },

  /** Soft deletes a group by ID */
  async deleteGroup(id: string) {
    const group = await groupRepository.softDelete(id)
    if (!group) throw new Error("Group not found")
    return group
  },

  /** Returns all members of a group */
  async getGroupMembers(groupId: string) {
    return groupMemberRepository.findAllByGroupId(groupId)
  },

  /** Adds a member to a group */
  async addGroupMember(groupId: string, userId: string) {
    const existing = await groupMemberRepository.findByGroupAndUser(
      groupId,
      userId
    )
    if (existing) throw new Error("User is already a member of this group")
    return groupMemberRepository.create({ groupId, userId, role: "member" })
  },

  /** Removes a member from a group */
  async removeGroupMember(memberId: string) {
    const member = await groupMemberRepository.softDelete(memberId)
    if (!member) throw new Error("Member not found")
    return member
  },
}
