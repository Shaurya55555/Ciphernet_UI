import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: Shield, label: 'Dashboard', path: '/' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col md:flex-row">
      {/* Sidebar / Topbar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-surface p-4 flex flex-col justify-between md:h-screen sticky top-0 z-50">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-black" />
            </div>
            <span className="font-bold text-lg tracking-tight">CipherNet</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-elevated text-white"
                    : "text-secondary hover:text-primary hover:bg-elevated/50"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-4 mt-4 border-t border-border text-xs text-secondary px-3">
          Local access mode
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};
