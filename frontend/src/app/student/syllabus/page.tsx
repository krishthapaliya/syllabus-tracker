'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';
import { SyllabusTopic } from '@/lib/types';

export default function StudentSyllabusPage() {
  const { subjects, syllabus, t } = useApp();
  const [activeTab, setActiveTab] = useState<'Semester 1' | 'Semester 2' | 'Semester 3' | 'Semester 4'>('Semester 1');
  const [viewingTopic, setViewingTopic] = useState<SyllabusTopic | null>(null);

  const filteredSubjects = subjects.filter(s => s.semester === activeTab);

  return (
    <div className="min-h-screen bg-surface-body pb-20">
      <main className="max-w-7xl mx-auto px-6 mt-8 animate-fade-in">
        {/* Semester Tabs */}
        <div className="flex items-center gap-2 mb-8 p-1.5 bg-surface-card/50 backdrop-blur-md rounded-full w-fit border border-boundary-subtle">
          {(['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'] as const).map(sem => (
            <button
              key={sem}
              onClick={() => setActiveTab(sem)}
              className={`nav-tab ${activeTab === sem ? 'nav-tab-active' : 'text-content-muted'}`}
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
                <div key={subject.id} className="glass-card overflow-hidden group">
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
                  </div>

                  {/* Topics List */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-2">Course Modules</p>

                    {subjectTopics.length > 0 ? (
                      subjectTopics.map(topic => (
                        <div 
                          key={topic.id}
                          onClick={() => setViewingTopic(topic)}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-surface-body/50 border border-boundary-subtle hover:bg-surface-card transition-all cursor-pointer group/item"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            topic.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                            topic.status === 'in-progress' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-content-muted/10 text-content-muted'
                          }`}>
                            <i className={`fas ${topic.status === 'completed' ? 'fa-check-circle' : topic.status === 'in-progress' ? 'fa-clock' : 'fa-circle-notch'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-semibold text-content-main truncate">{topic.topic}</p>
                              <span className="text-[10px] font-bold text-content-muted whitespace-nowrap ml-2">
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
                <i className="fas fa-book-reader" />
              </div>
              <h2 className="text-xl font-bold text-content-main mb-2">No subjects found for {activeTab}</h2>
              <p className="text-content-muted max-w-sm mb-8 text-sm leading-relaxed">
                Your syllabus will appear here once the administrator adds subjects to this semester.
              </p>
            </div>
          )}
        </div>
      </main>

      <Modal 
        id="topic-view-modal"
        isOpen={!!viewingTopic} 
        onClose={() => setViewingTopic(null)} 
        title="Topic Details"
      >
        {viewingTopic && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-brand-alpha border border-brand-strong">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-500 mb-1 block">
                {viewingTopic.unit || 'Module'}
              </span>
              <h3 className="text-lg font-bold text-content-main leading-tight">{viewingTopic.topic}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface-input border border-boundary-subtle">
                <p className="text-[10px] font-bold text-content-muted uppercase mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    viewingTopic.status === 'completed' ? 'bg-emerald-500' :
                    viewingTopic.status === 'in-progress' ? 'bg-amber-500' :
                    'bg-content-muted'
                  }`} />
                  <span className="text-sm font-semibold capitalize">{viewingTopic.status.replace('-', ' ')}</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-input border border-boundary-subtle">
                <p className="text-[10px] font-bold text-content-muted uppercase mb-1">Completion</p>
                <p className="text-sm font-bold text-content-main">{viewingTopic.progress}%</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-input border border-boundary-subtle">
              <p className="text-[10px] font-bold text-content-muted uppercase mb-2">Detailed Notes</p>
              <p className="text-sm text-content-muted leading-relaxed whitespace-pre-wrap">
                {viewingTopic.description || 'No additional details available for this topic.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
