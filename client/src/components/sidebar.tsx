export function Sidebar() {
  const stats = [
    { label: 'Total Projects', value: '127' },
    { label: 'Active Deployments', value: '43', color: 'text-emerald-600' },
    { label: 'Security Score', value: '98.5%', color: 'text-emerald-600' },
    { label: 'Uptime', value: '99.97%', color: 'text-emerald-600' },
  ];

  const agents = [
    { name: 'Master Orchestrator', status: 'active' },
    { name: 'Code Generation', status: 'active' },
    { name: 'Security Guardian', status: 'active' },
    { name: 'Quality Engineer', status: 'warning' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-sm text-slate-600">{stat.label}</span>
            <span className={`text-sm font-semibold ${stat.color || 'text-slate-900'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-900 mb-3">Active Agents</h4>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.name} className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                agent.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></div>
              <span className="text-xs text-slate-600">{agent.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
