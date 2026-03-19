import { and, db, eq, groupMembers, groups, isNull } from "@tally/db"

export const groupRepository = {
  /** Finds all groups a user is a member of */
  async findAllByUserId(userId: string) {
    return db
      .select()
      .from(groups)
      .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
      .where(
        and(
          eq(groupMembers.userId, userId),
          isNull(groups.deletedAt),
          isNull(groupMembers.deletedAt)
        )
      )
  },

  /** Finds a single group by ID */
  async findById(id: string) {
    return db.query.groups.findFirst({
      where: and(eq(groups.id, id), isNull(groups.deletedAt)),
      with: {
        members: {
          where: isNull(groupMembers.deletedAt),
        },
      },
    })
  },

  /** Creates a new group */
  async create(data: typeof groups.$inferInsert) {
    const [group] = await db.insert(groups).values(data).returning()
    return group
  },

  /** Updates a group by ID */
  async update(id: string, data: Partial<typeof groups.$inferInsert>) {
    const [group] = await db
      .update(groups)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(groups.id, id), isNull(groups.deletedAt)))
      .returning()
    return group
  },

  /** Soft deletes a group by ID */
  async softDelete(id: string) {
    const [group] = await db
      .update(groups)
      .set({ deletedAt: new Date() })
      .where(and(eq(groups.id, id), isNull(groups.deletedAt)))
      .returning()
    return group
  },
}
