import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { projectScopeSchema, type ProjectScopeData } from '@shared/schema';
import { useConfigStore } from '@/stores/configStore';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function ProjectScope() {
  const { projectScope, setProjectScope, setCurrentStep } = useConfigStore();

  const form = useForm<ProjectScopeData>({
    resolver: zodResolver(projectScopeSchema),
    defaultValues: projectScope || {
      name: '',
      description: '',
      projectType: 'web',
      complexity: 'medium',
    },
  });

  const onSubmit = (data: ProjectScopeData) => {
    setProjectScope(data);
    setCurrentStep(2);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Define Your Project Scope</h3>
        <p className="text-slate-600">Let's start by understanding what you want to build</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your project name" 
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what your application will do"
                    rows={3}
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50">
                      <RadioGroupItem value="web" id="web" />
                      <label htmlFor="web" className="flex-1 cursor-pointer">
                        <div className="font-medium">Web Application</div>
                        <div className="text-sm text-slate-500">Browser-based application</div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <label htmlFor="mobile" className="flex-1 cursor-pointer">
                        <div className="font-medium">Mobile Application</div>
                        <div className="text-sm text-slate-500">iOS and Android apps</div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50">
                      <RadioGroupItem value="desktop" id="desktop" />
                      <label htmlFor="desktop" className="flex-1 cursor-pointer">
                        <div className="font-medium">Desktop Application</div>
                        <div className="text-sm text-slate-500">Cross-platform desktop</div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50">
                      <RadioGroupItem value="fullstack" id="fullstack" />
                      <label htmlFor="fullstack" className="flex-1 cursor-pointer">
                        <div className="font-medium">Full-Stack Application</div>
                        <div className="text-sm text-slate-500">Frontend + Backend + Database</div>
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Complexity</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple - Basic functionality, minimal features</SelectItem>
                      <SelectItem value="medium">Medium - Standard features, moderate complexity</SelectItem>
                      <SelectItem value="complex">Complex - Advanced features, enterprise-level</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <span>Continue to Platform Selection</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
