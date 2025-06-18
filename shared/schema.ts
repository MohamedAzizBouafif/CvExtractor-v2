import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
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
  language: z.array(z.string()).default([]),
  email: z.string().email(),
  phone: z.array(z.string()).default([]),
  location: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        location: z.string(),
        start_date: z.string(),
        end_date: z.string(),
      })
    )
    .default([]),
  certificates: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).default([]),
  hobbies: z.array(z.string()).optional().default([]),
  expertise: z
    .array(
      z.object({
        date: z.string(),
        company: z.string(),
        role: z.string(),
        description: z.string().optional().default(""),
      })
    )
    .default([]),
  projects: z
    .array(
      z.object({
        project_name: z.string(),
        industry: z.string(),
        country: z.string(),
        role: z.string(),
        phases: z.array(z.string()).default([]),
      })
    )
    .optional()
    .default([]),
  summary: z.string(),
});

export type CVData = z.infer<typeof cvDataSchema>;
