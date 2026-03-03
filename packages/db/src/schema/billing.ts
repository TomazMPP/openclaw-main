import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "../lib/zod";

import { user } from "./auth";

import type * as z from "zod";

export const subscription = pgTable("subscription", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  status: text().notNull().default("incomplete"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscription);
export const selectSubscriptionSchema = createSelectSchema(subscription);
export const updateSubscriptionSchema = createUpdateSchema(subscription);

export type SelectSubscription = z.infer<typeof selectSubscriptionSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof updateSubscriptionSchema>;

export const supportTicket = pgTable("support_ticket", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text().notNull(),
  email: text().notNull(),
  subject: text().notNull(),
  message: text().notNull(),
  status: text().notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSupportTicketSchema = createInsertSchema(supportTicket);
export const selectSupportTicketSchema = createSelectSchema(supportTicket);

export type SelectSupportTicket = z.infer<typeof selectSupportTicketSchema>;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;

export const feedback = pgTable("feedback", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  message: text().notNull(),
  rating: integer(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFeedbackSchema = createInsertSchema(feedback);
export const selectFeedbackSchema = createSelectSchema(feedback);

export type SelectFeedback = z.infer<typeof selectFeedbackSchema>;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export const apiKey = pgTable("api_key", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  provider: text().notNull(),
  encryptedKey: text("encrypted_key").notNull(),
  label: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertApiKeySchema = createInsertSchema(apiKey);
export const selectApiKeySchema = createSelectSchema(apiKey);

export type SelectApiKey = z.infer<typeof selectApiKeySchema>;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
