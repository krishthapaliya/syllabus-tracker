'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getAssignmentStatus, getExamCountdownText, isExamUpcoming, formatDate } from '@/lib/utils';
import { ThemeMode, ColorTheme } from '@/context/AppContext'; 
import { Locale } from '@/lib/i18n';
import { TRANSLATIONS } from '@/lib/i18n';

interface Props {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, subtitle, onMenuClick }: Props) {
  const { assignments, exams, getSubjectById, t, mode, setMode, colorTheme, setColorTheme, secondaryTheme, setSecondaryTheme, locale, setLocale } = useApp();
  const [time, setTime] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : locale === 'fr' ? 'fr-FR' : 'ne-NP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [locale]);

  const overdueAssignments = assignments.filter(a => getAssignmentStatus(a) === 'overdue');
  const dueSoonAssignments = assignments.filter(a => getAssignmentStatus(a) === 'due-soon');
  const upcomingExams = exams.filter(e => isExamUpcoming(e)).slice(0, 3);
  const notifCount = overdueAssignments.length + dueSoonAssignments.length;

  return (
    <header className="h-[70px] bg-surface-body border-b border-boundary-subtle flex items-center justify-between px-7 sticky top-0 z-30 backdrop-blur-xl flex-shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="w-9 h-9 rounded-lg bg-surface-card border border-boundary-subtle text-content-muted hover:text-brand-500 hover:bg-brand-alpha hover:border-brand-strong flex items-center justify-center transition-all"
        >
          <i className="fas fa-bars text-sm" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-content-main leading-tight">{title}</h2>
          <p className="text-xs text-content-muted">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-boundary-subtle text-xs text-content-muted font-mono tabular-nums">
          <i className="fas fa-clock text-brand-500" />
          {time}
        </div>

        {/* Settings Toggle */}
        <div className="relative">
          <button
            onClick={() => { setShowSettings(p => !p); setShowNotif(false); }}
            className="w-9 h-9 rounded-lg bg-surface-card border border-boundary-subtle text-content-muted hover:text-brand-500 hover:bg-brand-alpha hover:border-brand-strong flex items-center justify-center transition-all"
            title={t('settings.title')}
          >
            <i className="fas fa-cog text-sm" />
          </button>

          {showSettings && (
            <div className="absolute right-0 top-12 w-64 bg-surface-card border border-boundary-subtle rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up p-4 space-y-5">
              
              <div>
                <p className="field-label mb-2">{t('settings.theme' as any) || 'Theme Mode'}</p>
                <div className="flex bg-surface-input p-1 rounded-lg border border-boundary-subtle">
                  <button onClick={() => setMode('light')} className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all ${mode === 'light' ? 'bg-surface-card text-brand-500 shadow-sm border border-boundary-subtle' : 'text-content-muted hover:text-content-main'}`}>
                    <i className="fas fa-sun" /> Light
                  </button>
                  <button onClick={() => setMode('dark')} className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all ${mode === 'dark' ? 'bg-surface-card text-brand-500 shadow-sm border border-boundary-subtle' : 'text-content-muted hover:text-content-main'}`}>
                    <i className="fas fa-moon" /> Dark
                  </button>
                </div>
              </div>

              <div>
                <p className="field-label mb-2">{t('settings.color' as any) || 'Primary Color'}</p>
                <div className="flex items-center gap-2">
                  {(['indigo', 'emerald', 'amber', 'rose'] as const).map(color => (
                    <button
                      key={color}
                      onClick={() => setColorTheme(color)}
                      className={`w-6 h-6 rounded-full transition-all ${colorTheme === color ? 'scale-125 ring-2 ring-content-main ring-offset-2 ring-offset-surface-card' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                      style={{ 
                        background: color === 'indigo' ? '#6366f1' : color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : '#e11d48'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="field-label mb-2">{t('settings.secondaryColor' as any) || 'Secondary Color'}</p>
                <div className="flex items-center gap-2">
                  {(['indigo', 'emerald', 'amber', 'rose'] as const).map(color => (
                    <button
                      key={`sec-${color}`}
                      onClick={() => setSecondaryTheme(color)}
                      className={`w-6 h-6 rounded-full transition-all ${secondaryTheme === color ? 'scale-125 ring-2 ring-content-main ring-offset-2 ring-offset-surface-card' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                      style={{ 
                        background: color === 'indigo' ? '#6366f1' : color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : '#e11d48'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="field-label mb-2">{t('settings.language' as any) || 'Language'}</p>
                <select 
                  value={locale} 
                  onChange={(e) => setLocale(e.target.value as any)}
                  className="w-full text-xs input-field py-1.5"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="ne">नेपाली (NE)</option>
                </select>
              </div>

            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(p => !p); setShowSettings(false); }}
            className="w-9 h-9 rounded-lg bg-surface-card border border-boundary-subtle text-content-muted hover:text-brand-500 hover:bg-brand-alpha hover:border-brand-strong flex items-center justify-center transition-all relative"
          >
            <i className="fas fa-bell text-sm" />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-body" />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-surface-card border border-boundary-subtle rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
              <div className="px-4 py-3 border-b border-boundary-subtle font-semibold text-sm text-content-main">
                Notifications {notifCount > 0 && <span className="ml-2 text-xs text-red-500">({notifCount})</span>}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {overdueAssignments.length === 0 && dueSoonAssignments.length === 0 && upcomingExams.length === 0 ? (
                  <p className="text-center text-content-muted text-sm py-8">No notifications</p>
                ) : (
                  <>
                    {overdueAssignments.map(a => (
                      <div key={a.id} className="flex items-start gap-3 px-4 py-3 border-b border-boundary-subtle hover:bg-boundary-subtle cursor-default">
                        <div className="mt-0.5 w-7 h-7 rounded-lg bg-red-500 border border-red-500/20 text-white flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-exclamation-circle text-xs" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-content-main">{a.title}</p>
                          <p className="text-xs text-red-500 mt-0.5">Overdue — {formatDate(a.dueDate)}</p>
                        </div>
                      </div>
                    ))}
                    {dueSoonAssignments.map(a => (
                      <div key={a.id} className="flex items-start gap-3 px-4 py-3 border-b border-boundary-subtle hover:bg-boundary-subtle cursor-default">
                        <div className="mt-0.5 w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-clock text-xs" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-content-main">{a.title}</p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">Due Soon — {formatDate(a.dueDate)}</p>
                        </div>
                      </div>
                    ))}
                    {upcomingExams.map(e => (
                      <div key={e.id} className="flex items-start gap-3 px-4 py-3 border-b border-boundary-subtle hover:bg-boundary-subtle cursor-default">
                        <div className="mt-0.5 w-7 h-7 rounded-lg bg-brand-alpha text-brand-500 border border-brand-strong flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-calendar-alt text-xs" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-content-main">{e.title}</p>
                          <p className="text-xs text-brand-500 mt-0.5">{getExamCountdownText(e)} — {formatDate(e.examDate)}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {(showNotif || showSettings) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowNotif(false); setShowSettings(false); }} />
      )}
    </header>
  );
}
