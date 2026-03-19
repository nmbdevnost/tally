import { relations } from "drizzle-orm";
import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { categories } from "./category.schema";
import { groups } from "./group.schema";
import { transactions } from "./transaction.schema";

export const budgetPeriodEnum = pgEnum("budget_period", [
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
  "custom",
]);

export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  period: budgetPeriodEnum("period").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isGroup: boolean("is_group").notNull().default(false),
  groupId: uuid("group_id").references(() => groups.id, {
    onDelete: "cascade",
  }),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const budgetCategories = pgTable("budget_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  budgetId: uuid("budget_id")
    .notNull()
    .references(() => budgets.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  allocatedAmount: numeric("allocated_amount", {
    precision: 12,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const budgetsRelations = relations(budgets, ({ one, many }) => ({
  owner: one(user, {
    fields: [budgets.ownerId],
    references: [user.id],
  }),
  group: one(groups, {
    fields: [budgets.groupId],
    references: [groups.id],
  }),
  budgetCategories: many(budgetCategories),
  transactions: many(transactions),
}));

export const budgetCategoriesRelations = relations(
  budgetCategories,
  ({ one }) => ({
    budget: one(budgets, {
      fields: [budgetCategories.budgetId],
      references: [budgets.id],
    }),
    category: one(categories, {
      fields: [budgetCategories.categoryId],
      references: [categories.id],
    }),
  }),
);
