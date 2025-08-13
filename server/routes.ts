import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProjectSchema, updateProjectSchema, insertConfigurationStepSchema, projectScopeSchema, platformSelectionSchema, featureConfigurationSchema, reviewSchema, type WebSocketMessage } from "@shared/schema";
import { z } from "zod";

// Mock user ID for demo purposes
const DEMO_USER_ID = "demo-user";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast to all connected clients
  function broadcast(message: WebSocketMessage) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  // Projects API
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getProjectsByUserId(DEMO_USER_ID);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch project' });
    }
  });

  app.post('/api/projects', async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({ ...projectData, userId: DEMO_USER_ID });
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid project data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create project' });
    }
  });

  app.patch('/api/projects/:id', async (req, res) => {
    try {
      const updates = updateProjectSchema.parse(req.body);
      const project = await storage.updateProject(req.params.id, updates);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid update data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete project' });
    }
  });

  // Configuration steps API
  app.get('/api/projects/:projectId/steps', async (req, res) => {
    try {
      const steps = await storage.getConfigurationStepsByProjectId(req.params.projectId);
      res.json(steps);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch configuration steps' });
    }
  });

  app.post('/api/projects/:projectId/steps/:step', async (req, res) => {
    try {
      const stepNumber = parseInt(req.params.step);
      const projectId = req.params.projectId;
      
      // Validate step data based on step number
      let stepData;
      switch (stepNumber) {
        case 1:
          stepData = projectScopeSchema.parse(req.body);
          break;
        case 2:
          stepData = platformSelectionSchema.parse(req.body);
          break;
        case 3:
          stepData = featureConfigurationSchema.parse(req.body);
          break;
        case 4:
          stepData = reviewSchema.parse(req.body);
          break;
        default:
          return res.status(400).json({ message: 'Invalid step number' });
      }

      const configStep = await storage.createOrUpdateConfigurationStep({
        projectId,
        step: stepNumber,
        data: stepData,
        isCompleted: true,
      });

      res.json(configStep);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid step data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to save configuration step' });
    }
  });

  // Generation API
  app.post('/api/projects/:projectId/generate', async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Update project status to generating
      await storage.updateProject(projectId, { status: 'generating' });

      // Create generation tasks for different agents
      const agents = [
        'Master Orchestrator',
        'Code Generation Agent',
        'Security Guardian',
        'Quality Engineer',
        'Deployment Specialist'
      ];

      const tasks = [];
      for (const agentName of agents) {
        const task = await storage.createGenerationTask({
          projectId,
          agentName,
          status: 'queued',
          progress: 0,
          message: `Initializing ${agentName}...`,
          logs: [],
        });
        tasks.push(task);
      }

      // Start generation process asynchronously
      generateProjectAsync(projectId, tasks, broadcast);

      res.json({ message: 'Generation started', tasks });
    } catch (error) {
      res.status(500).json({ message: 'Failed to start generation' });
    }
  });

  // Generation tasks API
  app.get('/api/projects/:projectId/tasks', async (req, res) => {
    try {
      const tasks = await storage.getGenerationTasksByProjectId(req.params.projectId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch generation tasks' });
    }
  });

  // Cost estimation API
  app.post('/api/projects/estimate-cost', (req, res) => {
    try {
      const { platform, framework, features } = req.body;
      
      // Simple cost calculation logic
      let baseCost = 50; // Base cost in dollars
      let monthlyCost = 10; // Base monthly cost in dollars

      // Platform multipliers
      const platformMultipliers: Record<string, number> = {
        web: 1,
        mobile: 1.5,
        desktop: 1.3,
      };

      // Framework multipliers
      const frameworkMultipliers: Record<string, number> = {
        react: 1,
        nextjs: 1.2,
        svelte: 0.9,
        'react-native': 1.4,
        flutter: 1.3,
        electron: 1.2,
        tauri: 1.1,
      };

      // Feature costs
      const featureCosts: Record<string, number> = {
        authentication: 25,
        database: 30,
        payments: 50,
        realtime: 40,
        analytics: 20,
        api: 35,
      };

      baseCost *= (platformMultipliers[platform as string] || 1);
      baseCost *= (frameworkMultipliers[framework as string] || 1);

      if (Array.isArray(features)) {
        features.forEach((feature: string) => {
          baseCost += (featureCosts[feature] || 0);
          if (feature === 'database' || feature === 'realtime') {
            monthlyCost += 15;
          }
        });
      }

      res.json({
        estimatedCost: Math.round(baseCost * 100), // Convert to cents
        monthlyHostingCost: Math.round(monthlyCost * 100), // Convert to cents
        breakdown: {
          baseCost: Math.round(50 * 100),
          platformCost: Math.round((baseCost - 50) * 100),
          features: features || [],
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to calculate cost estimate' });
    }
  });

  return httpServer;
}

// Simulate asynchronous project generation
async function generateProjectAsync(projectId: string, tasks: any[], broadcast: (message: WebSocketMessage) => void) {
  try {
    const project = await storage.getProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      
      // Update task to running
      await storage.updateGenerationTask(task.id, {
        status: 'running',
        message: `${task.agentName} is processing...`,
        progress: 0,
      });

      broadcast({
        type: 'progress_update',
        data: { taskId: task.id, progress: 0, message: `${task.agentName} started` }
      });

      // Different progress patterns for different agents
      let progressSteps: Array<{progress: number, message: string, delay: number}> = [];
      
      switch (task.agentName) {
        case 'Master Orchestrator':
          progressSteps = [
            { progress: 25, message: 'Analyzing project requirements...', delay: 600 },
            { progress: 50, message: 'Setting up project structure...', delay: 400 },
            { progress: 75, message: 'Initializing framework configuration...', delay: 500 },
            { progress: 100, message: 'Project orchestration complete', delay: 300 }
          ];
          break;
        case 'Code Generation Agent':
          progressSteps = [
            { progress: 20, message: 'Generating core application files...', delay: 800 },
            { progress: 40, message: 'Creating component structure...', delay: 700 },
            { progress: 60, message: 'Implementing feature modules...', delay: 900 },
            { progress: 80, message: 'Configuring build system...', delay: 600 },
            { progress: 100, message: 'Code generation complete', delay: 400 }
          ];
          
          // Actually generate code for this agent
          if (task.agentName === 'Code Generation Agent') {
            try {
              // Dynamic import to avoid circular dependencies
              const { projectGenerator } = await import('./generators/index');
              const generationResult = await projectGenerator.generateProject(project);
              
              // Add log about successful generation
              const logs = await storage.getGenerationTask(task.id);
              if (logs) {
                const newLogs = [...(logs.logs || []), 
                  `[${new Date().toLocaleTimeString()}] Generated ${generationResult.files.length} files successfully`
                ];
                await storage.updateGenerationTask(task.id, { 
                  logs: newLogs,
                  metadata: {
                    filesGenerated: generationResult.files.length,
                    framework: project.framework,
                    features: project.features
                  }
                });
                
                broadcast({
                  type: 'log_update',
                  data: { taskId: task.id, log: `Generated ${generationResult.files.length} files for ${project.framework}` }
                });
              }
            } catch (error) {
              console.error('Code generation failed:', error);
              await storage.updateGenerationTask(task.id, { 
                status: 'error', 
                message: `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
              });
              broadcast({
                type: 'task_error',
                data: { taskId: task.id, error: error instanceof Error ? error.message : 'Unknown error' }
              });
              continue;
            }
          }
          break;
        case 'Security Guardian':
          progressSteps = [
            { progress: 30, message: 'Scanning for security vulnerabilities...', delay: 700 },
            { progress: 60, message: 'Applying security best practices...', delay: 800 },
            { progress: 100, message: 'Security audit complete', delay: 500 }
          ];
          break;
        case 'Quality Engineer':
          progressSteps = [
            { progress: 25, message: 'Setting up testing framework...', delay: 600 },
            { progress: 50, message: 'Generating test cases...', delay: 700 },
            { progress: 75, message: 'Running quality checks...', delay: 800 },
            { progress: 100, message: 'Quality assurance complete', delay: 400 }
          ];
          break;
        case 'Deployment Specialist':
          progressSteps = [
            { progress: 40, message: 'Configuring deployment pipeline...', delay: 800 },
            { progress: 80, message: 'Setting up hosting configuration...', delay: 700 },
            { progress: 100, message: 'Deployment configuration complete', delay: 500 }
          ];
          break;
        default:
          progressSteps = [
            { progress: 50, message: `Processing ${task.agentName}...`, delay: 600 },
            { progress: 100, message: `${task.agentName} completed`, delay: 400 }
          ];
      }

      // Execute progress steps
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        
        await storage.updateGenerationTask(task.id, {
          progress: step.progress,
          message: step.message,
        });

        broadcast({
          type: 'progress_update',
          data: { taskId: task.id, progress: step.progress, message: step.message }
        });

        // Add logs for significant progress
        const logs = await storage.getGenerationTask(task.id);
        if (logs && step.progress % 50 === 0) {
          const newLogs = [...(logs.logs || []), `[${new Date().toLocaleTimeString()}] ${step.message}`];
          await storage.updateGenerationTask(task.id, { logs: newLogs });
          
          broadcast({
            type: 'log_update',
            data: { taskId: task.id, log: `[${new Date().toLocaleTimeString()}] ${step.message}` }
          });
        }
      }

      // Mark task as completed
      await storage.updateGenerationTask(task.id, {
        status: 'completed',
        progress: 100,
        message: `${task.agentName} completed successfully`,
      });

      broadcast({
        type: 'task_completed',
        data: { taskId: task.id }
      });
    }

    // Update project status to completed
    await storage.updateProject(projectId, { status: 'completed' });

  } catch (error) {
    console.error('Generation error:', error);
    // Mark project as error
    await storage.updateProject(projectId, { status: 'error' });
    
    // Mark any remaining tasks as failed
    for (const task of tasks) {
      const currentTask = await storage.getGenerationTask(task.id);
      if (currentTask && currentTask.status !== 'completed') {
        await storage.updateGenerationTask(task.id, { 
          status: 'error',
          message: `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        broadcast({
          type: 'task_error',
          data: { taskId: task.id, error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }
    }
  }
}
