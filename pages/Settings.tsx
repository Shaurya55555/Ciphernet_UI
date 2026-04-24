import React from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Bell, Database, Shield } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="border-b border-border/50 pb-6">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-secondary mt-1">Manage app preferences for this device.</p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          <Card>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-elevated border border-border">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Access</h3>
                <p className="text-sm text-secondary mt-1">
                  Authentication is disabled while the UI is running in local access mode.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-elevated border border-border">
                <Database className="w-5 h-5 text-accent-green" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Connection Data</h3>
                <p className="text-sm text-secondary mt-1">
                  Server list and VPN status are loaded directly from the configured backend.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-elevated border border-border">
                <Bell className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Notifications</h3>
                <p className="text-sm text-secondary mt-1">
                  Connection errors and status changes appear inside the dashboard.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
