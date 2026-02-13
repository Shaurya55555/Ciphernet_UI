import React from 'react';
import { Power, ShieldCheck, RefreshCw, Lock, Wifi } from 'lucide-react';
import { useVPN } from '../context/VPNContext';
import { ConnectionState } from '../types';
import { cn, formatDuration } from '../lib/utils';

export const ConnectionHero: React.FC = () => {
  const { connectionState, toggleConnection, sessionStats, connectionData, selectedServer, error } = useVPN();

  const isConnected = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;
  const isDisconnecting = connectionState === ConnectionState.DISCONNECTING;

  // Visual state helpers
  const getStatusColor = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED: return 'text-accent-green';
      case ConnectionState.CONNECTING: return 'text-accent-amber';
      case ConnectionState.DISCONNECTING: return 'text-accent-red';
      default: return 'text-secondary';
    }
  };

  const getButtonStyles = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED:
        return 'bg-accent-green hover:bg-accent-green/90 shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)]';
      case ConnectionState.CONNECTING:
      case ConnectionState.DISCONNECTING:
        return 'bg-surface border-2 border-accent-amber animate-pulse';
      default:
        return 'bg-surface border-2 border-border hover:border-primary hover:bg-elevated';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 relative">
      {/* Background Glow Effect */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] transition-all duration-1000 opacity-20 pointer-events-none",
        isConnected ? "bg-accent-green opacity-30" : "bg-transparent"
      )} />

      {/* Status Text */}
      <div className="text-center mb-10 space-y-2 z-10">
        <h2 className={cn("text-sm font-semibold tracking-wider uppercase transition-colors duration-300", getStatusColor())}>
          {connectionState.replace('_', ' ')}
        </h2>
        
        <div className="h-16 flex items-center justify-center">
            {isConnected ? (
                <div className="text-5xl font-bold tabular-nums tracking-tight">
                    {formatDuration(sessionStats.duration)}
                </div>
            ) : (
                <div className="text-4xl font-bold text-muted">
                   {isConnecting ? "Securing..." : "Not Protected"}
                </div>
            )}
        </div>
        
        {isConnected && connectionData && (
             <div className="flex items-center gap-2 text-sm text-secondary bg-surface/50 px-3 py-1 rounded-full border border-border/50 backdrop-blur-sm">
                <Lock size={12} className="text-accent-green"/>
                <span>Encrypted</span>
                <span className="w-1 h-1 bg-border rounded-full mx-1"></span>
                <span className="font-mono">{connectionData.clientIp}</span>
             </div>
        )}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={toggleConnection}
        disabled={isConnecting || isDisconnecting}
        className={cn(
          "relative w-40 h-40 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 z-10",
          getButtonStyles()
        )}
      >
        <div className="relative z-10">
          {isConnecting || isDisconnecting ? (
            <RefreshCw size={48} className={cn("animate-spin", isConnecting ? "text-accent-amber" : "text-accent-red")} />
          ) : isConnected ? (
            <ShieldCheck size={64} className="text-white" />
          ) : (
            <Power size={64} className="text-secondary group-hover:text-primary" />
          )}
        </div>
      </button>

        {/* Server Indicator (if connected or selected) */}
        <div className="mt-10 flex items-center gap-3 z-10">
            {selectedServer ? (
                <div className="flex items-center gap-3 px-4 py-2 bg-surface border border-border rounded-lg shadow-sm">
                    <span className="text-lg">🌍</span>
                    <div className="flex flex-col">
                        <span className="text-xs text-secondary font-medium uppercase">Current Location</span>
                        <span className="text-sm font-semibold text-primary">{selectedServer.location}</span>
                    </div>
                    {isConnected && (
                        <div className="ml-2 w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
                    )}
                </div>
            ) : (
                <div className="text-secondary text-sm">Select a server below</div>
            )}
        </div>
        
        {error && (
            <div className="mt-6 px-4 py-2 bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm rounded-lg animate-fade-in">
                {error}
            </div>
        )}
    </div>
  );
};
