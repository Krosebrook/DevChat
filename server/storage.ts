import { type User, type InsertUser, type Project, type InsertProject, type UpdateProject, type GenerationTask, type InsertGenerationTask, type ConfigurationStep, type InsertConfigurationStep } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private generationTasks: Map<string, GenerationTask>;
  private configurationSteps: Map<string, ConfigurationStep>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.generationTasks = new Map();
    this.configurationSteps = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createProject(projectData: InsertProject & { userId: string }): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = {
      ...projectData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: UpdateProject): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Generation task methods
  async getGenerationTask(id: string): Promise<GenerationTask | undefined> {
    return this.generationTasks.get(id);
  }

  async getGenerationTasksByProjectId(projectId: string): Promise<GenerationTask[]> {
    return Array.from(this.generationTasks.values()).filter(
      (task) => task.projectId === projectId,
    );
  }

  async createGenerationTask(taskData: InsertGenerationTask): Promise<GenerationTask> {
    const id = randomUUID();
    const now = new Date();
    const task: GenerationTask = {
      ...taskData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.generationTasks.set(id, task);
    return task;
  }

  async updateGenerationTask(id: string, updates: Partial<GenerationTask>): Promise<GenerationTask | undefined> {
    const existing = this.generationTasks.get(id);
    if (!existing) return undefined;

    const updated: GenerationTask = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.generationTasks.set(id, updated);
    return updated;
  }

  // Configuration step methods
  async getConfigurationStep(projectId: string, step: number): Promise<ConfigurationStep | undefined> {
    return Array.from(this.configurationSteps.values()).find(
      (configStep) => configStep.projectId === projectId && configStep.step === step,
    );
  }

  async getConfigurationStepsByProjectId(projectId: string): Promise<ConfigurationStep[]> {
    return Array.from(this.configurationSteps.values()).filter(
      (configStep) => configStep.projectId === projectId,
    );
  }

  async createOrUpdateConfigurationStep(stepData: InsertConfigurationStep): Promise<ConfigurationStep> {
    // Find existing step
    const existing = await this.getConfigurationStep(stepData.projectId, stepData.step);
    
    if (existing) {
      const updated: ConfigurationStep = {
        ...existing,
        ...stepData,
        updatedAt: new Date(),
      };
      this.configurationSteps.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const now = new Date();
      const step: ConfigurationStep = {
        ...stepData,
        id,
        createdAt: now,
        updatedAt: now,
      };
      this.configurationSteps.set(id, step);
      return step;
    }
  }
}

export const storage = new MemStorage();
