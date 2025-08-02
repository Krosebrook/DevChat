import { Bell, User, Zap } from 'lucide-react';
import { websocketManager } from '@/lib/websocket';
import { useState, useEffect } from 'react';

export function Navigation() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(websocketManager.isConnected());
    };

    // Check initial connection
    checkConnection();

    // Check connection every second
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">FlashFusion</span>
            </div>
            <div className="hidden md:flex items-center space-x-1 ml-8">
              <button className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md">
                Dashboard
              </button>
              <button className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md">
                Projects
              </button>
              <button className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md">
                Templates
              </button>
              <button className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md">
                Agents
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* WebSocket Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs text-slate-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-xs text-white rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
