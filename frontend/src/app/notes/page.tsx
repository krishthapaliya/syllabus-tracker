'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Note } from '@/lib/types';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatDate } from '@/lib/utils';

export default function NotesPage() {
  const { subjects, notes, addNote, updateNote, deleteNote, getSubjectById, t } = useApp();
  const [search, setSearch] = useState('');
  const [filterSub, setFilterSub] = useState('');
  const [filterSem, setFilterSem] = useState('All');

  const [showAdd, setShowAdd] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [delId, setDelId] = useState<string | null>(null);

  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Form State
  const [formData, setFormData] = useState({ subjectId: '', title: '', chapter: '', link: '', description: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filtered = notes.filter(n => {
    const sub = getSubjectById(n.subjectId);
    const sSem = filterSem === 'All' || sub?.semester === filterSem;
    const sTitle = !search || n.title.toLowerCase().includes(search.toLowerCase());
    const sSub = !filterSub || n.subjectId === filterSub;
    return sSem && sTitle && sSub;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const data = new FormData();
    data.append('subjectId', formData.subjectId);
    data.append('title', formData.title);
    data.append('chapter', formData.chapter);
    data.append('link', formData.link);
    data.append('description', formData.description);
    if (selectedFile) {
      data.append('file', selectedFile);
    }

    if (editNote) {
      updateNote(editNote.id, data);
      setToast({ msg: 'Note updated successfully.', type: 'success' });
    } else {
      addNote(data);
      setToast({ msg: 'Note added successfully.', type: 'success' });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowAdd(false); setEditNote(null);
    setFormData({ subjectId: '', title: '', chapter: '', link: '', description: '' });
    setSelectedFile(null);
  };

  const openEdit = (n: Note) => {
    setEditNote(n);
    setFormData({ subjectId: n.subjectId, title: n.title, chapter: n.chapter||'', link: n.link||'', description: n.description||'' });
    setShowAdd(true);
  };

  const handleDel = () => {
    if (delId) {
      deleteNote(delId);
      setDelId(null);
      setToast({ msg: 'Note deleted.', type: 'success' });
    }
  };

  return (
    <div>
      {/* Action Bar */}
      <div className="space-y-4 mb-8">
        {/* Semester Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-card/50 backdrop-blur-md rounded-2xl md:rounded-full w-fit border border-boundary-subtle">
          {['All', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'].map(sem => (
            <button
              key={sem}
              onClick={() => {
                setFilterSem(sem);
                setFilterSub(''); // Reset subject filter when switching semester
              }}
              className={`nav-tab px-4 py-1.5 text-[10px] font-bold transition-all ${filterSem === sem ? 'nav-tab-active' : 'text-content-muted hover:text-content-main'}`}
            >
              {sem}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('notes.search' as any) || 'Search notes...'} className="input-field w-full sm:flex-1 md:max-w-md" />
            <select value={filterSub} onChange={e => setFilterSub(e.target.value)} className="input-field w-full sm:w-auto">
              <option value="">All Subjects</option>
              {subjects
                .filter(s => filterSem === 'All' || s.semester === filterSem)
                .map(s => <option key={s.id} value={s.id}>{s.name}</option>)
              }
            </select>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary w-full md:w-auto flex-shrink-0">
            <i className="fas fa-plus" /> {t('notes.upload' as any) || 'Upload Note'}
          </button>
        </div>
      </div>

      {/* Grid */}
      {notes.length === 0 ? (
        <div className="empty-card">
          <i className="fas fa-file-alt text-4xl opacity-20 mb-3" />
          <p className="text-content-muted">{t('notes.empty' as any) || 'No notes available yet.'}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-card">
          <i className="fas fa-file-circle-xmark text-4xl mb-4 text-content-muted opacity-40" />
          <p className="font-bold text-lg text-content-main">No materials found</p>
          <p className="text-sm text-content-muted">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(note => {
            const sub = getSubjectById(note.subjectId);
            return (
              <div 
                key={note.id} 
                className="glass-card flex flex-col hover:-translate-y-1 transition-all duration-300 group overflow-hidden border border-transparent hover:border-brand-500/10"
              >
                
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: (sub?.color || '#6366f1') + '15' }}>
                     <i className="fas fa-file-alt text-lg" style={{ color: sub?.color || '#6366f1' }} />
                  </div>
                  
                  {/* Actions Dropdown inside Group */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button onClick={() => openEdit(note)} className="w-7 h-7 rounded bg-surface-input hover:bg-surface-body text-content-muted hover:text-brand-500 transition-colors flex items-center justify-center">
                      <i className="fas fa-pen text-xs" />
                    </button>
                    <button onClick={() => setDelId(note.id)} className="w-7 h-7 rounded bg-surface-input hover:bg-red-500/10 text-content-muted hover:text-red-500 transition-colors flex items-center justify-center">
                      <i className="fas fa-trash text-xs" />
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ background: (sub?.color || '#6366f1') + '20', color: sub?.color || '#6366f1' }}>
                    {sub?.name || 'Unknown'}
                  </span>
                  <h3 className="font-bold text-content-main leading-snug line-clamp-2" title={note.title}>{note.title}</h3>
                </div>

                {note.chapter && <p className="text-xs text-content-muted font-medium mb-3">Chapter: {note.chapter}</p>}
                {note.description && <p className="text-xs text-content-muted line-clamp-2 mb-4 flex-1">{note.description}</p>}
                {!note.description && <div className="flex-1" />}

                <div className="mt-4 pt-4 border-t border-boundary-subtle flex items-center justify-between text-xs text-content-muted">
                  <span>{formatDate(note.createdAt)}</span>
                  <div className="flex gap-3">
                    {note.file && (
                      <a href={note.file} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-600 font-semibold flex items-center gap-1.5 transition-colors">
                        Attachment <i className="fas fa-file-download" />
                      </a>
                    )}
                    {note.link && (
                      <a href={note.link} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600 font-semibold flex items-center gap-1.5 transition-colors">
                        Link <i className="fas fa-external-link-alt" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal id="note-modal" title={editNote ? 'Edit Note' : 'Upload Note'} icon="fa-file-upload" isOpen={showAdd} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="field-label">Subject</label>
            <select required value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} className="input-field w-full">
              <option value="" disabled>Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div><label className="field-label">Note Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field w-full" placeholder="e.g. Thermodynamics Basics" />
          </div>
          <div><label className="field-label">Chapter / Unit (Optional)</label>
            <input type="text" value={formData.chapter} onChange={e => setFormData({...formData, chapter: e.target.value})} className="input-field w-full" placeholder="e.g. Ch 1" />
          </div>
          <div><label className="field-label">File Link (Drive / Dropbox)</label>
            <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="input-field w-full" placeholder="https://" />
          </div>
          <div><label className="field-label">Upload File (PDF / Images)</label>
            <div className="relative group/file">
              <input 
                type="file" 
                onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="input-field w-full flex items-center justify-between group-hover/file:border-brand-500 transition-colors">
                <span className="text-content-muted truncate max-w-[200px]">
                  {selectedFile ? selectedFile.name : 'Select physical file...'}
                </span>
                <i className="fas fa-paperclip text-content-muted" />
              </div>
            </div>
          </div>
          <div><label className="field-label">Short Description</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field w-full resize-none" placeholder="Brief summary of what this note covers..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-boundary-subtle">
            <button type="button" onClick={closeModal} className="btn-secondary">{t('action.cancel' as any) || 'Cancel'}</button>
            <button type="submit" className="btn-primary">{t('action.save' as any) || 'Save Note'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!delId} title="Delete Note?" message="This will permanently delete this note. Students will no longer see it." onConfirm={handleDel} onCancel={() => setDelId(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
