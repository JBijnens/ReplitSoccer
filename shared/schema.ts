import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User data type
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  picture: text("picture"),
  provider: text("provider").notNull(), // "google" or "microsoft"
  providerId: text("provider_id").notNull().unique(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Match data type
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  opponent: text("opponent").notNull(),
  location: text("location").notNull(),
  details: text("details"),
  createdBy: integer("created_by").notNull(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
});

// Attendance data type
export const attendances = pgTable("attendances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  matchId: integer("match_id").notNull(),
  status: text("status").notNull(), // "attending", "notAttending", "pending"
});

export const insertAttendanceSchema = createInsertSchema(attendances).omit({
  id: true,
});

// Player data type with additional information
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  position: text("position"),
  status: text("status").default("Active").notNull(), // "Active", "Injured", "Inactive"
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type Attendance = typeof attendances.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

// Extended types for frontend use
export type MatchWithAttendance = Match & {
  userAttendance?: Attendance;
  attendees: User[];
  attendanceCount: {
    attending: number;
    total: number;
  };
};

export type PlayerWithStats = Player & {
  user: User;
  attendanceRate: number;
  attendedMatches: number;
  totalMatches: number;
};
