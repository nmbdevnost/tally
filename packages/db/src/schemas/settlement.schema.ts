import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth.schema";
import { groups } from "./group.schema";
import { expenses } from "./expense.schema";

export const settlementStatusEnum = pgEnum("settlement_status", [
  "pending",
  "completed",
]);

export const settlements = pgTable("settlements", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  expenseId: uuid("expense_id").references(() => expenses.id, {
    onDelete: "set null",
  }),
  fromUserId: uuid("from_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  toUserId: uuid("to_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: settlementStatusEnum("status").notNull().default("pending"),
  settledAt: timestamp("settled_at"),
  notes: text("notes"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const settlementsRelations = relations(settlements, ({ one }) => ({
  group: one(groups, {
    fields: [settlements.groupId],
    references: [groups.id],
  }),
  expense: one(expenses, {
    fields: [settlements.expenseId],
    references: [expenses.id],
  }),
  fromUser: one(user, {
    fields: [settlements.fromUserId],
    references: [user.id],
  }),
  toUser: one(user, {
    fields: [settlements.toUserId],
    references: [user.id],
  }),
}));
