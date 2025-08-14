import { 
  BarChart3, 
  Shield, 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Users,
  Globe,
  Server,
  Database
} from 'lucide-react';

export function ModernSidebar() {
  const stats = [
    { 
      label: 'Total Projects', 
      value: '127', 
      change: '+12%',
      trend: 'up',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Active Deployments', 
      value: '43', 
      change: '+5%',
      trend: 'up',
      icon: <Globe className="w-4 h-4" />,
      color: 'text-green-600', 
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Security Score', 
      value: '98.5%', 
      change: '+0.3%',
      trend: 'up',
      icon: <Shield className="w-4 h-4" />,
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50'
    },
    { 
      label: 'Uptime', 
      value: '99.97%', 
      change: 'Stable',
      trend: 'stable',
      icon: <Activity className="w-4 h-4" />,
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50'
    },
  ];

  const agents = [
    { 
      name: 'Master Orchestrator', 
      status: 'active', 
      uptime: '99.9%',
      tasks: 847,
      icon: <Zap className="w-4 h-4" />
    },
    { 
      name: 'Code Generation', 
      status: 'active', 
      uptime: '98.7%',
      tasks: 1203,
      icon: <Activity className="w-4 h-4" />
    },
    { 
      name: 'Security Guardian', 
      status: 'active', 
      uptime: '100%',
      tasks: 432,
      icon: <Shield className="w-4 h-4" />
    },
    { 
      name: 'Quality Engineer', 
      status: 'warning', 
      uptime: '96.2%',
      tasks: 289,
      icon: <CheckCircle className="w-4 h-4" />
    },
  ];

  const recentActivity = [
    {
      action: 'Project deployed',
      project: 'E-commerce App',
      time: '2 min ago',
      status: 'success'
    },
    {
      action: 'Security scan completed',
      project: 'Portfolio Site',
      time: '15 min ago',
      status: 'info'
    },
    {
      action: 'Build failed',
      project: 'Mobile Dashboard',
      time: '1 hour ago',
      status: 'error'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            View Details
          </button>
        </div>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="group hover:bg-gray-50 rounded-xl p-3 -mx-3 transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center space-x-1 text-xs font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Agents Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">AI Agents</h4>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">4 Active</span>
          </div>
        </div>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.name} className="group hover:bg-gray-50 rounded-xl p-3 -mx-3 transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    agent.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {agent.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>Uptime: {agent.uptime}</span>
                      <span>•</span>
                      <span>{agent.tasks} tasks</span>
                    </div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium text-center">
          Manage Agents
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Recent Activity</h4>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.project}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium text-center">
          View All Activity
        </button>
      </div>

      {/* System Health */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-green-900">System Health</h4>
            <p className="text-sm text-green-600">All systems operational</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-green-900">99.97%</div>
            <div className="text-xs text-green-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-900">43ms</div>
            <div className="text-xs text-green-600">Response</div>
          </div>
        </div>
      </div>
    </div>
  );
}