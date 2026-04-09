'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Assignment } from '@/lib/types';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { getAssignmentStatus, getCountdownText, formatDate } from '@/lib/utils';

const ASG_STATUS_CONFIG = {
  overdue: { label: 'Overdue', icon: 'fa-exclamation-circle', bg: 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20' },
  'due-soon': { label: 'Due Soon', icon: 'fa-clock', bg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
  active: { label: 'Active', icon: 'fa-check-circle', bg: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
};

export default function AssignmentsPage() {
  const { subjects, assignments, addAssignment, updateAssignment, deleteAssignment, getSubjectById, t } = useApp();
  const [search, setSearch] = useState('');
  const [filterSub, setFilterSub] = useState('');
  const [filterSem, setFilterSem] = useState('All');

  const [showAdd, setShowAdd] = useState(false);
  const [editAsg, setEditAsg] = useState<Assignment | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const [formData, setFormData] = useState({ subjectId: '', title: '', dueDate: '', totalMarks: '', description: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filtered = assignments.filter(a => {
    const sub = getSubjectById(a.subjectId);
    const sSem = filterSem === 'All' || sub?.semester === filterSem;
    const sTitle = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const sSub = !filterSub || a.subjectId === filterSub;
    return sSem && sTitle && sSub;
  }).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('subjectId', formData.subjectId);
    data.append('title', formData.title);
    data.append('dueDate', formData.dueDate);
    data.append('totalMarks', formData.totalMarks);
    data.append('description', formData.description);
    if (selectedFile) {
      data.append('file', selectedFile);
    }

    if (editAsg) {
      updateAssignment(editAsg.id, data);
      setToast({ msg: 'Assignment updated.', type: 'success' });
    } else {
      addAssignment(data);
      setToast({ msg: 'Assignment added.', type: 'success' });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowAdd(false); setEditAsg(null);
    setFormData({ subjectId: '', title: '', dueDate: '', totalMarks: '', description: '' });
    setSelectedFile(null);
  };

  const openEdit = (a: Assignment) => {
    setEditAsg(a);
    setFormData({ subjectId: a.subjectId, title: a.title, dueDate: a.dueDate, totalMarks: a.totalMarks||'', description: a.description||'' });
    setShowAdd(true);
  };

  const handleDel = () => {
    if (delId) { deleteAssignment(delId); setDelId(null); setToast({ msg: 'Assignment deleted.', type: 'success' }); }
  };

  return (
    <div>
      <div className="space-y-4 mb-8">
        {/* Semester Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-card/50 backdrop-blur-md rounded-2xl md:rounded-full w-fit border border-boundary-subtle">
          {['All', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'].map(sem => (
            <button
              key={sem}
              onClick={() => {
                setFilterSem(sem);
                setFilterSub(''); // Reset subject selection
              }}
              className={`nav-tab px-4 py-1.5 text-[10px] font-bold transition-all ${filterSem === sem ? 'nav-tab-active' : 'text-content-muted hover:text-content-main'}`}
            >
              {sem}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('assignments.search' as any) || 'Search assignments...'} className="input-field w-full sm:flex-1 md:max-w-sm" />
            <select value={filterSub} onChange={e => setFilterSub(e.target.value)} className="input-field w-full sm:w-auto">
              <option value="">All Subjects</option>
              {subjects
                .filter(s => filterSem === 'All' || s.semester === filterSem)
                .map(s => <option key={s.id} value={s.id}>{s.name}</option>)
              }
            </select>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary w-full md:w-auto flex-shrink-0">
            <i className="fas fa-plus" /> {t('assignments.add' as any) || 'Add Assignment'}
          </button>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="empty-card">
          <i className="fas fa-tasks text-4xl opacity-20 mb-3" />
          <p className="text-content-muted">{t('assignments.empty' as any) || 'No assignments match your view.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map(a => {
            const status = getAssignmentStatus(a);
            const sc = ASG_STATUS_CONFIG[status];
            const sub = getSubjectById(a.subjectId);
            return (
              <div key={a.id} className="group relative bg-surface-card border border-boundary-subtle hover:border-brand-strong rounded-2xl p-5 hover:shadow-lg transition-all overflow-hidden flex flex-col md:flex-row md:items-center gap-5">
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${sc.bg.replace('bg-', 'bg-').split('/')[0]}`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} border-boundary-subtle`}>
                       {sc.icon} {t(`status.${status.replace('-','')}` as any) || sc.label}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded" style={{ background: (sub?.color||'#6366f1')+'20', color: sub?.color||'#6366f1' }}>
                      {sub?.name||'Unknown'}
                    </span>
                  </div>
                  <h3 className="font-bold text-content-main leading-snug mb-1">{a.title}</h3>
                  {a.description && <p className="text-sm text-content-muted line-clamp-1 mb-2">{a.description}</p>}
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-content-muted mt-3">
                    <span className="flex items-center gap-1.5"><i className="fas fa-calendar text-brand-500" /> {formatDate(a.dueDate)}</span>
                    {a.totalMarks && <span className="flex items-center gap-1.5"><i className="fas fa-star text-yellow-500" /> {a.totalMarks} Marks</span>}
                    {a.file && (
                      <a href={a.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-emerald-500 hover:text-emerald-600">
                        <i className="fas fa-file-pdf" /> Attachment
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-4 border-t border-boundary-subtle md:border-0 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] uppercase font-bold text-content-muted mb-0.5 tracking-wider">Remaining Time</p>
                    <p className={`font-mono font-bold text-sm ${status === 'overdue' ? 'text-red-500' : status==='due-soon' ? 'text-yellow-500' : 'text-brand-500'}`}>
                      {getCountdownText(a)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(a)} className="w-8 h-8 rounded-lg bg-surface-input hover:bg-surface-body text-content-muted hover:text-brand-500 flex items-center justify-center transition">
                      <i className="fas fa-pen text-sm" />
                    </button>
                    <button onClick={() => setDelId(a.id)} className="w-8 h-8 rounded-lg bg-surface-input hover:bg-red-500/10 text-content-muted hover:text-red-500 flex items-center justify-center transition">
                      <i className="fas fa-trash text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal id="asg-modal" title={editAsg ? 'Edit Assignment' : 'Add Assignment'} icon="fa-tasks" isOpen={showAdd} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="field-label">Subject</label>
              <select required value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} className="input-field w-full">
                <option value="" disabled>Select</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div><label className="field-label">Due Date</label>
              <input required type="datetime-local" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="input-field w-full" />
            </div>
          </div>
          <div><label className="field-label">Assignment Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field w-full" placeholder="e.g. Midterm Report" />
          </div>
          <div><label className="field-label">Total Marks (Optional)</label>
            <input type="number" min="0" value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: e.target.value})} className="input-field w-full" placeholder="e.g. 100" />
          </div>
          <div><label className="field-label">Details / Instructions</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field w-full resize-none" placeholder="Instructions..." />
          </div>
          <div><label className="field-label">Assignment File (Questions/Prompt)</label>
            <div className="relative group/file">
              <input 
                type="file" 
                onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="input-field w-full flex items-center justify-between group-hover/file:border-brand-500 transition-colors">
                <span className="text-content-muted truncate max-w-[200px]">
                  {selectedFile ? selectedFile.name : 'Select PDF or Image...'}
                </span>
                <i className="fas fa-file-upload text-content-muted" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-boundary-subtle">
            <button type="button" onClick={closeModal} className="btn-secondary">{t('action.cancel' as any) || 'Cancel'}</button>
            <button type="submit" className="btn-primary">{t('action.save' as any) || 'Save'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!delId} title="Delete Assignment?" message="Action cannot be undone." onConfirm={handleDel} onCancel={() => setDelId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
