'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';
import { SyllabusTopic } from '@/lib/types';

export default function SyllabusPage() {
  const { subjects, syllabus, t, addSyllabus, updateSyllabus, deleteSyllabus, getSubjectById } = useApp();
  const [activeTab, setActiveTab] = useState<'Semester 1' | 'Semester 2' | 'Semester 3' | 'Semester 4'>('Semester 1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<SyllabusTopic | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    topic: '',
    subjectId: '',
    unit: '',
    status: 'not-started' as any,
    progress: 0,
    description: ''
  });

  const filteredSubjects = subjects.filter(s => s.semester === activeTab);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTopic) {
      await updateSyllabus(editingTopic.id, formData);
    } else {
      await addSyllabus(formData);
    }
    closeModal();
  };

  const openEdit = (topic: SyllabusTopic) => {
    setEditingTopic(topic);
    setFormData({
      topic: topic.topic,
      subjectId: topic.subjectId,
      unit: topic.unit || '',
      status: topic.status as any,
      progress: topic.progress || 0,
      description: topic.description || ''
    });
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingTopic(null);
    setFormData({ topic: '', subjectId: '', unit: '', status: 'not-started', progress: 0, description: '' });
  };

  return (
    <div className="min-h-screen bg-surface-body pb-20">
      <main className="max-w-7xl mx-auto px-6 mt-8 animate-fade-in">
        {/* Semester Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-surface-card/50 backdrop-blur-md rounded-2xl md:rounded-full w-fit border border-boundary-subtle">
          {(['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'] as const).map(sem => (
            <button
              key={sem}
              onClick={() => setActiveTab(sem)}
              className={`nav-tab px-4 py-1.5 text-xs ${activeTab === sem ? 'nav-tab-active' : 'text-content-muted'}`}
            >
              {sem}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map(subject => {
              const subjectTopics = syllabus.filter(t => t.subjectId === subject.id);
              const progressCount = subjectTopics.length > 0 
                ? Math.round(subjectTopics.reduce((acc, curr) => acc + (curr.progress || 0), 0) / subjectTopics.length)
                : 0;

              return (
                <div key={subject.id} className="glass-card overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  {/* Subject Header */}
                  <div 
                    className="p-6 text-white relative"
                    style={{ background: `linear-gradient(135deg, ${subject.color || '#6366f1'} 0%, ${subject.color}cc 100%)` }}
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{subject.code}</span>
                          <h3 className="text-xl font-bold mt-1">{subject.name}</h3>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-1 text-xs font-bold">
                          {progressCount}% Complete
                        </div>
                      </div>
                      <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-1000 ease-out"
                          style={{ width: `${progressCount}%` }}
                        />
                      </div>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  </div>

                  {/* Topics List */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-content-muted uppercase tracking-wider">Course Modules</span>
                      <button 
                        onClick={() => {
                          setFormData(f => ({ ...f, subjectId: subject.id }));
                          setIsAddModalOpen(true);
                        }}
                        className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1"
                      >
                        <i className="fas fa-plus-circle" /> Add Topic
                      </button>
                    </div>

                    {subjectTopics.length > 0 ? (
                      subjectTopics.map(topic => (
                        <div 
                          key={topic.id}
                          onClick={() => openEdit(topic)}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-surface-body/50 border border-boundary-subtle hover:border-brand-500/30 hover:bg-surface-card transition-all cursor-pointer group/item"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110 ${
                            topic.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                            topic.status === 'in-progress' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-content-muted/10 text-content-muted'
                          }`}>
                            <i className={`fas ${topic.status === 'completed' ? 'fa-check-circle' : topic.status === 'in-progress' ? 'fa-clock' : 'fa-circle-notch'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                              <p className="text-sm font-semibold text-content-main truncate">{topic.topic}</p>
                              <span className="text-[10px] font-bold text-content-muted whitespace-nowrap bg-boundary-subtle px-2 py-0.5 rounded-md w-fit">
                                {topic.unit || 'Unit 1'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1 bg-boundary-subtle rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-700 ${
                                    topic.status === 'completed' ? 'bg-emerald-500' :
                                    topic.status === 'in-progress' ? 'bg-amber-500' :
                                    'bg-content-muted'
                                  }`}
                                  style={{ width: `${topic.progress}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-content-muted">{topic.progress}%</span>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this topic?')) deleteSyllabus(topic.id);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-red-500/10 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                          >
                            <i className="fas fa-trash-alt text-xs" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center border-2 border-dashed border-boundary-subtle rounded-2xl">
                        <p className="text-xs text-content-muted">No topics tracked for this subject yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="lg:col-span-2 py-20 glass-card flex flex-col items-center justify-center text-center px-6 border-dashed">
              <div className="w-16 h-16 rounded-3xl bg-brand-alpha flex items-center justify-center mb-6 text-brand-500 text-2xl animate-float">
                <i className="fas fa-mortar-board" />
              </div>
              <h2 className="text-xl font-bold text-content-main mb-2">Initialize your {activeTab} Journey</h2>
              <p className="text-content-muted max-w-sm mb-8 text-sm leading-relaxed">
                Add subjects for this semester to start tracking your syllabus and academic goals.
              </p>
            </div>
          )}
        </div>
      </main>

      <Modal 
        id="syllabus-topic-modal"
        isOpen={isAddModalOpen} 
        onClose={closeModal} 
        title={editingTopic ? 'Edit Topic' : 'Add New Topic'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Subject</label>
            <select 
              className="w-full input-field"
              value={formData.subjectId}
              onChange={e => setFormData(f => ({ ...f, subjectId: e.target.value }))}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Topic Name</label>
              <input 
                className="w-full input-field"
                value={formData.topic}
                onChange={e => setFormData(f => ({ ...f, topic: e.target.value }))}
                placeholder="e.g. Memory Management"
                required
              />
            </div>
            <div>
              <label className="field-label">Unit / Module</label>
              <input 
                className="w-full input-field"
                value={formData.unit}
                onChange={e => setFormData(f => ({ ...f, unit: e.target.value }))}
                placeholder="e.g. Unit 1"
              />
            </div>
          </div>
          <div>
            <label className="field-label">Status</label>
            <div className="flex gap-2 p-1 bg-surface-input rounded-xl border border-boundary-subtle">
              {(['not-started', 'in-progress', 'completed'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, status: s, progress: s === 'completed' ? 100 : s === 'not-started' ? 0 : f.progress }))}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                    formData.status === s ? 'bg-white dark:bg-brand-500 shadow-sm text-brand-500 dark:text-white' : 'text-content-muted hover:text-content-main'
                  }`}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="field-label mb-0">Progress Percentage</label>
              <span className="text-xs font-bold text-brand-500">{formData.progress}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={e => setFormData(f => ({ ...f, progress: parseInt(e.target.value), status: parseInt(e.target.value) === 100 ? 'completed' : parseInt(e.target.value) === 0 ? 'not-started' : 'in-progress' }))}
              className="w-full accent-brand-500"
            />
          </div>
          <div>
            <label className="field-label">Notes / Description</label>
            <textarea 
              className="w-full input-field min-h-[100px]"
              value={formData.description}
              onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              placeholder="What will you learn in this topic?"
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3">
            {editingTopic ? 'Update Topic' : 'Add to Syllabus'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
