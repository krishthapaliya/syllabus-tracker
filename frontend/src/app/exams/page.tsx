'use client';
import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Exam } from '@/lib/types';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatDate, isExamUpcoming, getExamCountdownText, EXAM_TYPE_LABELS } from '@/lib/utils';

const TYPE_COLORS: Record<string, string> = {
  midterm:'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20',
  final:'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20',
  quiz:'bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20',
  practical:'bg-teal-500/10 text-teal-500 dark:text-teal-400 border-teal-500/20',
  internal:'bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20',
};

export default function ExamsPage() {
  const { subjects, exams, addExam, updateExam, deleteExam, getSubjectById, t } = useApp();
  const [search, setSearch] = useState('');
  const [filterSub, setFilterSub] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  const [formData, setFormData] = useState({ subjectId:'', title:'', examType:'midterm' as any, examDate:'', examTime:'', duration:'', venue:'', marks:'', notes:'' });

  const filtered = exams.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.title.toLowerCase().includes(q) || e.venue?.toLowerCase().includes(q);
    const matchS = !filterSub || e.subjectId === filterSub;
    return matchQ && matchS;
  }).sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  // Calendar Logic
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editExam) { updateExam(editExam.id, formData); setToast({msg:'Exam updated.',type:'success'}); }
    else { addExam(formData); setToast({msg:'Exam added.',type:'success'}); }
    closeModal();
  };

  const closeModal = () => {
    setShowAdd(false); setEditExam(null);
    setFormData({ subjectId:'', title:'', examType:'midterm', examDate:'', examTime:'', duration:'', venue:'', marks:'', notes:'' });
  };

  const openEdit = (e: Exam) => {
    setEditExam(e);
    setFormData({ subjectId:e.subjectId, title:e.title, examType:e.examType, examDate:e.examDate, examTime:e.examTime, duration:e.duration||'', venue:e.venue||'', marks:e.marks||'', notes:e.notes||'' });
    setShowAdd(true);
  };

  const handleDel = () => {
    if (delId) { deleteExam(delId); setDelId(null); setToast({msg:'Exam deleted.',type:'success'}); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left: Exam list */}
      <div className="flex-1 min-w-0 w-full">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exams or venues..." className="input-field w-full sm:flex-1 md:max-w-sm" />
            <select value={filterSub} onChange={e => setFilterSub(e.target.value)} className="input-field w-full sm:w-auto">
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary w-full md:w-auto flex-shrink-0">
            <i className="fas fa-plus" /> Add Exam
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-card w-full">
            <i className="fas fa-calendar-alt text-4xl opacity-20 mb-3" />
            <p className="text-content-muted">No exams found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filtered.map(e => {
              const sub = getSubjectById(e.subjectId);
              const upcoming = isExamUpcoming(e);
              return (
                <div key={e.id} className="group bg-surface-card border border-boundary-subtle rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:border-brand-strong transition-all relative overflow-hidden flex flex-col">
                  {/* Subject color bar */}
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: sub?.color||'var(--color-brand-500)' }} />
                  
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:(sub?.color||'#6366f1')+'20', color:sub?.color||'var(--color-brand-500)' }}>
                        {sub?.name||'Unknown'}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[e.examType]}`}>
                        {EXAM_TYPE_LABELS[e.examType]}
                      </span>
                    </div>
                    {/* Actions Dropdown inside Group */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button onClick={() => openEdit(e)} className="w-7 h-7 rounded bg-surface-input hover:bg-surface-body text-content-muted hover:text-brand-500 flex items-center justify-center transition">
                        <i className="fas fa-pen text-xs" />
                      </button>
                      <button onClick={() => setDelId(e.id)} className="w-7 h-7 rounded bg-surface-input hover:bg-red-500/10 text-content-muted hover:text-red-500 flex items-center justify-center transition">
                        <i className="fas fa-trash text-xs" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-content-main mb-3 leading-snug truncate">{e.title}</h3>

                  <div className="grid grid-cols-2 gap-y-2 text-xs text-content-muted mb-3 flex-1">
                    <span className="flex items-center"><i className="fas fa-calendar-alt w-4 text-brand-500" />{formatDate(e.examDate)}</span>
                    <span className="flex items-center"><i className="fas fa-clock w-4 text-brand-500" />{e.examTime}</span>
                    {e.duration && <span className="flex items-center"><i className="fas fa-hourglass-half w-4 text-brand-500" />{e.duration} min</span>}
                    {e.venue && <span className="flex items-center truncate"><i className="fas fa-map-marker-alt w-4 text-brand-500" />{e.venue}</span>}
                  </div>

                  <div className={`mt-auto inline-flex items-center self-start gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${upcoming ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20' : 'bg-surface-input text-content-muted border-boundary-subtle'}`}>
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
      <div className="w-full lg:w-[300px] flex-shrink-0 bg-surface-card border border-boundary-subtle rounded-2xl p-5 lg:sticky lg:top-[94px]">
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
      </div>

      <Modal id="exam-modal" title={editExam ? 'Edit Exam' : 'Schedule Exam'} icon="fa-calendar-alt" isOpen={showAdd} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="field-label">Subject</label>
              <select required value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} className="input-field w-full">
                <option value="" disabled>Select</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div><label className="field-label">Exam Type</label>
              <select required value={formData.examType} onChange={e => setFormData({...formData, examType: e.target.value as any})} className="input-field w-full">
                {Object.entries(EXAM_TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div><label className="field-label">Exam Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field w-full" placeholder="e.g. Midterm Lab Practical" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="field-label">Date</label>
              <input required type="date" value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} className="input-field w-full" />
            </div>
            <div><label className="field-label">Time</label>
              <input required type="time" value={formData.examTime} onChange={e => setFormData({...formData, examTime: e.target.value})} className="input-field w-full" />
            </div>
            <div><label className="field-label">Duration (mins)</label>
              <input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="input-field w-full" placeholder="120" />
            </div>
            <div><label className="field-label">Total Marks</label>
              <input type="number" value={formData.marks} onChange={e => setFormData({...formData, marks: e.target.value})} className="input-field w-full" placeholder="100" />
            </div>
          </div>
          <div><label className="field-label">Venue / Room</label>
            <input type="text" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="input-field w-full" placeholder="e.g. Main Hall" />
          </div>
          <div><label className="field-label">Instructions / Notes</label>
            <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="input-field w-full resize-none" placeholder="Bring calculators..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-boundary-subtle">
            <button type="button" onClick={closeModal} className="btn-secondary">{t('action.cancel' as any) || 'Cancel'}</button>
            <button type="submit" className="btn-primary">{t('action.save' as any) || 'Save'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!delId} title="Delete Exam?" message="Action cannot be undone." onConfirm={handleDel} onCancel={() => setDelId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
