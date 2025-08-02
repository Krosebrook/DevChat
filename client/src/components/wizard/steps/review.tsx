import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, Edit2 } from 'lucide-react';
import { reviewSchema, type ReviewData } from '@shared/schema';
import { useConfigStore } from '@/stores/configStore';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Review() {
  const { 
    review, 
    setReview, 
    setCurrentStep, 
    projectScope, 
    platformSelection, 
    featureConfiguration 
  } = useConfigStore();

  const form = useForm<ReviewData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: review || {
      confirmed: false,
      notes: '',
    },
  });

  const onSubmit = (data: ReviewData) => {
    setReview(data);
    setCurrentStep(5);
  };

  const goBack = () => {
    setCurrentStep(3);
  };

  const editStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Review Your Configuration</h3>
        <p className="text-slate-600">Please review your project configuration before generation</p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Project Scope Review */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Project Scope</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editStep(1)}
              className="flex items-center space-x-1"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-slate-900">Project Name</div>
                <div className="text-sm text-slate-600">{projectScope?.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">Project Type</div>
                <div className="text-sm text-slate-600 capitalize">{projectScope?.projectType}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">Complexity</div>
                <div className="text-sm text-slate-600 capitalize">{projectScope?.complexity}</div>
              </div>
              {projectScope?.description && (
                <div className="col-span-2">
                  <div className="text-sm font-medium text-slate-900">Description</div>
                  <div className="text-sm text-slate-600">{projectScope.description}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platform Selection Review */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Platform & Framework</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editStep(2)}
              className="flex items-center space-x-1"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-slate-900">Platform</div>
                <div className="text-sm text-slate-600 capitalize">{platformSelection?.platform}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">Framework</div>
                <div className="text-sm text-slate-600">{platformSelection?.framework}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Review */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Selected Features</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => editStep(3)}
              className="flex items-center space-x-1"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {featureConfiguration?.features?.map((feature) => (
                <Badge key={feature} variant="secondary" className="flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span className="capitalize">{feature.replace('_', ' ')}</span>
                </Badge>
              ))}
              {(!featureConfiguration?.features || featureConfiguration.features.length === 0) && (
                <div className="text-sm text-slate-500">No additional features selected</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any specific requirements or notes for the generation process..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    I confirm that the configuration is correct
                  </FormLabel>
                  <p className="text-sm text-slate-500">
                    I understand that generating the project will start the AI-powered development process.
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button 
              type="button"
              variant="ghost" 
              onClick={goBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Features</span>
            </Button>
            <Button 
              type="submit" 
              disabled={!form.watch('confirmed')}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <span>Start Generation</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
