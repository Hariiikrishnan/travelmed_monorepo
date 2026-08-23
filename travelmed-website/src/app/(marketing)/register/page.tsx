'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Lock, Mail, ShieldAlert, Eye, EyeOff, User, LogIn } from 'lucide-react';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('travelmed_client_token');
    if (token) {
      router.push(redirect);
    }
  }, [router, redirect]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setError('');

    try {
      // 1. Submit Registration
      const regResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const regBody = await regResponse.json();

      if (!regResponse.ok) {
        throw new Error(regBody.message || 'Registration failed. User may already exist.');
      }

      // 2. Perform Automatic Login
      const logResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const logBody = await logResponse.json();

      if (!logResponse.ok) {
        throw new Error(logBody.message || 'Login failed following registration.');
      }

      // Store token and redirect back
      localStorage.setItem('travelmed_client_token', logBody.data.token);
      localStorage.setItem('travelmed_client_name', logBody.data.user.name);
      router.push(redirect);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 justify-center items-center p-6 relative overflow-hidden font-sans min-h-[75vh]">
      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Badge variant="primary" className="bg-blue-50 dark:bg-neutral-900 border border-blue-100 dark:border-neutral-800 text-blue-600 dark:text-blue-400 font-bold py-1 px-3">
            Join TravelMed
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-heading">
            Create Customer Account
          </h1>
          <p className="text-xs text-neutral-450 font-medium">
            Register to customize medical kits and access 24/7 teleconsultations.
          </p>
        </div>

        <Card hoverEffect={false} className="p-8 bg-white dark:bg-neutral-900 border border-blue-50 dark:border-neutral-800 shadow-xl rounded-3xl">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-xs text-red-650 dark:text-red-400 flex items-start gap-2.5 font-medium">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 pl-9 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-neutral-900 transition font-medium text-neutral-800 dark:text-neutral-100"
                />
                <User className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 pl-9 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-neutral-900 transition font-medium text-neutral-800 dark:text-neutral-100"
                />
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                Choose Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 pl-9 pr-9 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-neutral-900 transition font-medium text-neutral-800 dark:text-neutral-100"
                />
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-350 cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? 'Creating Profile...' : 'Complete Sign Up'}
            </Button>
          </form>

          <div className="pt-5 border-t border-neutral-100 dark:border-neutral-800/60 mt-5 text-center text-xs">
            <span className="text-neutral-400">Already have an account? </span>
            <Link 
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-primary hover:underline font-bold inline-flex items-center gap-1"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Log In instead</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ClientRegisterPage() {
  return (
    <React.Suspense fallback={
      <div className="flex bg-neutral-50 dark:bg-neutral-950 py-16 justify-center items-center p-6 min-h-[75vh]">
        <div className="text-center font-bold text-neutral-500">Loading Secure Portal...</div>
      </div>
    }>
      <RegisterContent />
    </React.Suspense>
  );
}
