import { type User, type InsertUser, type Project, type InsertProject, type UpdateProject, type GenerationTask, type InsertGenerationTask, type ConfigurationStep, type InsertConfigurationStep, users, projects, generationTasks, configurationSteps } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project methods
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  createProject(project: InsertProject & { userId: string }): Promise<Project>;
  updateProject(id: string, updates: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Generation task methods
  getGenerationTask(id: string): Promise<GenerationTask | undefined>;
  getGenerationTasksByProjectId(projectId: string): Promise<GenerationTask[]>;
  createGenerationTask(task: InsertGenerationTask): Promise<GenerationTask>;
  updateGenerationTask(id: string, updates: Partial<GenerationTask>): Promise<GenerationTask | undefined>;

  // Configuration step methods
  getConfigurationStep(projectId: string, step: number): Promise<ConfigurationStep | undefined>;
  getConfigurationStepsByProjectId(projectId: string): Promise<ConfigurationStep[]>;
  createOrUpdateConfigurationStep(step: InsertConfigurationStep): Promise<ConfigurationStep>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(projectData: InsertProject & { userId: string }): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  async updateProject(id: string, updates: UpdateProject): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Generation task methods
  async getGenerationTask(id: string): Promise<GenerationTask | undefined> {
    const [task] = await db.select().from(generationTasks).where(eq(generationTasks.id, id));
    return task || undefined;
  }

  async getGenerationTasksByProjectId(projectId: string): Promise<GenerationTask[]> {
    return await db.select().from(generationTasks).where(eq(generationTasks.projectId, projectId));
  }

  async createGenerationTask(taskData: InsertGenerationTask): Promise<GenerationTask> {
    const [task] = await db
      .insert(generationTasks)
      .values(taskData)
      .returning();
    return task;
  }

  async updateGenerationTask(id: string, updates: Partial<GenerationTask>): Promise<GenerationTask | undefined> {
    const [task] = await db
      .update(generationTasks)
      .set(updates)
      .where(eq(generationTasks.id, id))
      .returning();
    return task || undefined;
  }

  // Configuration step methods
  async getConfigurationStep(projectId: string, step: number): Promise<ConfigurationStep | undefined> {
    const [configStep] = await db
      .select()
      .from(configurationSteps)
      .where(and(eq(configurationSteps.projectId, projectId), eq(configurationSteps.step, step)));
    return configStep || undefined;
  }

  async getConfigurationStepsByProjectId(projectId: string): Promise<ConfigurationStep[]> {
    return await db.select().from(configurationSteps).where(eq(configurationSteps.projectId, projectId));
  }

  async createOrUpdateConfigurationStep(stepData: InsertConfigurationStep): Promise<ConfigurationStep> {
    // Try to find existing step
    const existing = await this.getConfigurationStep(stepData.projectId, stepData.step);
    
    if (existing) {
      // Update existing step
      const [updated] = await db
        .update(configurationSteps)
        .set({ ...stepData, updatedAt: new Date() })
        .where(eq(configurationSteps.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new step
      const [created] = await db
        .insert(configurationSteps)
        .values(stepData)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
