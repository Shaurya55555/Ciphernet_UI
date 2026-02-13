import React from 'react';
import { useVPN } from '../context/VPNContext';
import { Card } from './ui/Card';
import { cn } from '../lib/utils';
import { Signal, SignalMedium, SignalLow } from 'lucide-react';

export const ServerList: React.FC = () => {
  const { servers, selectedServer, setSelectedServer, connectionState } = useVPN();
  const isLocked = connectionState !== 'DISCONNECTED';

  const getLoadIcon = (load: number) => {
    if (load < 50) return <Signal className="text-accent-green" size={16} />;
    if (load < 80) return <SignalMedium className="text-accent-amber" size={16} />;
    return <SignalLow className="text-accent-red" size={16} />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Available Locations</h3>
        <span className="text-xs text-secondary bg-surface px-2 py-1 rounded border border-border">
            {servers.length} Servers
        </span>
      </div>
      
      {servers.length === 0 ? (
          <div className="text-center py-10 text-secondary">
              No servers available. Is the backend running?
          </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => {
          const isSelected = selectedServer?.id === server.id;
          return (
            <button
              key={server.id}
              onClick={() => !isLocked && setSelectedServer(server)}
              disabled={isLocked}
              className={cn(
                "relative group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left outline-none focus-visible:ring-2 ring-accent",
                isSelected
                  ? "bg-elevated border-accent ring-1 ring-accent"
                  : "bg-surface border-border hover:border-gray-600 hover:bg-elevated",
                isLocked && !isSelected && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg bg-black/20",
                    isSelected ? "bg-accent/10" : "bg-black/20"
                )}>
                    {server.countryCode === 'DE' ? '🇩🇪' : server.countryCode === 'GB' ? '🇬🇧' : '🇺🇸'}
                </div>
                <div>
                  <div className="font-medium text-sm text-primary group-hover:text-white transition-colors">
                    {server.location}
                  </div>
                  <div className="text-xs text-secondary mt-0.5">
                    {server.countryCode || 'International'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                 <div className="text-xs text-muted flex items-center gap-1">
                    {server.load}% Load
                    {getLoadIcon(server.load)}
                 </div>
                 {isSelected && (
                     <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Selected</span>
                 )}
              </div>
            </button>
          );
        })}
      </div>
      )}
    </div>
  );
};
