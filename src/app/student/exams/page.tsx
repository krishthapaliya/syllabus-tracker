'use client';
import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';
import { formatDate, isExamUpcoming, getExamCountdownText, EXAM_TYPE_LABELS } from '@/lib/utils';
import { Exam } from '@/lib/types';

const TYPE_COLORS: Record<string, string> = {
  midterm:'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  final:'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20',
  quiz:'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  practical:'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  internal:'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
};

export default function StudentExamsPage() {
  const { subjects, exams, getSubjectById, t } = useApp();
  const [viewExam, setViewExam] = useState<Exam | null>(null);
  const [search, setSearch] = useState('');
  const [filterSub, setFilterSub] = useState('');
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  const filtered = exams.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.title.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q);
    const matchS = !filterSub || e.subjectId === filterSub;
    return matchQ && matchS;
  }).sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  // Calendar logic
  const examDates = useMemo(() => {
    const set = new Set<string>();
    exams.forEach(e => set.add(e.examDate));
    return set;
  }, [exams]);

  const calDays = useMemo(() => {
    const days: { date: number; month: number; year: number; isOther: boolean }[] = [];
    const first = new Date(calYear, calMonth, 1);
    const last  = new Date(calYear, calMonth + 1, 0);
    const startDay = first.getDay(); // 0=Sun
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(calYear, calMonth, -i);
      days.push({ date: d.getDate(), month: d.getMonth(), year: d.getFullYear(), isOther: true });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      days.push({ date: d, month: calMonth, year: calYear, isOther: false });
    }
    const rem = 7 - (days.length % 7);
    if (rem < 7) for (let d = 1; d <= rem; d++) {
      days.push({ date: d, month: calMonth + 1, year: calYear, isOther: true });
    }
    return days;
  }, [calYear, calMonth]);

  const today = new Date();
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left: Exam list */}
      <div className="flex-1 min-w-0 w-full">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-3 flex-1">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exams or venues..." className="input-field flex-1 min-w-[160px] max-w-sm" />
            <select value={filterSub} onChange={e => setFilterSub(e.target.value)} className="input-field">
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-card w-full">
            <i className="fas fa-calendar-alt text-4xl opacity-20 mb-3" />
            <p className="text-content-muted">{exams.length === 0 ? 'No exams scheduled.' : 'No exams match your search.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filtered.map(e => {
              const sub = getSubjectById(e.subjectId);
              const upcoming = isExamUpcoming(e);
              return (
                <div key={e.id} onClick={() => setViewExam(e)} className="group bg-surface-card border border-boundary-subtle rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:border-brand-strong transition-all relative overflow-hidden cursor-pointer">
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: sub?.color||'var(--color-brand-500)' }} />
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:(sub?.color||'#6366f1')+'20', color:sub?.color||'var(--color-brand-500)' }}>
                        {sub?.name||'Unknown'}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[e.examType]}`}>
                        {EXAM_TYPE_LABELS[e.examType]}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-content-main mb-3 leading-snug truncate">{e.title}</h3>

                  <div className="grid grid-cols-2 gap-y-2 text-xs text-content-muted mb-3 flex-1">
                    <span><i className="fas fa-calendar-alt mr-1.5 text-brand-500" />{formatDate(e.examDate)}</span>
                    <span><i className="fas fa-clock mr-1.5 text-brand-500" />{e.examTime}</span>
                    {e.duration && <span><i className="fas fa-hourglass-half mr-1.5 text-brand-500" />{e.duration} min</span>}
                    {e.venue && <span className="truncate"><i className="fas fa-map-marker-alt mr-1.5 text-brand-500" />{e.venue}</span>}
                  </div>

                  <div className={`mt-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${upcoming ? 'bg-brand-alpha text-brand-500 border-brand-strong' : 'bg-surface-input text-content-muted border-boundary-subtle'}`}>
                    <i className={`fas ${upcoming ? 'fa-hourglass-start' : 'fa-check-circle'}`} />
                    {upcoming ? getExamCountdownText(e) : 'Completed'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Mini Calendar */}
      <div className="w-full lg:w-[300px] flex-shrink-0 bg-surface-card border border-boundary-subtle rounded-2xl p-5 sticky top-[94px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-content-main">{MONTHS[calMonth]} {calYear}</h3>
          <div className="flex gap-1">
            <button onClick={() => { if (calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }}
              className="w-7 h-7 rounded-md bg-surface-input border border-boundary-subtle text-content-muted hover:text-brand-500 hover:border-brand-strong flex items-center justify-center text-xs transition">
              <i className="fas fa-chevron-left" />
            </button>
            <button onClick={() => { if (calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }}
              className="w-7 h-7 rounded-md bg-surface-input border border-boundary-subtle text-content-muted hover:text-brand-500 hover:border-brand-strong flex items-center justify-center text-xs transition">
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {['S','M','T','W','T','F','S'].map((d,i) => (
            <div key={i} className="text-center text-[10px] font-bold text-content-muted py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {calDays.map((d,i) => {
            const dStr = `${d.year}-${String(d.month+1).padStart(2,'0')}-${String(d.date).padStart(2,'0')}`;
            const isToday = !d.isOther && d.date===today.getDate() && d.month===today.getMonth() && d.year===today.getFullYear();
            const hasExam = !d.isOther && examDates.has(dStr);
            return (
              <div key={i} className={`aspect-square flex items-center justify-center text-xs rounded-md relative
                ${d.isOther ? 'text-content-muted opacity-50' : 'text-content-main'}
                ${isToday ? 'bg-brand-500 text-white font-bold shadow-lg shadow-brand-strong' : ''}
                ${hasExam && !isToday ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold' : ''}
              `}>
                {d.date}
                {hasExam && !isToday && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-boundary-subtle space-y-2">
          <div className="flex items-center gap-2 text-xs text-content-muted"><span className="w-3 h-3 rounded-sm bg-brand-500" />Today</div>
          <div className="flex items-center gap-2 text-xs text-content-muted"><span className="w-3 h-3 rounded-sm bg-orange-500/30" />Exam Day</div>
        </div>

        {exams.filter(e => isExamUpcoming(e)).sort((a,b) => new Date(a.examDate).getTime()-new Date(b.examDate).getTime()).slice(0,3).length > 0 && (
          <div className="mt-4 pt-4 border-t border-boundary-subtle">
            <p className="text-[10px] font-bold text-content-muted uppercase tracking-widest mb-2">Upcoming</p>
            {exams.filter(e => isExamUpcoming(e)).sort((a,b) => new Date(a.examDate).getTime()-new Date(b.examDate).getTime()).slice(0,3).map(e => (
              <div key={e.id} className="py-2 border-b border-boundary-subtle last:border-0 hover:bg-surface-body cursor-pointer rounded px-1 transition" onClick={() => setViewExam(e)}>
                <p className="text-xs font-semibold text-content-main truncate">{e.title}</p>
                <p className="text-[11px] text-content-muted mt-0.5">{formatDate(e.examDate)} · {e.examTime}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal id="view-exam" title="Exam Details" icon="fa-calendar-alt" isOpen={!!viewExam} onClose={() => setViewExam(null)}>
        {viewExam && (() => {
          const sub = getSubjectById(viewExam.subjectId);
          const upcoming = isExamUpcoming(viewExam);
          return (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-content-main">{viewExam.title}</h2>
              <div className="flex flex-wrap gap-2 text-sm mb-2">
                 <span className="inline-flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-full text-xs border border-boundary-subtle" style={{ background: (sub?.color||'#6366f1')+'15', color: sub?.color||'var(--color-brand-500)' }}>
                   {sub?.name || 'Unknown Subject'}
                 </span>
                 <span className={`inline-flex items-center font-semibold px-2.5 py-1 rounded-full border text-xs ${TYPE_COLORS[viewExam.examType]}`}>{EXAM_TYPE_LABELS[viewExam.examType]}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-surface-input p-4 rounded-xl border border-boundary-subtle">
                <div><p className="field-label">Date & Time</p><p className="text-content-main font-medium">{formatDate(viewExam.examDate)} at {viewExam.examTime}</p></div>
                <div><p className="field-label">Duration</p><p className="text-content-main font-medium">{viewExam.duration || '—'} mins</p></div>
                <div><p className="field-label">Venue</p><p className="text-content-main font-medium">{viewExam.venue || '—'}</p></div>
                <div><p className="field-label">Total Marks</p><p className="text-content-main font-medium">{viewExam.marks || '—'}</p></div>
              </div>
              
              <div className="my-2">
                 <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border ${upcoming ? 'bg-brand-alpha text-brand-500 border-brand-strong' : 'bg-surface-input text-content-muted border-boundary-subtle'}`}>
                   <i className={`fas ${upcoming ? 'fa-hourglass-start' : 'fa-check-circle'}`} />
                   {upcoming ? getExamCountdownText(viewExam) : 'Completed'}
                 </div>
              </div>

              {viewExam.notes && <div><p className="field-label">Instructions / Notes</p><p className="text-content-main text-sm leading-relaxed bg-surface-input p-4 rounded-xl border border-boundary-subtle whitespace-pre-wrap">{viewExam.notes}</p></div>}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
