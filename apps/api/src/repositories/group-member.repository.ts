import { and, db, eq, groupMembers, isNull } from "@tally/db"

export const groupMemberRepository = {
  /** Finds all members of a group */
  async findAllByGroupId(groupId: string) {
    return db
      .select()
      .from(groupMembers)
      .where(
        and(eq(groupMembers.groupId, groupId), isNull(groupMembers.deletedAt))
      )
  },

  /** Finds a single group member by group and user */
  async findByGroupAndUser(groupId: string, userId: string) {
    return db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.userId, userId),
        isNull(groupMembers.deletedAt)
      ),
    })
  },

  /** Adds a member to a group */
  async create(data: typeof groupMembers.$inferInsert) {
    const [member] = await db.insert(groupMembers).values(data).returning()
    return member
  },

  /** Soft deletes a group member */
  async softDelete(id: string) {
    const [member] = await db
      .update(groupMembers)
      .set({ deletedAt: new Date() })
      .where(and(eq(groupMembers.id, id), isNull(groupMembers.deletedAt)))
      .returning()
    return member
  },
}
