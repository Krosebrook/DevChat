import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { DollarSign, TrendingUp } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CostEstimationProps {
  platform: string;
  framework: string;
  features: string[];
}

export function CostEstimation({ platform, framework, features }: CostEstimationProps) {
  const [costData, setCostData] = useState<any>(null);

  const calculateCostMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/projects/estimate-cost', {
        platform,
        framework,
        features,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCostData(data);
    },
  });

  useEffect(() => {
    if (platform && framework) {
      calculateCostMutation.mutate();
    }
  }, [platform, framework, features]);

  if (!costData) {
    return null;
  }

  const formatCost = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <span>Cost Estimation</span>
          </h4>
          <p className="text-sm text-slate-600 mb-4">Based on your selected platform and framework</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-600 mb-1">Initial Setup</div>
              <div className="text-2xl font-bold text-slate-900">
                {formatCost(costData.estimatedCost)}
              </div>
              <div className="text-xs text-slate-500">One-time development cost</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Monthly Hosting</div>
              <div className="text-2xl font-bold text-slate-900">
                {formatCost(costData.monthlyHostingCost)}
              </div>
              <div className="text-xs text-slate-500">Scalable hosting plans</div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
