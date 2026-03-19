import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  numeric,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth.schema";
import { groups } from "./group.schema";
import { settlements } from "./settlement.schema";
import { categories } from "./category.schema";

export const splitTypeEnum = pgEnum("split_type", [
  "equal",
  "exact",
  "percentage",
  "shares",
]);

export const expenseStatusEnum = pgEnum("expense_status", [
  "active",
  "settled",
]);

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  splitType: splitTypeEnum("split_type").notNull().default("equal"),
  status: expenseStatusEnum("status").notNull().default("active"),
  paidById: uuid("paid_by_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
  expenseDate: timestamp("expense_date").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const expenseSplits = pgTable("expense_splits", {
  id: uuid("id").primaryKey().defaultRandom(),
  expenseId: uuid("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  percentage: numeric("percentage", { precision: 5, scale: 2 }),
  shares: integer("shares"),
  isPaid: boolean("is_paid").notNull().default(false),
  settledAt: timestamp("settled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const expensesRelations = relations(expenses, ({ one, many }) => ({
  group: one(groups, {
    fields: [expenses.groupId],
    references: [groups.id],
  }),
  paidBy: one(user, {
    fields: [expenses.paidById],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id],
  }),
  splits: many(expenseSplits),
  settlements: many(settlements),
}));

export const expenseSplitsRelations = relations(expenseSplits, ({ one }) => ({
  expense: one(expenses, {
    fields: [expenseSplits.expenseId],
    references: [expenses.id],
  }),
  user: one(user, {
    fields: [expenseSplits.userId],
    references: [user.id],
  }),
}));
