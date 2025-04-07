import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const showerSessions = pgTable("shower_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  duration: integer("duration").notNull(), // in seconds
  points: integer("points").notNull(),
  completed: boolean("completed").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // e.g., "character", "background", "accessory"
  iconName: text("icon_name").notNull(),
  unlocked: boolean("unlocked").notNull().default(false),
  unlockedAt: timestamp("unlocked_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertShowerSessionSchema = createInsertSchema(showerSessions).pick({
  userId: true,
  duration: true,
  points: true,
  completed: true,
});

export const insertRewardSchema = createInsertSchema(rewards).pick({
  userId: true,
  name: true,
  description: true,
  type: true,
  iconName: true,
  unlocked: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertShowerSession = z.infer<typeof insertShowerSessionSchema>;
export type ShowerSession = typeof showerSessions.$inferSelect;

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;

// Client-side only types (for localStorage)
export type LocalShowerSession = {
  id: string;
  duration: number;
  points: number;
  completed: boolean;
  createdAt: string;
};

export type LocalReward = {
  id: string;
  name: string;
  description: string;
  type: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type ShowerStats = {
  totalSessions: number;
  totalPoints: number;
  longestShower: number;
  streakDays: number;
  lastShowerDate: string | null;
};
