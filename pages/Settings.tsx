import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../lib/api';
import { QrCode, Shield, CheckCircle2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [mfaSetupData, setMfaSetupData] = useState<{ secret: string, qrCode: string } | null>(null);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const startMfaSetup = async () => {
    try {
      const res = await api.auth.setupMfa();
      setMfaSetupData(res.data);
      setMessage(null);
    } catch (e) {
      console.error(e);
    }
  };

  const confirmMfa = async () => {
    try {
      // The backend expects just verifying logic or a specific enable endpoint.
      // Based on spec: POST /auth/mfa/verify or POST /auth/mfa/disable.
      // Usually setup involves verifying one code to confirm.
      // Assuming verify endpoint works for setup confirmation if authenticated.
      await api.auth.verifyMfa({ token: otp });
      setMfaSetupData(null);
      setMessage("MFA enabled successfully!");
      setOtp('');
    } catch (e) {
        setMessage("Invalid code. Try again.");
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="border-b border-border/50 pb-6">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-secondary mt-1">Manage your account and security preferences.</p>
        </div>

        <div className="grid gap-6 max-w-2xl">
            <Card>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-lg">Account</h3>
                        <p className="text-sm text-secondary">Your personal information</p>
                    </div>
                    <div className="bg-surface border border-border px-3 py-1 rounded-full text-xs font-mono text-secondary">
                        ID: {user?._id.substring(0, 8)}...
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary uppercase tracking-wider">Username</label>
                            <div className="p-3 rounded-lg bg-elevated border border-border text-sm">
                                {user?.username}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary uppercase tracking-wider">Email</label>
                            <div className="p-3 rounded-lg bg-elevated border border-border text-sm">
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                 <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-accent" />
                            Security
                        </h3>
                        <p className="text-sm text-secondary">Two-factor authentication</p>
                    </div>
                </div>

                {!mfaSetupData ? (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-secondary">
                            Add an extra layer of security to your account by enabling MFA.
                        </div>
                        <Button onClick={startMfaSetup} variant="secondary">
                            <QrCode className="w-4 h-4 mr-2" />
                            Setup MFA
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 bg-elevated/50 p-4 rounded-lg border border-border">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="bg-white p-2 rounded-lg">
                                <img src={mfaSetupData.qrCode} alt="MFA QR Code" className="w-32 h-32" />
                            </div>
                            <div className="space-y-4 flex-1">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">1. Scan QR Code</p>
                                    <p className="text-xs text-secondary">Use Google Authenticator or Authy to scan the code.</p>
                                </div>
                                <div className="space-y-2">
                                     <p className="text-sm font-medium">2. Enter Code</p>
                                     <div className="flex gap-2">
                                         <Input 
                                            placeholder="000 000" 
                                            value={otp} 
                                            onChange={(e) => setOtp(e.target.value)} 
                                            className="font-mono text-center tracking-widest"
                                            maxLength={6}
                                         />
                                         <Button onClick={confirmMfa}>Confirm</Button>
                                     </div>
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-secondary"
                            onClick={() => setMfaSetupData(null)}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
                {message && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-accent-green bg-accent-green/10 p-3 rounded-lg">
                        <CheckCircle2 size={16} />
                        {message}
                    </div>
                )}
            </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
