import { useConfigStore } from '@/stores/configStore';

export function StepProgress() {
  const { currentStep, canProceedToStep } = useConfigStore();

  const steps = [
    { number: 1, name: 'Project Scope' },
    { number: 2, name: 'Platform Selection' },
    { number: 3, name: 'Features' },
    { number: 4, name: 'Review' },
    { number: 5, name: 'Generation' },
  ];

  return (
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">New Project Configuration</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number
                    ? 'bg-indigo-600 text-white'
                    : canProceedToStep(step.number)
                    ? 'bg-indigo-200 text-indigo-800'
                    : 'bg-slate-300 text-slate-500'
                }`}>
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ${
                    currentStep > step.number ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-8">
        {steps.map((step) => (
          <span key={step.number} className={`text-sm font-medium ${
            currentStep >= step.number ? 'text-indigo-600' : 'text-slate-500'
          }`}>
            {step.name}
          </span>
        ))}
      </div>
    </div>
  );
}
