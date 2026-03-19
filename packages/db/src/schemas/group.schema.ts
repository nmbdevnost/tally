import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth.schema";
import { expenses } from "./expense.schema";
import { settlements } from "./settlement.schema";

export const groupRoleEnum = pgEnum("group_role", ["owner", "admin", "member"]);

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  currency: text("currency").notNull().default("USD"),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: groupRoleEnum("role").notNull().default("member"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const groupsRelations = relations(groups, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [groups.createdById],
    references: [user.id],
  }),
  members: many(groupMembers),
  expenses: many(expenses),
  settlements: many(settlements),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(user, {
    fields: [groupMembers.userId],
    references: [user.id],
  }),
}));
