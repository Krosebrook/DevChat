import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, boolean, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  platform: text("platform").notNull(), // 'web', 'mobile', 'desktop'
  framework: text("framework").notNull(), // 'react', 'nextjs', 'react-native', etc.
  features: jsonb("features").$type<string[]>().default([]),
  configuration: jsonb("configuration").$type<Record<string, any>>().default({}),
  status: text("status").notNull().default("draft"), // 'draft', 'generating', 'completed', 'error'
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  estimatedCost: integer("estimated_cost").default(0), // in cents
  monthlyHostingCost: integer("monthly_hosting_cost").default(0), // in cents
});

export const generationTasks = pgTable("generation_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  agentName: text("agent_name").notNull(),
  status: text("status").notNull().default("queued"), // 'queued', 'running', 'completed', 'error'
  progress: integer("progress").default(0), // 0-100
  message: text("message"),
  logs: jsonb("logs").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const configurationSteps = pgTable("configuration_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  step: integer("step").notNull(), // 1-5
  data: jsonb("data").$type<Record<string, any>>().default({}),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { 
    fields: [projects.userId], 
    references: [users.id] 
  }),
  generationTasks: many(generationTasks),
  configurationSteps: many(configurationSteps),
}));

export const generationTasksRelations = relations(generationTasks, ({ one }) => ({
  project: one(projects, { 
    fields: [generationTasks.projectId], 
    references: [projects.id] 
  }),
}));

export const configurationStepsRelations = relations(configurationSteps, ({ one }) => ({
  project: one(projects, { 
    fields: [configurationSteps.projectId], 
    references: [projects.id] 
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  features: z.array(z.string()).optional(),
  configuration: z.record(z.any()).optional(),
});

export const updateProjectSchema = insertProjectSchema.partial();

export const insertGenerationTaskSchema = createInsertSchema(generationTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  logs: z.array(z.string()).optional(),
});

export const insertConfigurationStepSchema = createInsertSchema(configurationSteps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  data: z.record(z.any()).optional(),
});

// Configuration schemas for each step
export const projectScopeSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  projectType: z.enum(["web", "mobile", "desktop", "fullstack"]),
  complexity: z.enum(["simple", "medium", "complex"]),
});

export const platformSelectionSchema = z.object({
  platform: z.enum(["web", "mobile", "desktop"]),
  framework: z.string().min(1, "Framework is required"),
  deployment: z.array(z.string()).optional(),
});

export const featureConfigurationSchema = z.object({
  features: z.array(z.string()),
  authentication: z.boolean().default(false),
  database: z.boolean().default(false),
  payments: z.boolean().default(false),
  realtime: z.boolean().default(false),
  analytics: z.boolean().default(false),
  api: z.boolean().default(false),
});

export const reviewSchema = z.object({
  confirmed: z.boolean(),
  notes: z.string().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertGenerationTask = z.infer<typeof insertGenerationTaskSchema>;
export type GenerationTask = typeof generationTasks.$inferSelect;

export type InsertConfigurationStep = z.infer<typeof insertConfigurationStepSchema>;
export type ConfigurationStep = typeof configurationSteps.$inferSelect;

export type ProjectScopeData = z.infer<typeof projectScopeSchema>;
export type PlatformSelectionData = z.infer<typeof platformSelectionSchema>;
export type FeatureConfigurationData = z.infer<typeof featureConfigurationSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;

// WebSocket message types
export type WebSocketMessage = 
  | { type: "progress_update"; data: { taskId: string; progress: number; message?: string } }
  | { type: "task_completed"; data: { taskId: string; result?: any } }
  | { type: "task_error"; data: { taskId: string; error: string } }
  | { type: "log_update"; data: { taskId: string; log: string } };
