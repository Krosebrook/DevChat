import { create } from 'zustand';
import { type Project, type GenerationTask } from '@shared/schema';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  generationTasks: GenerationTask[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setGenerationTasks: (tasks: GenerationTask[]) => void;
  updateGenerationTask: (taskId: string, updates: Partial<GenerationTask>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  generationTasks: [],
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setGenerationTasks: (tasks) => set({ generationTasks: tasks }),
  
  updateGenerationTask: (taskId, updates) => set((state) => ({
    generationTasks: state.generationTasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    ),
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects],
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((project) =>
      project.id === id ? { ...project, ...updates } : project
    ),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...updates } 
      : state.currentProject,
  })),
  
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter((project) => project.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject,
  })),
}));
