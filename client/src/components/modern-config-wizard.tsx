import { useState } from 'react';
import { useConfigStore } from '@/stores/configStore';
import { useProjectStore } from '@/stores/projectStore';
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  Database, 
  Shield, 
  Zap,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Settings,
  Code,
  Layers,
  Target,
  Rocket,
  ArrowRight,
  Plus,
  X,
  Info
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Platform', description: 'Choose your target platform' },
  { id: 2, title: 'Framework', description: 'Select development framework' },
  { id: 3, title: 'Features', description: 'Configure app features' },
  { id: 4, title: 'Database', description: 'Choose data storage' },
  { id: 5, title: 'Deploy', description: 'Deployment settings' }
];

export function ModernConfigWizard() {
  const { 
    currentStep, 
    projectScope,
    platformSelection,
    featureConfiguration,
    projectId,
    setCurrentStep, 
    setProjectScope,
    setPlatformSelection,
    setFeatureConfiguration,
    resetConfiguration 
  } = useConfigStore();
  
  const { addProject } = useProjectStore();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const platforms = [
    {
      id: 'web',
      name: 'Web Application',
      description: 'Progressive web apps with modern frameworks like React, Vue, or Angular',
      icon: <Globe className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Responsive Design', 'PWA Support', 'SEO Optimized', 'Performance Focused'],
      recommended: true
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      description: 'Native iOS and Android applications with cross-platform frameworks',
      icon: <Smartphone className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-500',
      features: ['Native Performance', 'Device Integration', 'App Store Ready', 'Push Notifications']
    },
    {
      id: 'desktop',
      name: 'Desktop Software',
      description: 'Cross-platform desktop applications for Windows, macOS, and Linux',
      icon: <Monitor className="w-8 h-8" />,
      gradient: 'from-green-500 to-emerald-500',
      features: ['Native UI', 'File System Access', 'System Integration', 'Auto Updates']
    }
  ];

  const frameworks = {
    web: [
      { id: 'react', name: 'React', description: 'Popular, component-based library', popularity: 95 },
      { id: 'vue', name: 'Vue.js', description: 'Progressive framework', popularity: 85 },
      { id: 'angular', name: 'Angular', description: 'Full-featured framework', popularity: 75 },
      { id: 'svelte', name: 'Svelte', description: 'Compile-time optimization', popularity: 70 }
    ],
    mobile: [
      { id: 'react-native', name: 'React Native', description: 'Cross-platform with React', popularity: 90 },
      { id: 'flutter', name: 'Flutter', description: 'Google\'s UI toolkit', popularity: 85 },
      { id: 'ionic', name: 'Ionic', description: 'Hybrid app development', popularity: 70 },
      { id: 'xamarin', name: 'Xamarin', description: 'Microsoft\'s solution', popularity: 60 }
    ],
    desktop: [
      { id: 'electron', name: 'Electron', description: 'Web technologies for desktop', popularity: 85 },
      { id: 'tauri', name: 'Tauri', description: 'Rust-based lightweight', popularity: 75 },
      { id: 'flutter-desktop', name: 'Flutter Desktop', description: 'Flutter for desktop', popularity: 70 },
      { id: 'qt', name: 'Qt', description: 'Cross-platform C++ framework', popularity: 65 }
    ]
  };

  const features = [
    { id: 'auth', name: 'Authentication', description: 'User login and registration', icon: <Shield className="w-5 h-5" /> },
    { id: 'database', name: 'Database Integration', description: 'Data storage and management', icon: <Database className="w-5 h-5" /> },
    { id: 'api', name: 'REST API', description: 'Backend API endpoints', icon: <Code className="w-5 h-5" /> },
    { id: 'realtime', name: 'Real-time Updates', description: 'WebSocket connectivity', icon: <Zap className="w-5 h-5" /> },
    { id: 'payments', name: 'Payment Processing', description: 'Stripe, PayPal integration', icon: <Target className="w-5 h-5" /> },
    { id: 'analytics', name: 'Analytics', description: 'User behavior tracking', icon: <Layers className="w-5 h-5" /> },
    { id: 'notifications', name: 'Push Notifications', description: 'Engage users with alerts', icon: <Info className="w-5 h-5" /> },
    { id: 'social', name: 'Social Login', description: 'OAuth with Google, GitHub', icon: <Settings className="w-5 h-5" /> }
  ];

  const databases = [
    { id: 'postgresql', name: 'PostgreSQL', description: 'Powerful relational database', type: 'SQL' },
    { id: 'mongodb', name: 'MongoDB', description: 'Flexible document database', type: 'NoSQL' },
    { id: 'mysql', name: 'MySQL', description: 'Popular relational database', type: 'SQL' },
    { id: 'firebase', name: 'Firebase', description: 'Google\'s backend platform', type: 'BaaS' },
    { id: 'supabase', name: 'Supabase', description: 'Open source Firebase alternative', type: 'BaaS' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = async () => {
    setIsCreatingProject(true);
    try {
      // Simulate project creation
      const newProject = {
        id: Date.now().toString(),
        name: projectName || 'Untitled Project',
        description: projectDescription || 'A new FlashFusion project',
        platform: platformSelection?.platform || 'web',
        framework: platformSelection?.framework || 'react',
        features: featureConfiguration?.features || [],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      addProject(newProject);
      resetConfiguration();
      
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Platform</h2>
              <p className="text-gray-600">Select the platform for your application</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {platforms.map((platform) => (
                <div 
                  key={platform.id}
                  onClick={() => setProjectScope({ platform: platform.id })}
                  className={`relative cursor-pointer group ${
                    projectScope?.platform === platform.id 
                      ? 'ring-2 ring-orange-500 ring-offset-2' 
                      : 'hover:shadow-lg'
                  } bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1`}
                >
                  {platform.recommended && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Recommended
                    </div>
                  )}
                  <div className={`w-16 h-16 bg-gradient-to-br ${platform.gradient} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {platform.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{platform.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{platform.description}</p>
                  <div className="space-y-1">
                    {platform.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        const selectedPlatform = projectScope?.platform || 'web';
        const availableFrameworks = frameworks[selectedPlatform as keyof typeof frameworks] || [];
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Framework</h2>
              <p className="text-gray-600">Choose the development framework for your {selectedPlatform} application</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableFrameworks.map((framework) => (
                <div 
                  key={framework.id}
                  onClick={() => setPlatformSelection({ 
                    platform: selectedPlatform, 
                    framework: framework.id 
                  })}
                  className={`cursor-pointer group ${
                    platformSelection?.framework === framework.id 
                      ? 'ring-2 ring-orange-500 ring-offset-2' 
                      : 'hover:shadow-lg'
                  } bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: `${framework.popularity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{framework.popularity}%</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{framework.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Features</h2>
              <p className="text-gray-600">Select the features you want to include in your application</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => {
                const selectedFeatures = featureConfiguration?.features || [];
                const isSelected = selectedFeatures.includes(feature.id);
                return (
                  <div 
                    key={feature.id}
                    onClick={() => {
                      const newFeatures = isSelected
                        ? selectedFeatures.filter((f: string) => f !== feature.id)
                        : [...selectedFeatures, feature.id];
                      setFeatureConfiguration({ features: newFeatures });
                    }}
                    className={`cursor-pointer group ${
                      isSelected 
                        ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-500' 
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    } rounded-xl p-4 border transition-all duration-200`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 ${
                        isSelected 
                          ? 'bg-orange-500 border-orange-500' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {isSelected && <div className="w-3 h-3 bg-white rounded-sm"></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Database</h2>
              <p className="text-gray-600">Select the database for your application</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {databases.map((database) => (
                <div 
                  key={database.id}
                  onClick={() => console.log('Database selected:', database.id)}
                  className="cursor-pointer group hover:shadow-lg bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{database.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        database.type === 'SQL' ? 'bg-blue-100 text-blue-600' :
                        database.type === 'NoSQL' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {database.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{database.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Configuration</h2>
              <p className="text-gray-600">Review your settings and create your project</p>
            </div>
            
            {/* Project Name Input */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Configuration Summary */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Platform</label>
                  <p className="text-gray-900 capitalize">{projectScope?.platform || 'Not selected'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Framework</label>
                  <p className="text-gray-900">{platformSelection?.framework || 'Not selected'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Features</label>
                  <p className="text-gray-900">{featureConfiguration?.features?.length || 0} selected</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-gray-900">Ready to create</p>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-900">Advanced Options</span>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`} />
              </button>
              {showAdvanced && (
                <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your project"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Project Configuration</h1>
          <button 
            onClick={resetConfiguration}
            className="text-white/80 hover:text-white transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step.id === currentStep 
                  ? 'bg-white text-orange-500' 
                  : step.id < currentStep 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-white/60'
              }`}>
                {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step.id < currentStep ? 'bg-white/20' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="text-sm text-white/80">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-8">
        {renderStepContent()}
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-50 px-8 py-6 flex items-center justify-between border-t border-gray-100">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            currentStep === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <div className="text-sm text-gray-500">
          {currentStep} of {steps.length}
        </div>

        {currentStep === steps.length ? (
          <button
            onClick={handleCreateProject}
            disabled={!projectName || isCreatingProject}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Rocket className="w-5 h-5" />
            <span>{isCreatingProject ? 'Creating...' : 'Create Project'}</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}