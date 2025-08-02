import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Globe, Smartphone, Monitor, Play, Box, Sparkles, Target, Shield } from 'lucide-react';
import { platformSelectionSchema, type PlatformSelectionData } from '@shared/schema';
import { useConfigStore } from '@/stores/configStore';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CostEstimation } from '@/components/cost-estimation';
import { useState } from 'react';

const platformOptions = {
  web: {
    icon: Globe,
    title: 'Web Applications',
    description: 'Build for browsers with modern web frameworks',
    frameworks: [
      { id: 'react', name: 'React', icon: Play, description: 'Modern frontend library', badges: ['Popular', 'Fast Setup'] },
      { id: 'nextjs', name: 'Next.js', icon: Box, description: 'React framework for production', badges: ['SSR/SSG', 'SEO Ready'] },
      { id: 'svelte', name: 'Svelte', icon: Sparkles, description: 'Cybernetically enhanced web apps', badges: ['Compact', 'Fast'] },
    ]
  },
  mobile: {
    icon: Smartphone,
    title: 'Mobile Applications',
    description: 'Create native-like experiences for iOS and Android',
    frameworks: [
      { id: 'react-native', name: 'React Native', icon: Smartphone, description: 'JavaScript framework for native apps', badges: ['Cross-Platform', 'Hot Reload'] },
      { id: 'flutter', name: 'Flutter', icon: Target, description: 'Google\'s UI toolkit for native apps', badges: ['Native Performance', 'Single Codebase'] },
    ]
  },
  desktop: {
    icon: Monitor,
    title: 'Desktop Applications',
    description: 'Cross-platform desktop applications',
    frameworks: [
      { id: 'electron', name: 'Electron', icon: Monitor, description: 'Build with web technologies', badges: ['Familiar Stack', 'Rich Ecosystem'] },
      { id: 'tauri', name: 'Tauri', icon: Shield, description: 'Secure, lightweight desktop apps', badges: ['Lightweight', 'Secure'] },
    ]
  }
};

export function PlatformSelection() {
  const { platformSelection, setPlatformSelection, setCurrentStep, projectScope } = useConfigStore();
  const [selectedPlatform, setSelectedPlatform] = useState<string>(platformSelection?.platform || 'web');
  const [selectedFramework, setSelectedFramework] = useState<string>(platformSelection?.framework || '');

  const form = useForm<PlatformSelectionData>({
    resolver: zodResolver(platformSelectionSchema),
    defaultValues: platformSelection || {
      platform: 'web',
      framework: '',
      deployment: [],
    },
  });

  const onSubmit = (data: PlatformSelectionData) => {
    setPlatformSelection(data);
    setCurrentStep(3);
  };

  const goBack = () => {
    setCurrentStep(1);
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setSelectedFramework('');
    form.setValue('platform', platform as any);
    form.setValue('framework', '');
  };

  const handleFrameworkSelect = (framework: string) => {
    setSelectedFramework(framework);
    form.setValue('framework', framework);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Choose Your Platform & Framework</h3>
        <p className="text-slate-600">Select the target platform and framework for your application</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Platform Categories */}
          <div className="space-y-8">
            {Object.entries(platformOptions).map(([platformKey, platform]) => {
              const IconComponent = platform.icon;
              const isSelected = selectedPlatform === platformKey;
              
              return (
                <div key={platformKey}>
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                    <IconComponent className="w-5 h-5 text-indigo-600" />
                    <span>{platform.title}</span>
                  </h4>
                  <p className="text-sm text-slate-500 mb-4">{platform.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platform.frameworks.map((framework) => {
                      const FrameworkIcon = framework.icon;
                      const isFrameworkSelected = selectedFramework === framework.id;
                      
                      return (
                        <button
                          key={framework.id}
                          type="button"
                          onClick={() => {
                            handlePlatformChange(platformKey);
                            handleFrameworkSelect(framework.id);
                          }}
                          className={`p-6 rounded-xl text-left border-2 transition-all hover:shadow-lg ${
                            isFrameworkSelected 
                              ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                              : 'border-slate-200 hover:border-indigo-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${
                              isFrameworkSelected 
                                ? 'bg-indigo-100 text-indigo-600' 
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              <FrameworkIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-lg text-slate-900">{framework.name}</h5>
                              <p className="text-sm text-slate-500">{framework.description}</p>
                              <div className="mt-2 flex items-center space-x-2">
                                {framework.badges.map((badge, index) => (
                                  <span 
                                    key={index}
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      index === 0 
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : index === 1
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-purple-100 text-purple-700'
                                    }`}
                                  >
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cost Estimation */}
          {selectedFramework && (
            <CostEstimation 
              platform={selectedPlatform} 
              framework={selectedFramework}
              features={[]}
            />
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button 
              type="button"
              variant="ghost" 
              onClick={goBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Project Scope</span>
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedFramework}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <span>Continue to Features</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
