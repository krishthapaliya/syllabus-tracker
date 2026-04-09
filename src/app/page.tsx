'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function LandingPage() {
  const router = useRouter();
  const { mode, setMode, colorTheme, setColorTheme, locale, setLocale, t } = useApp();
  
  // Login State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (email === 'admin@college.edu' && password === 'admin123') {
        localStorage.setItem('edu_auth', 'true');
        router.push('/dashboard');
      } else if (localStorage.getItem('edu_auth') === 'true') {
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Use admin@college.edu / admin123');
        setLoading(false);
      }
    }, 600);
  };

  const FEATURES = [
    {
      title: 'Study Materials Hub',
      desc: 'Centralized repository for class notes, slides, and external drive links tailored by subject.',
      icon: 'fa-book-open',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Assignments',
      desc: 'Never miss a baseline with live countdown timers, priority boards, and instant status updates.',
      icon: 'fa-tasks',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Routine Tracking',
      desc: 'Interactive academic calendars visually highlighting midterm, practical, and final exam days.',
      icon: 'fa-calendar-alt',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      title: 'Syllabus Progress',
      desc: 'Visual bar trackers quantifying how far along classes are on their planned reading outlines.',
      icon: 'fa-list-check',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <div className="min-h-screen bg-surface-body text-content-main font-sans selection:bg-brand-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full top-[-10%] left-[-10%] opacity-10 blur-3xl transition-colors duration-1000"
          style={{ background: 'radial-gradient(circle, var(--color-brand-500), transparent)' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bottom-[-10%] right-[-5%] opacity-10 blur-3xl transition-colors duration-1000"
          style={{ background: 'radial-gradient(circle, var(--color-brand-300), transparent)' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-alpha">
            <i className="fas fa-graduation-cap text-white text-lg" />
          </div>
          <span className="font-extrabold text-xl font-mono tracking-tight text-content-main">
            EduPortal
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <a href="#features" className="hidden lg:block text-sm font-semibold text-content-muted hover:text-content-main transition">Features</a>
          
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="w-10 h-10 rounded-xl bg-surface-card border border-boundary-strong text-content-muted hover:text-brand-500 hover:bg-brand-alpha hover:border-brand-strong transition-all flex items-center justify-center shadow-sm"
              title="Page Settings"
            >
              <i className="fas fa-cog" />
            </button>

            {showSettings && (
              <div className="absolute right-0 top-12 w-64 bg-surface-card border border-boundary-subtle rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up p-5 space-y-6">
                <div>
                  <p className="field-label mb-2">Theme Mode</p>
                  <div className="flex bg-surface-input p-1 rounded-xl border border-boundary-subtle">
                    <button onClick={() => setMode('light')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === 'light' ? 'bg-surface-card text-brand-500 shadow-sm border border-boundary-subtle' : 'text-content-muted'}`}>
                      <i className="fas fa-sun" /> Light
                    </button>
                    <button onClick={() => setMode('dark')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === 'dark' ? 'bg-surface-card text-brand-500 shadow-sm border border-boundary-subtle' : 'text-content-muted'}`}>
                      <i className="fas fa-moon" /> Dark
                    </button>
                  </div>
                </div>
                <div>
                  <p className="field-label mb-2">Primary Color</p>
                  <div className="flex items-center gap-2.5">
                    {(['indigo', 'emerald', 'amber', 'rose'] as const).map(color => (
                      <button
                        key={color}
                        onClick={() => setColorTheme(color)}
                        className={`w-7 h-7 rounded-full transition-all ${colorTheme === color ? 'scale-125 ring-2 ring-content-main ring-offset-2 ring-offset-surface-card' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                        style={{ background: color === 'indigo' ? '#6366f1' : color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : '#e11d48' }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="field-label mb-2">Interface Language</p>
                  <select 
                    value={locale} 
                    onChange={(e) => setLocale(e.target.value as any)}
                    className="w-full text-xs input-field py-1.5"
                  >
                    <option value="en">English (US)</option>
                    <option value="ne">नेपाली (NE)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowAdminLogin(true)}
            className="text-xs md:text-sm font-bold text-brand-500 hover:text-brand-600 px-4 py-2.5 rounded-xl bg-brand-alpha border border-brand-strong transition-all shadow-md flex items-center gap-2"
          >
            <i className="fas fa-lock" /> <span className="hidden sm:inline">Admin Login</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-5xl mx-auto animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-boundary-strong text-sm font-semibold text-brand-600 dark:text-brand-400 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Platform is Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-content-main">
          Your College Experience,<br className="hidden md:block" /> 
          <span className="text-brand-500">
            Simplified & Synced
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-content-muted max-w-2xl mb-12 leading-relaxed">
          The all-in-one portal connecting students and educators. Instantly access notes, track overdue assignments, and visualize syllabus progress seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link 
            href="/student/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95 text-center"
          >
            Access Student Portal <i className="fas fa-arrow-right text-sm" />
          </Link>
          <a 
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-card border border-boundary-strong text-content-main font-bold text-lg flex items-center justify-center gap-3 hover:bg-surface-input transition-all text-center"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section id="features" className="relative z-10 bg-surface-card border-y border-boundary-subtle py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-content-main">Everything you need in one place</h2>
            <p className="text-content-muted max-w-xl mx-auto">EduPortal replaces fragmented sheets and drives with a single intuitive interface built beautifully for the modern academic institution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-surface-input border border-boundary-subtle rounded-3xl p-8 hover:-translate-y-1 hover:border-brand-strong hover:shadow-2xl hover:shadow-brand-alpha transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${feature.icon} text-white text-xl`} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-content-main">{feature.title}</h3>
                <p className="text-content-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center border-t border-boundary-subtle bg-surface-body">
        <div className="flex items-center justify-center gap-2 mb-4 text-content-muted">
           <i className="fas fa-graduation-cap text-lg" />
           <span className="font-bold text-lg">EduPortal</span>
        </div>
        <p className="text-xs font-semibold text-content-muted uppercase tracking-widest">Running locally • No backend required</p>
      </footer>

      {/* Admin Login Modal Overlay */}
      <Modal 
        id="login-modal" 
        title="Admin Authentication" 
        icon="fa-shield-alt" 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)}
        size="sm"
      >
        <div className="pt-2">
          <p className="text-content-muted text-sm mb-6">Enter your administrative credentials to manage portal content.</p>

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-content-muted uppercase tracking-wider mb-2">
                <i className="fas fa-envelope mr-1" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@college.edu"
                required
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-content-muted uppercase tracking-wider mb-2">
                <i className="fas fa-lock mr-1" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field w-full pr-12"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-main transition text-sm flex items-center justify-center p-2">
                  <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm animate-shake">
                <i className="fas fa-exclamation-circle flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-brand-alpha hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading
                ? <><i className="fas fa-circle-notch fa-spin" /> Verifying...</>
                : <><span>Secure Login</span><i className="fas fa-arrow-right" /></>}
            </button>
          </form>

          <div className="mt-5 text-center">
             <span className="inline-block px-3 py-1.5 rounded-md bg-surface-input border border-boundary-subtle text-[11px] text-content-muted font-mono">
               Demo: admin@college.edu / admin123
             </span>
          </div>
        </div>
      </Modal>

    </div>
  );
}
