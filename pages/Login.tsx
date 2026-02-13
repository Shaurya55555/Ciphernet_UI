import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    otp: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | undefined>(undefined);

  const { login, register, verifyMfa } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mfaRequired) {
          await verifyMfa(formData.otp, tempUserId);
          navigate('/');
      } else if (isLogin) {
        const res = await login({ emailOrUsername: formData.email, password: formData.password });
        if (res.status === 'mfa_required') {
            setMfaRequired(true);
            setTempUserId(res.userId);
        } else {
            navigate('/');
        }
      } else {
        await register({ username: formData.username, email: formData.email, password: formData.password });
        setIsLogin(true);
        setError("Account created! Please log in."); // Using error state for success message temporarily or need separate state
        setFormData({ ...formData, password: '' });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white mb-4">
            <div className="w-6 h-6 rounded-full bg-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {mfaRequired ? 'Two-Factor Authentication' : isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-secondary text-sm">
            {mfaRequired 
                ? 'Enter the code from your authenticator app.' 
                : isLogin 
                    ? 'Enter your credentials to access the secure network.' 
                    : 'Get started with a secure, private connection.'}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mfaRequired ? (
                <Input
                    name="otp"
                    placeholder="000000"
                    value={formData.otp}
                    onChange={handleChange}
                    className="text-center tracking-[0.5em] text-lg font-mono"
                    autoFocus
                    maxLength={6}
                />
            ) : (
                <>
                    {!isLogin && (
                    <Input
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    )}
                    <Input
                    name="email"
                    type={isLogin ? "text" : "email"}
                    placeholder={isLogin ? "Email or Username" : "Email address"}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                    <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                </>
            )}

            {error && (
              <div className={isLogin && !error.includes('created') ? "text-accent-red text-xs text-center" : "text-accent-green text-xs text-center"}>
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {mfaRequired ? 'Verify Code' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

            {!mfaRequired && (
                <div className="mt-6 text-center">
                    <button
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setError(null); }}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                    >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            )}
            
            {mfaRequired && (
                <div className="mt-6 text-center">
                    <button onClick={() => setMfaRequired(false)} className="text-sm text-secondary hover:text-primary">
                        Back to login
                    </button>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default Login;
