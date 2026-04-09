'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';
import { Note } from '@/lib/types';
import Modal from '@/components/Modal';

export default function StudentNotesPage() {
  const { subjects, notes, getSubjectById, t } = useApp();
  const [search, setSearch] = useState('');
  const [filterSub, setFilterSub] = useState('');
  
  const [viewNote, setViewNote] = useState<Note | null>(null);

  const filtered = notes.filter(n => {
    const s1 = !search || n.title.toLowerCase().includes(search.toLowerCase());
    const s2 = !filterSub || n.subjectId === filterSub;
    return s1 && s2;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="flex flex-wrap gap-3 flex-1">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('notes.search' as any) || 'Search notes...'} className="input-field flex-1 min-w-[160px] max-w-md" />
          <select value={filterSub} onChange={e => setFilterSub(e.target.value)} className="input-field">
            <option value="">{t('notes.search' as any) ? 'All Subjects' : 'All Subjects'}</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="empty-card">
          <i className="fas fa-file-alt text-4xl opacity-20 mb-3" />
          <p className="text-content-muted">{t('notes.empty' as any) || 'No notes available yet.'}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-card">
          <i className="fas fa-search text-4xl opacity-20 mb-3" />
          <p className="text-content-muted">No notes found for this search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(n => {
            const sub = getSubjectById(n.subjectId);
            return (
              <div key={n.id} onClick={() => setViewNote(n)} className="group flex flex-col bg-surface-card border border-boundary-subtle hover:border-brand-strong rounded-2xl p-5 hover:shadow-xl transition-all relative cursor-pointer">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: (sub?.color || '#6366f1') + '15' }}>
                     <i className="fas fa-file-alt text-lg" style={{ color: sub?.color || '#6366f1' }} />
                  </div>
                </div>

                <div className="mb-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ background: (sub?.color || '#6366f1') + '20', color: sub?.color || '#6366f1' }}>
                    {sub?.name || 'Unknown'}
                  </span>
                  <h3 className="font-bold text-content-main leading-snug line-clamp-2">{n.title}</h3>
                </div>

                {n.chapter && <p className="text-xs text-content-muted font-medium mb-3">Chapter: {n.chapter}</p>}
                {n.description && <p className="text-xs text-content-muted line-clamp-2 mb-4 flex-1">{n.description}</p>}
                {!n.description && <div className="flex-1" />}

                <div className="mt-4 pt-4 border-t border-boundary-subtle flex items-center justify-between text-xs text-content-muted">
                  <span>{formatDate(n.createdAt)}</span>
                  {n.link && (
                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600 font-semibold flex items-center gap-1.5 transition-colors" onClick={e => e.stopPropagation()}>
                       {t('action.download' as any) || 'Download'} <i className="fas fa-download" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Modal */}
      <Modal id="view-note" title="View Note Details" icon="fa-file-alt" isOpen={!!viewNote} onClose={() => setViewNote(null)}>
        {viewNote && (() => {
          const sub = getSubjectById(viewNote.subjectId);
          return (
            <div className="space-y-5">
              <div>
                <span className="inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 border border-boundary-subtle" style={{ background: (sub?.color || '#6366f1') + '15', color: sub?.color || '#6366f1' }}>
                   {sub?.name || 'Unknown'} {viewNote.chapter ? `— ${viewNote.chapter}` : ''}
                </span>
                <h2 className="text-2xl font-bold text-content-main">{viewNote.title}</h2>
              </div>
              
              <div className="bg-surface-input p-4 rounded-xl border border-boundary-subtle text-sm text-content-main whitespace-pre-wrap leading-relaxed shadow-inner">
                {viewNote.description || 'No detailed description provided.'}
              </div>

              {viewNote.link && (
                <div className="pt-4 border-t border-boundary-subtle">
                  <a href={viewNote.link} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                     {t('action.download' as any) || 'Download Notes'} <i className="fas fa-external-link-alt ml-1" />
                  </a>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
