'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Topbar from '@/components/Topbar';

export default function Dashboard() {
  const { subjects, syllabus, assignments, notes, t } = useApp();
  const [activeSemester, setActiveSemester] = React.useState<string>('All');

  const filteredSubjects = subjects.filter(s => activeSemester === 'All' || s.semester === activeSemester);
  const filteredSyllabus = syllabus.filter(t => {
    const sub = subjects.find(s => s.id === t.subjectId);
    return activeSemester === 'All' || sub?.semester === activeSemester;
  });
  const filteredAssignments = assignments.filter(a => filteredSubjects.some(s => s.id === a.subjectId));
  const filteredNotes = notes.filter(n => filteredSubjects.some(s => s.id === n.subjectId));

  // Aggregate Stats
  const totalCredits = filteredSubjects.reduce((acc, sub) => acc + (sub.creditHours || 0), 0);
  
  const stats = [
    { label: 'Total Subjects', value: filteredSubjects.length, icon: 'fa-book', color: 'bg-brand-500' },
    { label: 'Total Credits', value: totalCredits, icon: 'fa-clock', color: 'bg-indigo-500' },
    { label: 'Pending Tasks', value: filteredAssignments.length, icon: 'fa-list-check', color: 'bg-amber-500' },
    { label: 'Course Progress', value: `${filteredSyllabus.length > 0 ? Math.round((filteredSyllabus.filter(t => t.status === 'completed').length / filteredSyllabus.length) * 100) : 0}%`, icon: 'fa-chart-line', color: 'bg-violet-500' }
  ];

  const recentAssignments = filteredAssignments.slice(0, 3);
  const recentNotes = filteredNotes.slice(0, 4);

  return (
    <div className="min-h-screen bg-surface-body pb-20">
      {/* <Topbar 
        title={t('dashboard.welcome' as any) || 'Academy Overview'} 
        subtitle="Manage your academic department and student performance" 
      /> */}

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8 animate-fade-in">
        {/* Semester Filter Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-surface-card/50 backdrop-blur-md rounded-full w-fit border border-boundary-subtle">
          {['All', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'].map(sem => (
            <button
              key={sem}
              onClick={() => setActiveSemester(sem)}
              className={`nav-tab px-5 py-1.5 text-xs font-bold transition-all ${activeSemester === sem ? 'nav-tab-active' : 'text-content-muted hover:text-content-main'}`}
            >
              {sem}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300">
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white text-xl shadow-lg shadow-black/5`}>
                <i className={`fas ${stat.icon}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-content-muted uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-content-main">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-content-main">Course Progress Overview</h3>
                <button className="text-xs font-bold text-brand-500 hover:underline">View All</button>
              </div>
              <div className="glass-card p-6 sm:p-8 bg-gradient-to-br from-brand-500 to-brand-600 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-2">Academic Roadmap</h4>
                  <p className="text-white/80 text-xs sm:text-sm max-w-md mb-8">You have completed {filteredSyllabus.filter(t => t.status === 'completed').length} out of {filteredSyllabus.length} total units in the curriculum.</p>
                  
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl sm:text-5xl font-black">
                       {filteredSyllabus.length > 0 ? Math.round((filteredSyllabus.filter(t => t.status === 'completed').length / filteredSyllabus.length) * 100) : 0}%
                    </span>
                    <span className="text-base sm:text-lg font-bold opacity-60 mb-1">Overall</span>
                  </div>
                  
                  <div className="w-full bg-black/10 h-3 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                    <div 
                      className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-1000"
                      style={{ width: `${filteredSyllabus.length > 0 ? (filteredSyllabus.filter(t => t.status === 'completed').length / filteredSyllabus.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                {/* Visual Flair */}
                <i className="fas fa-graduation-cap absolute -bottom-10 -right-10 text-[150px] sm:text-[200px] opacity-10 -rotate-12" />
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h3 className="text-lg font-bold text-content-main mb-6">Critical Assignments</h3>
                <div className="space-y-4">
                  {recentAssignments.length > 0 ? recentAssignments.map(asg => (
                    <div key={asg.id} className="glass-card p-4 flex items-center gap-4 hover:border-brand-500/20 transition-all">
                      <div className="w-2 h-10 rounded-full bg-amber-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-content-main truncate">{asg.title}</p>
                        <p className="text-[10px] text-content-muted mt-0.5">{asg.dueDate}</p>
                      </div>
                      <i className="fas fa-chevron-right text-content-muted text-xs px-2" />
                    </div>
                  )) : (
                    <div className="py-10 text-center glass-card border-dashed">
                      <p className="text-xs text-content-muted">All caught up!</p>
                    </div>
                  )}
                </div>
              </section>
              
              <section>
                <h3 className="text-lg font-bold text-content-main mb-6">Recent Resources</h3>
                <div className="grid grid-cols-2 gap-4">
                  {recentNotes.length > 0 ? recentNotes.map(note => (
                    <div key={note.id} className="glass-card p-4 hover:bg-brand-alpha transition-all group cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <i className="fas fa-file-pdf" />
                      </div>
                      <p className="text-[11px] font-bold text-content-main truncate leading-tight mb-1">{note.title}</p>
                      <p className="text-[9px] text-content-muted font-bold uppercase tracking-tighter">PDF Document</p>
                    </div>
                  )) : (
                    <div className="col-span-2 py-10 text-center glass-card border-dashed">
                      <p className="text-xs text-content-muted">No notes uploaded.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <section className="glass-card p-6 border-brand-500/10">
              <h3 className="text-base font-bold text-content-main mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-input hover:bg-brand-500 hover:text-white transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-brand-alpha text-brand-500 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                    <i className="fas fa-plus" />
                  </div>
                  <span className="text-sm font-semibold">New Subject</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-input hover:bg-emerald-500 hover:text-white transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-emerald-alpha text-emerald-500 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                    <i className="fas fa-upload" />
                  </div>
                  <span className="text-sm font-semibold">Upload Notes</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-input hover:bg-amber-500 hover:text-white transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-amber-alpha text-amber-500 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                    <i className="fas fa-tasks" />
                  </div>
                  <span className="text-sm font-semibold">Create Assignment</span>
                </button>
              </div>
            </section>

            <section className="glass-card p-6">
              <h3 className="text-base font-bold text-content-main mb-6">Subject Breakdown</h3>
              <div className="space-y-5">
                {filteredSubjects.length > 0 ? filteredSubjects.slice(0, 6).map(sub => {
                  const subTopics = syllabus.filter(t => t.subjectId === sub.id);
                  const progress = subTopics.length > 0 ? Math.round((subTopics.filter(t => t.status === 'completed').length / subTopics.length) * 100) : 0;
                  return (
                    <div key={sub.id}>
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <span className="text-xs font-bold text-content-main truncate max-w-[120px]">{sub.name}</span>
                        <span className="text-[10px] font-bold text-content-muted">{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-input rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-700"
                          style={{ width: `${progress}%`, backgroundColor: sub.color }}
                        />
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-xs text-content-muted text-center py-4">No subjects found.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
