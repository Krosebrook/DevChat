import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ProjectScopeData, type PlatformSelectionData, type FeatureConfigurationData, type ReviewData } from '@shared/schema';

interface ConfigurationState {
  currentStep: number;
  projectId: string | null;
  
  // Step data
  projectScope: ProjectScopeData | null;
  platformSelection: PlatformSelectionData | null;
  featureConfiguration: FeatureConfigurationData | null;
  review: ReviewData | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setProjectId: (id: string | null) => void;
  setProjectScope: (data: ProjectScopeData) => void;
  setPlatformSelection: (data: PlatformSelectionData) => void;
  setFeatureConfiguration: (data: FeatureConfigurationData) => void;
  setReview: (data: ReviewData) => void;
  resetConfiguration: () => void;
  canProceedToStep: (step: number) => boolean;
}

export const useConfigStore = create<ConfigurationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      projectId: null,
      projectScope: null,
      platformSelection: null,
      featureConfiguration: null,
      review: null,

      setCurrentStep: (step) => set({ currentStep: step }),
      
      setProjectId: (id) => set({ projectId: id }),
      
      setProjectScope: (data) => set({ projectScope: data }),
      
      setPlatformSelection: (data) => set({ platformSelection: data }),
      
      setFeatureConfiguration: (data) => set({ featureConfiguration: data }),
      
      setReview: (data) => set({ review: data }),
      
      resetConfiguration: () => set({
        currentStep: 1,
        projectId: null,
        projectScope: null,
        platformSelection: null,
        featureConfiguration: null,
        review: null,
      }),
      
      canProceedToStep: (step) => {
        const state = get();
        switch (step) {
          case 1:
            return true;
          case 2:
            return !!state.projectScope;
          case 3:
            return !!state.projectScope && !!state.platformSelection;
          case 4:
            return !!state.projectScope && !!state.platformSelection && !!state.featureConfiguration;
          case 5:
            return !!state.projectScope && !!state.platformSelection && !!state.featureConfiguration && !!state.review;
          default:
            return false;
        }
      },
    }),
    {
      name: 'config-storage',
    }
  )
);
