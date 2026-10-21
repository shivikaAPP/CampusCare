import React, { useState } from 'react';
import { Building2, Sparkles, Shield, User, Lock, Mail, ArrowRight, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const { login, register, loginWithDemo, showToast } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science',
    studentId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
          department: formData.department,
          studentId: formData.studentId,
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setLoading(true);
    setError('');
    try {
      await loginWithDemo(demoRole);
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#070C18]">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
        {/* Left Visual Branding Panel (Hackathon Showcase) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-950/80 via-slate-900/90 to-brand-darker p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-glow-blue">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">CampusCare</h1>
                <p className="text-xs text-blue-300 font-medium">Smart Campus Infrastructure Hub</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                Resolving campus issues with transparency & speed.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                A unified ecosystem connecting students with facility managers, electricians, network engineers, and housekeeping in real time.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Instant Ticket Generation & Live Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Automated Department Dispatch & Workflow</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>End-to-End Status Timeline & Photo Auditing</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Box for Hackathon Reviewers */}
          <div className="mt-8 p-4 rounded-2xl bg-blue-900/20 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Hackathon Instant Login</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-3">
              Click below to test full student and admin workflows without manual signup:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="py-2 px-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 text-xs font-semibold transition-all text-center"
              >
                🎓 Demo Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-2 px-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-semibold transition-all text-center"
              >
                🛡️ Demo Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-brand-dark/70">
          <div className="max-w-md mx-auto w-full">
            {/* Header Tabs (Login / Register) */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isLogin
                    ? 'Enter your campus credentials to access your dashboard'
                    : 'Register to report issues and track resolutions'}
                </p>
              </div>
            </div>

            {/* Role Selector (Student vs Admin) */}
            <div className="mb-6 p-1 rounded-xl bg-slate-900/90 border border-white/10 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                  role === 'student'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Campus Admin</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Alex Rivera"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Department / Major
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {role === 'student' ? 'Student ID' : 'Staff ID'}
                      </label>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        placeholder="e.g. CS-2024-4192"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={
                      role === 'admin' ? 'admin@campuscare.edu' : 'student@campuscare.edu'
                    }
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-glow-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Toggle Login / Register */}
            <div className="mt-6 text-center text-xs text-slate-400">
              {isLogin ? (
                <span>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                    }}
                    className="text-cyan-400 font-semibold hover:underline"
                  >
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                    }}
                    className="text-cyan-400 font-semibold hover:underline"
                  >
                    Sign In instead
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
