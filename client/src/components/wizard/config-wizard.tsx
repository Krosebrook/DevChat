import { useConfigStore } from '@/stores/configStore';
import { StepProgress } from './step-progress';
import { ProjectScope } from './steps/project-scope';
import { PlatformSelection } from './steps/platform-selection';
import { FeatureConfiguration } from './steps/feature-configuration';
import { Review } from './steps/review';
import { Generation } from './steps/generation';

export function ConfigWizard() {
  const { currentStep } = useConfigStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectScope />;
      case 2:
        return <PlatformSelection />;
      case 3:
        return <FeatureConfiguration />;
      case 4:
        return <Review />;
      case 5:
        return <Generation />;
      default:
        return <ProjectScope />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <StepProgress />
      <div className="p-6">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
