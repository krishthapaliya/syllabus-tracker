'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatDate, getAssignmentStatus, getCountdownText } from '@/lib/utils';
import { Assignment } from '@/lib/types';
import Modal from '@/components/Modal';

const ASG_STATUS_CONFIG = {
  overdue: { label: 'Overdue', icon: 'fa-exclamation-circle', bg: 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20' },
  'due-soon': { label: 'Due Soon', icon: 'fa-clock', bg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
  active: { label: 'Active', icon: 'fa-check-circle', bg: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
};

export default function StudentAssignmentsPage() {
  const { subjects, assignments, getSubjectById, t } = useApp();
  const [search, setSearch] = useState('');
  const [filterSub, setFilterSub] = useState('');
  
  const [viewAsg, setViewAsg] = useState<Assignment | null>(null);

  const filtered = assignments.filter(a => {
    const s1 = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const s2 = !filterSub || a.subjectId === filterSub;
    return s1 && s2;
  }).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="flex flex-wrap gap-3 flex-1">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('assignments.search' as any) || 'Search assignments...'} className="input-field flex-1 min-w-[160px] max-w-sm" />
          <select value={filterSub} onChange={e => setFilterSub(e.target.value)} className="input-field">
            <option value="">{t('assignments.search' as any) ? 'All Subjects' : 'All Subjects'}</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="empty-card">
          <i className="fas fa-tasks text-4xl opacity-20 mb-3" />
          <p className="text-content-muted">{t('assignments.empty' as any) || 'No assignments found.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map(a => {
            const status = getAssignmentStatus(a);
            const sc = ASG_STATUS_CONFIG[status];
            const sub = getSubjectById(a.subjectId);
            return (
              <div key={a.id} onClick={() => setViewAsg(a)} className="group relative bg-surface-card border border-boundary-subtle hover:border-brand-strong hover:bg-surface-body rounded-2xl p-5 hover:shadow-lg transition-all overflow-hidden flex flex-col md:flex-row md:items-center gap-5 cursor-pointer">
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${sc.bg.replace('bg-', 'bg-').split('/')[0]}`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} border-boundary-subtle`}>
                       {sc.icon} {t(`status.${status.replace('-','')}` as any) || sc.label}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded" style={{ background: (sub?.color||'#6366f1')+'20', color: sub?.color||'var(--color-brand-500)' }}>
                      {sub?.name || 'Unknown'}
                    </span>
                  </div>
                  <h3 className="font-bold text-content-main leading-snug mb-1">{a.title}</h3>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-content-muted mt-3">
                    <span className="flex items-center gap-1.5"><i className="fas fa-calendar text-brand-500" /> {formatDate(a.dueDate)}</span>
                    {a.totalMarks && <span className="flex items-center gap-1.5"><i className="fas fa-star text-yellow-500" /> {a.totalMarks} Marks</span>}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-4 border-t border-boundary-subtle md:border-0 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] uppercase font-bold text-content-muted mb-0.5 tracking-wider">Remaining Time</p>
                    <p className={`font-mono font-bold text-sm ${status === 'overdue' ? 'text-red-500' : status==='due-soon' ? 'text-yellow-600 dark:text-yellow-400' : 'text-brand-500'}`}>
                      {getCountdownText(a)}
                    </p>
                  </div>
                  <i className="fas fa-chevron-right text-content-muted opacity-0 group-hover:opacity-100 transition-opacity md:mt-2" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Modal */}
      <Modal id="view-asg" title="Assignment Details" icon="fa-tasks" isOpen={!!viewAsg} onClose={() => setViewAsg(null)}>
        {viewAsg && (() => {
           const sub = getSubjectById(viewAsg.subjectId);
           const status = getAssignmentStatus(viewAsg);
           const sc = ASG_STATUS_CONFIG[status];
           return (
             <div className="space-y-4">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded border border-boundary-subtle" style={{ background: (sub?.color||'#6366f1')+'15', color: sub?.color||'var(--color-brand-500)' }}>
                      {sub?.name || 'Unknown'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} border-boundary-subtle`}>
                       {sc.icon} {t(`status.${status.replace('-','')}` as any) || sc.label}
                    </span>
                 </div>
                 <h2 className="text-xl font-bold text-content-main mb-1">{viewAsg.title}</h2>
               </div>

               <div className="grid grid-cols-2 gap-4 bg-surface-input p-4 rounded-xl border border-boundary-subtle">
                 <div>
                   <p className="field-label">Due Date</p>
                   <p className="text-content-main font-medium">{formatDate(viewAsg.dueDate)}</p>
                 </div>
                 <div>
                   <p className="field-label">Remaining Time</p>
                   <p className={`font-mono font-bold ${status==='overdue'?'text-red-500':status==='due-soon'?'text-yellow-600 dark:text-yellow-400':'text-brand-500'}`}>{getCountdownText(viewAsg)}</p>
                 </div>
                 {viewAsg.totalMarks && (
                   <div>
                     <p className="field-label">Total Marks</p>
                     <p className="text-content-main font-medium">{viewAsg.totalMarks}</p>
                   </div>
                 )}
               </div>

               {viewAsg.description && (
                 <div>
                   <p className="field-label">Instructions</p>
                   <p className="text-sm text-content-main whitespace-pre-wrap leading-relaxed bg-surface-input p-4 rounded-xl border border-boundary-subtle">
                     {viewAsg.description}
                   </p>
                 </div>
               )}
             </div>
           );
        })()}
      </Modal>
    </div>
  );
}
