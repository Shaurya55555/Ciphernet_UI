import React from 'react';
import { Layout } from '../components/Layout';
import { ConnectionHero } from '../components/ConnectionHero';
import { ServerList } from '../components/ServerList';
import { useVPN } from '../context/VPNContext';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatBytes } from '../lib/utils';
import { ConnectionState } from '../types';

const Dashboard: React.FC = () => {
    // Mock random stats updates for visual flair if connected
    const { connectionState } = useVPN();
    const isConnected = connectionState === ConnectionState.CONNECTED;

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border/50">
           <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
           <div className="flex gap-4">
             <div className="flex items-center gap-2 text-sm text-secondary">
                <ArrowDownCircle size={16} className={isConnected ? "text-accent-green" : "text-muted"} />
                <span className="font-mono">{isConnected ? formatBytes(124500000) : '--'}</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-secondary">
                <ArrowUpCircle size={16} className={isConnected ? "text-accent" : "text-muted"} />
                <span className="font-mono">{isConnected ? formatBytes(45000000) : '--'}</span>
             </div>
           </div>
        </div>

        {/* Hero Section */}
        <ConnectionHero />

        {/* Servers Section */}
        <div className="pt-8">
            <ServerList />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
