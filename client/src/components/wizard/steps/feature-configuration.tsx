import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Shield, Database, CreditCard, Zap, BarChart3, Globe } from 'lucide-react';
import { featureConfigurationSchema, type FeatureConfigurationData } from '@shared/schema';
import { useConfigStore } from '@/stores/configStore';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CostEstimation } from '@/components/cost-estimation';

const featureOptions = [
  {
    id: 'authentication',
    name: 'User Authentication',
    description: 'Login, registration, password reset, and user management',
    icon: Shield,
    recommended: true,
  },
  {
    id: 'database',
    name: 'Database Integration',
    description: 'Data storage and management with optimized queries',
    icon: Database,
    recommended: true,
  },
  {
    id: 'payments',
    name: 'Payment Processing',
    description: 'Stripe integration for subscriptions and one-time payments',
    icon: CreditCard,
    recommended: false,
  },
  {
    id: 'realtime',
    name: 'Real-time Features',
    description: 'WebSocket connections for live updates and chat',
    icon: Zap,
    recommended: false,
  },
  {
    id: 'analytics',
    name: 'Analytics & Tracking',
    description: 'User behavior tracking and performance monitoring',
    icon: BarChart3,
    recommended: true,
  },
  {
    id: 'api',
    name: 'REST API',
    description: 'Full REST API with documentation and testing',
    icon: Globe,
    recommended: true,
  },
];

export function FeatureConfiguration() {
  const { featureConfiguration, setFeatureConfiguration, setCurrentStep, platformSelection } = useConfigStore();

  const form = useForm<FeatureConfigurationData>({
    resolver: zodResolver(featureConfigurationSchema),
    defaultValues: featureConfiguration || {
      features: [],
      authentication: false,
      database: false,
      payments: false,
      realtime: false,
      analytics: false,
      api: false,
    },
  });

  const watchedValues = form.watch();
  const selectedFeatures = featureOptions
    .filter(feature => watchedValues[feature.id as keyof FeatureConfigurationData])
    .map(feature => feature.id);

  const onSubmit = (data: FeatureConfigurationData) => {
    const updatedData = {
      ...data,
      features: selectedFeatures,
    };
    setFeatureConfiguration(updatedData);
    setCurrentStep(4);
  };

  const goBack = () => {
    setCurrentStep(2);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Configure Your Features</h3>
        <p className="text-slate-600">Select the features you want to include in your application</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureOptions.map((feature) => {
              const IconComponent = feature.icon;
              
              return (
                <FormField
                  key={feature.id}
                  control={form.control}
                  name={feature.id as keyof FeatureConfigurationData}
                  render={({ field }) => (
                    <FormItem className="p-6 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-3 bg-slate-100 rounded-lg">
                            <IconComponent className="w-6 h-6 text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <FormLabel className="text-base font-semibold text-slate-900 cursor-pointer">
                                {feature.name}
                              </FormLabel>
                              {feature.recommended && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <FormDescription className="text-sm text-slate-500">
                              {feature.description}
                            </FormDescription>
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

          {/* Cost Estimation */}
          {platformSelection && (
            <CostEstimation 
              platform={platformSelection.platform} 
              framework={platformSelection.framework}
              features={selectedFeatures}
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
              <span>Back to Platform Selection</span>
            </Button>
            <Button 
              type="submit" 
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
