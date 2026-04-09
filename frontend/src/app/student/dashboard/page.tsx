'use client';
import { useApp } from '@/context/AppContext';
import {
  getAssignmentStatus, getCountdownText, getExamCountdownText,
  isExamUpcoming, formatDate
} from '@/lib/utils';
import Link from 'next/link';

export default function StudentDashboardPage() {
  const { subjects, notes, assignments, exams, syllabus, getSubjectById, t } = useApp();

  const upcoming = [...assignments]
    .filter(a => getAssignmentStatus(a) !== 'overdue')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const upcomingExams = [...exams]
    .filter(e => isExamUpcoming(e))
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
    .slice(0, 4);

  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const syllabusProgress = subjects.map(s => {
    const topics = syllabus.filter(t => t.subjectId === s.id);
    const done = topics.filter(t => t.status === 'completed').length;
    const pct = topics.length ? Math.round((done / topics.length) * 100) : 0;
    return { subject: s, total: topics.length, done, pct };
  }).filter(x => x.total > 0).slice(0, 4);

  const stats = [
    { label: t('dashboard.totalNotes' as any) || 'Total Notes',       value: notes.length,       icon: 'fa-book-open',   color: 'from-blue-500 to-cyan-500',    glow: 'shadow-blue-500/20',  text: 'text-blue-500 dark:text-blue-400' },
    { label: t('dashboard.upcomingAssignments' as any) || 'Upcoming Assgn', value: assignments.filter(a => getAssignmentStatus(a) !== 'overdue').length, icon: 'fa-tasks',        color: 'from-purple-500 to-indigo-500', glow: 'shadow-purple-500/20', text: 'text-purple-500 dark:text-purple-400' },
    { label: t('dashboard.upcomingExams' as any) || 'Upcoming Exams',   value: exams.filter(e => isExamUpcoming(e)).length,       icon: 'fa-calendar-alt', color: 'from-orange-500 to-yellow-500', glow: 'shadow-orange-500/20', text: 'text-orange-500 dark:text-orange-400' },
    { label: t('dashboard.syllabusProgress' as any) || 'Syllabus Tracker',    value: syllabus.length,    icon: 'fa-list-check',   color: 'from-green-500 to-teal-500',   glow: 'shadow-green-500/20',  text: 'text-green-500 dark:text-green-400' },
  ];

  const statusMap = {
    overdue: { label: t('status.overdue' as any) || 'Overdue', cls: 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20' },
    'due-soon': { label: t('status.dueSoon' as any) || 'Due Soon', cls: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20' },
    active: { label: t('status.active' as any) || 'Active', cls: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' },
  };

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(s => (
          <div key={s.label} className="relative bg-surface-card border border-boundary-subtle rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg ${s.glow}`}>
              <i className={`fas ${s.icon} text-white text-lg`} />
            </div>
            <p className={`text-3xl font-extrabold ${s.text}`}>{s.value}</p>
            <p className="text-sm text-content-muted mt-1">{s.label}</p>
            <i className={`fas ${s.icon} absolute right-4 bottom-3 text-5xl opacity-[0.03] text-content-muted dark:text-white`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-boundary-subtle rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-boundary-subtle bg-surface-body">
            <h3 className="font-bold flex items-center gap-2 text-sm text-content-main"><i className="fas fa-fire text-orange-500" /> {t('dashboard.upcomingAssignments' as any) || 'Upcoming Assignments'}</h3>
            <Link href="/student/assignments" className="text-xs font-semibold text-brand-500 hover:bg-brand-alpha border border-brand-strong px-3 py-1.5 rounded-lg transition">{t('dashboard.viewAll' as any) || 'View All'}</Link>
          </div>
          <div className="p-3">
            {upcoming.length === 0 ? (
              <p className="text-center text-content-muted text-sm py-8">{t('assignments.empty' as any) || 'No upcoming assignments'}</p>
            ) : upcoming.map(a => {
              const status = getAssignmentStatus(a);
              const sub = getSubjectById(a.subjectId);
              return (
                <div key={a.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-body cursor-default transition">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sub?.color || 'var(--color-brand-500)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-content-main truncate">{a.title}</p>
                    <p className="text-xs text-content-muted">{sub?.name || 'Unknown'} · {formatDate(a.dueDate)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusMap[status].cls}`}>{getCountdownText(a)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface-card border border-boundary-subtle rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-boundary-subtle bg-surface-body">
            <h3 className="font-bold flex items-center gap-2 text-sm text-content-main"><i className="fas fa-calendar-check text-blue-500" /> {t('dashboard.upcomingExams' as any) || 'Upcoming Exams'}</h3>
            <Link href="/student/exams" className="text-xs font-semibold text-brand-500 hover:bg-brand-alpha border border-brand-strong px-3 py-1.5 rounded-lg transition">{t('dashboard.viewAll' as any) || 'View All'}</Link>
          </div>
          <div className="p-3">
            {upcomingExams.length === 0 ? (
              <p className="text-center text-content-muted text-sm py-8">{t('dashboard.upcomingExams' as any) ? 'No upcoming exams' : 'No upcoming exams'}</p>
            ) : upcomingExams.map(e => {
              const sub = getSubjectById(e.subjectId);
              return (
                <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-body cursor-default transition">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sub?.color || 'var(--color-brand-500)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-content-main truncate">{e.title}</p>
                    <p className="text-xs text-content-muted">{sub?.name || 'Unknown'} · {formatDate(e.examDate)} {e.examTime}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">{getExamCountdownText(e)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Similar widget setup... */}

        {/* Syllabus Progress */}
        <div className="bg-surface-card border border-boundary-subtle rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-boundary-subtle bg-surface-body">
            <h3 className="font-bold flex items-center gap-2 text-sm text-content-main"><i className="fas fa-chart-line text-green-500" /> {t('dashboard.syllabusProgress' as any) || 'Syllabus Progress'}</h3>
            <Link href="/student/syllabus" className="text-xs font-semibold text-brand-500 hover:bg-brand-alpha border border-brand-strong px-3 py-1.5 rounded-lg transition">{t('dashboard.viewAll' as any) || 'View All'}</Link>
          </div>
          <div className="p-5 space-y-4">
            {syllabusProgress.length === 0 ? (
              <p className="text-center text-content-muted text-sm py-6">{t('notes.empty' as any) ? 'No syllabus added yet' : 'No syllabus added yet'}</p>
            ) : syllabusProgress.map(({ subject, total, done, pct }) => (
              <div key={subject.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: subject.color }} />
                    <span className="text-sm font-medium text-content-main">{subject.name}</span>
                  </div>
                  <span className="text-xs text-content-muted">{done}/{total} topics · <span className="font-semibold" style={{ color: subject.color }}>{pct}%</span></span>
                </div>
                <div className="h-2 rounded-full bg-boundary-subtle overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: subject.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
