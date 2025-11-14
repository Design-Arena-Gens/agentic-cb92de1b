'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleAuthSuccess = (authToken: string) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (token) {
    return <Dashboard token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Image Generator</h1>
          <p className="text-indigo-100">Create stunning images with AI</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex mb-6 border-b">
            <button
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                isLogin
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                !isLogin
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <RegisterForm onSuccess={handleAuthSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
