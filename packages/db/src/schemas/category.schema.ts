import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth.schema";
import { expenses } from "./expense.schema";
import { transactions } from "./transaction.schema";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  isGlobal: boolean("is_global").notNull().default(false),
  createdById: uuid("created_by_id").references(() => user.id, {
    onDelete: "set null",
  }),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [categories.createdById],
    references: [user.id],
  }),
  expenses: many(expenses),
  transactions: many(transactions),
}));
