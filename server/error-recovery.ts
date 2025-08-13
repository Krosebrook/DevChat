import { GenerationTask } from '@shared/schema';

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

interface GenerationState {
  projectId: string;
  step: string;
  data: any;
  timestamp: number;
  filesGenerated: string[];
  logs: string[];
}

export class ErrorRecoveryManager {
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  };

  private generationStates = new Map<string, GenerationState[]>();
  private activeRetries = new Map<string, number>();

  /**
   * Save generation state for rollback capabilities
   */
  async saveGenerationState(taskId: string, state: GenerationState) {
    if (!this.generationStates.has(taskId)) {
      this.generationStates.set(taskId, []);
    }
    
    const states = this.generationStates.get(taskId)!;
    states.push({
      ...state,
      timestamp: Date.now()
    });

    // Keep only last 10 states for memory efficiency
    if (states.length > 10) {
      states.splice(0, states.length - 10);
    }

    console.log(`[ErrorRecovery] Saved state for task ${taskId} at step ${state.step}`);
  }

  /**
   * Get available rollback points for a task
   */
  getAvailableRollbackPoints(taskId: string): GenerationState[] {
    return this.generationStates.get(taskId) || [];
  }

  /**
   * Rollback to a previous generation state
   */
  async rollbackToState(taskId: string, stateIndex: number): Promise<GenerationState | null> {
    const states = this.generationStates.get(taskId);
    if (!states || stateIndex >= states.length || stateIndex < 0) {
      console.error(`[ErrorRecovery] Invalid rollback state index ${stateIndex} for task ${taskId}`);
      return null;
    }

    const targetState = states[stateIndex];
    console.log(`[ErrorRecovery] Rolling back task ${taskId} to state: ${targetState.step}`);

    // Remove states after the target state
    states.splice(stateIndex + 1);

    return targetState;
  }

  /**
   * Retry a failed generation with exponential backoff
   */
  async retryGeneration(
    taskId: string,
    generationFn: () => Promise<any>,
    onProgress?: (progress: number, message: string) => void
  ): Promise<any> {
    const currentRetries = this.activeRetries.get(taskId) || 0;
    
    if (currentRetries >= this.retryConfig.maxRetries) {
      console.error(`[ErrorRecovery] Max retries exceeded for task ${taskId}`);
      throw new Error(`Generation failed after ${this.retryConfig.maxRetries} retries`);
    }

    this.activeRetries.set(taskId, currentRetries + 1);

    try {
      onProgress?.(0, `Retrying generation (attempt ${currentRetries + 1}/${this.retryConfig.maxRetries})`);
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, currentRetries),
        this.retryConfig.maxDelay
      );

      if (delay > 0) {
        console.log(`[ErrorRecovery] Waiting ${delay}ms before retry ${currentRetries + 1}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const result = await generationFn();
      
      // Reset retry counter on success
      this.activeRetries.delete(taskId);
      onProgress?.(100, 'Generation completed successfully');
      
      return result;

    } catch (error) {
      console.error(`[ErrorRecovery] Retry ${currentRetries + 1} failed for task ${taskId}:`, error);
      
      if (currentRetries + 1 >= this.retryConfig.maxRetries) {
        this.activeRetries.delete(taskId);
        onProgress?.(0, `Generation failed after ${this.retryConfig.maxRetries} attempts: ${(error as Error).message}`);
        throw error;
      }

      // Recursive retry
      return this.retryGeneration(taskId, generationFn, onProgress);
    }
  }

  /**
   * Handle generation timeout
   */
  async handleTimeout(taskId: string, timeoutMs: number, generationFn: () => Promise<any>): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        console.error(`[ErrorRecovery] Generation timeout after ${timeoutMs}ms for task ${taskId}`);
        reject(new Error(`Generation timeout after ${timeoutMs / 1000} seconds`));
      }, timeoutMs);

      try {
        const result = await generationFn();
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Partial recovery - attempt to complete from where generation left off
   */
  async partialRecovery(
    taskId: string,
    lastSuccessfulStep: string,
    remainingSteps: string[],
    generationFn: (step: string) => Promise<any>,
    onProgress?: (progress: number, message: string) => void
  ): Promise<any> {
    console.log(`[ErrorRecovery] Starting partial recovery for task ${taskId} from step: ${lastSuccessfulStep}`);
    
    const results: any[] = [];
    const totalSteps = remainingSteps.length;

    for (let i = 0; i < remainingSteps.length; i++) {
      const step = remainingSteps[i];
      const progress = Math.round((i / totalSteps) * 100);
      
      onProgress?.(progress, `Recovering step: ${step}`);

      try {
        // Save state before each step
        await this.saveGenerationState(taskId, {
          projectId: '', // Will be filled by caller
          step,
          data: results,
          timestamp: Date.now(),
          filesGenerated: [], // Will be filled by caller
          logs: [`Starting recovery step: ${step}`]
        });

        const stepResult = await this.retryGeneration(
          `${taskId}-${step}`,
          () => generationFn(step),
          (stepProgress, message) => {
            const overallProgress = progress + (stepProgress * (1 / totalSteps));
            onProgress?.(overallProgress, `${step}: ${message}`);
          }
        );

        results.push(stepResult);
        
      } catch (error) {
        console.error(`[ErrorRecovery] Partial recovery failed at step ${step}:`, error);
        throw new Error(`Partial recovery failed at step ${step}: ${(error as Error).message}`);
      }
    }

    onProgress?.(100, 'Partial recovery completed successfully');
    return results;
  }

  /**
   * Clear all states for a task (cleanup)
   */
  clearTaskStates(taskId: string) {
    this.generationStates.delete(taskId);
    this.activeRetries.delete(taskId);
    console.log(`[ErrorRecovery] Cleared all states for task ${taskId}`);
  }

  /**
   * Get retry statistics
   */
  getRetryStats() {
    return {
      activeRetries: Array.from(this.activeRetries.entries()),
      totalSavedStates: Array.from(this.generationStates.entries()).reduce(
        (sum, [, states]) => sum + states.length, 0
      ),
      tasksWithStates: this.generationStates.size
    };
  }
}