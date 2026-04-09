'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';
import { Subject } from '@/lib/types';

export default function SubjectsPage() {
  const { subjects, notes, assignments, syllabus, t, addSubject, deleteSubject } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semester: 'Semester 1',
    teacher: '',
    color: '#6366f1',
    creditHours: 3,
    fullMarks: 75
  });

  const [activeSemester, setActiveSemester] = useState<string>('All');

  const getStats = (id: string) => ({
    notes: notes.filter(n => n.subjectId === id).length,
    assignments: assignments.filter(a => a.subjectId === id).length,
    topics: syllabus.filter(t => t.subjectId === id).length
  });

  const filteredSubjects = subjects.filter(sub => 
    activeSemester === 'All' || sub.semester === activeSemester
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSubject(formData);
    setIsModalOpen(false);
    setFormData({ name: '', code: '', semester: 'Semester 1', teacher: '', color: '#6366f1', creditHours: 3, fullMarks: 75 });
  };

  return (
    <div className="min-h-screen bg-surface-body pb-20">
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-content-main">Active Courses</h2>
            
            {/* Semester Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-card/50 backdrop-blur-md rounded-2xl md:rounded-full w-fit border border-boundary-subtle">
              {['All', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'].map(sem => (
                <button
                  key={sem}
                  onClick={() => setActiveSemester(sem)}
                  className={`nav-tab px-4 py-1.5 text-xs ${activeSemester === sem ? 'nav-tab-active' : 'text-content-muted'}`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full sm:w-auto">
            <i className="fas fa-plus-circle" /> Add New Subject
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map(subject => {
              const stats = getStats(subject.id);
              return (
                <div key={subject.id} className="glass-card group hover:-translate-y-2 transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-brand-500/20">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: subject.color }}>
                        <i className="fas fa-book text-xl" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-content-muted mb-1">{subject.code || 'N/A'}</span>
                        <div className="px-2.5 py-1 rounded-full bg-brand-alpha text-brand-500 text-[10px] font-bold uppercase">
                          {subject.semester}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-content-main mb-1 group-hover:text-brand-500 transition-colors">{subject.name}</h3>
                    <p className="text-sm text-content-muted mb-4 flex items-center gap-2">
                       <i className="fas fa-user-tie text-[10px] opacity-60" /> {subject.teacher || 'Assign Teacher'}
                    </p>
                    <div className="flex gap-4 mb-6 pt-4 border-t border-boundary-subtle/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-content-muted uppercase">Credits</span>
                        <span className="text-xs font-bold text-content-main">{subject.creditHours}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-content-muted uppercase">Full Marks</span>
                        <span className="text-xs font-bold text-content-main">{subject.fullMarks}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-boundary-subtle">
                      <div className="text-center">
                        <p className="text-xs font-bold text-content-main">{stats.notes}</p>
                        <p className="text-[10px] text-content-muted uppercase font-semibold">Notes</p>
                      </div>
                      <div className="text-center border-x border-boundary-subtle">
                        <p className="text-xs font-bold text-content-main">{stats.assignments}</p>
                        <p className="text-[10px] text-content-muted uppercase font-semibold">Tasks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-content-main">{stats.topics}</p>
                        <p className="text-[10px] text-content-muted uppercase font-semibold">Units</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-surface-input/50 flex justify-end gap-2 border-t border-boundary-subtle lg:opacity-0 group-hover:opacity-100 transition-all">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-brand-alpha hover:text-brand-500 transition-colors">
                      <i className="fas fa-edit text-xs" />
                    </button>
                    <button 
                      onClick={() => { if (confirm('Delete this subject and all associated data?')) deleteSubject(subject.id); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                      <i className="fas fa-trash-alt text-xs" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center glass-card border-dashed">
              <i className="fas fa-folder-open text-4xl text-content-muted mb-4 opacity-20" />
              <p className="text-content-muted font-medium">No subjects found for {activeSemester}.</p>
            </div>
          )}
        </div>
      </main>

      <Modal id="subject-modal" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Subject Registration">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="field-label">Subject Name</label>
              <input 
                className="w-full input-field"
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Advanced Operating Systems"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="field-label">Subject Code</label>
              <input 
                className="w-full input-field"
                value={formData.code}
                onChange={e => setFormData(f => ({ ...f, code: e.target.value }))}
                placeholder="e.g. C.Sc. 538"
                required
              />
            </div>
          </div>
          <div>
            <label className="field-label">Instructor Name</label>
            <input 
              className="w-full input-field"
              value={formData.teacher}
              onChange={e => setFormData(f => ({ ...f, teacher: e.target.value }))}
              placeholder="e.g. Prof. Dr. John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Credit Hours</label>
              <input 
                type="number"
                className="w-full input-field"
                value={formData.creditHours}
                onChange={e => setFormData(f => ({ ...f, creditHours: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <label className="field-label">Full Marks</label>
              <input 
                type="number"
                className="w-full input-field"
                value={formData.fullMarks}
                onChange={e => setFormData(f => ({ ...f, fullMarks: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Semester</label>
              <select 
                className="w-full input-field"
                value={formData.semester}
                onChange={e => setFormData(f => ({ ...f, semester: e.target.value }))}
                required
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
              </select>
            </div>
            <div>
              <label className="field-label">Theme Color</label>
              <div className="flex gap-2">
                {['#6366f1', '#10b981', '#f59e0b', '#e11d48', '#8b5cf6', '#3b82f6'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, color: c }))}
                    className={`w-8 h-8 rounded-xl border-2 transition-all ${formData.color === c ? 'scale-110 border-content-main' : 'border-transparent opacity-60'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="w-full btn-primary py-3 font-bold mt-4 shadow-xl shadow-brand-alpha">
            Initialize Module
          </button>
        </form>
      </Modal>
    </div>
  );
}
