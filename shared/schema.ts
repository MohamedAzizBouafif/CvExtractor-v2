import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// CV Data schema for the extracted information
export const cvDataSchema = z.object({
  first_name: z.string(),
  last_name: z.string(), 
  sex: z.string(),
  language: z.string(),
  email: z.string().email(),
  phone: z.string(),
  education: z.string(),
  skills: z.array(z.string()),
  expertise: z.array(z.object({
    date: z.string(),
    company: z.string(),
    role: z.string()
  })),
  summary: z.string()
});

export type CVData = z.infer<typeof cvDataSchema>;
