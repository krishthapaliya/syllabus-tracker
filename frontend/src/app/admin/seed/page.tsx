'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SEED_DATA } from '@/lib/seedData';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

export default function SeedPage() {
  const { addSubject, addSyllabus } = useApp();
  const [status, setStatus] = useState<'idle' | 'seeding' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [message, setMessage] = useState('');

  const clearData = async () => {
    if (!confirm('This will delete all subjects and syllabus topics. Are you sure?')) return;
    
    setStatus('seeding');
    setMessage('Clearing existing data...');
    
    try {
      const subSnapshot = await getDocs(collection(db, 'subjects'));
      const sylSnapshot = await getDocs(collection(db, 'syllabus'));
      
      const batch = writeBatch(db);
      subSnapshot.forEach((d) => batch.delete(d.ref));
      sylSnapshot.forEach((d) => batch.delete(d.ref));
      
      await batch.commit();
      setMessage('Data cleared. Starting seed...');
    } catch (err: any) {
      setStatus('error');
      setMessage(`Clear failed: ${err.message}`);
      throw err;
    }
  };

  const handleSeed = async () => {
    try {
      await clearData();
    } catch { return; }

    setStatus('seeding');
    let subjectsCreated = 0;
    let topicsCreated = 0;
    
    const totalSubjects = SEED_DATA.reduce((acc, sem) => acc + sem.subjects.length, 0);
    const totalTopics = SEED_DATA.reduce((acc, sem) => 
      acc + sem.subjects.reduce((sAcc, s) => sAcc + s.topics.length, 0), 0);
    
    setProgress({ current: 0, total: totalSubjects + totalTopics });

    try {
      for (const semData of SEED_DATA) {
        for (const subject of semData.subjects) {
          setMessage(`Adding Subject: ${subject.name}...`);
          
          // Using a temporary ID to link topics properly
          // Note: In a real app, you'd wait for the docRef from Firestore
          // Our addSubject implementation currently handles the Firebase call
          // But it doesn't return the ID. Let's create the ID manually for linking.
          
          const subjectId = doc(collection(db, "subjects")).id;
          
          // Manually calling Firebase or using a modified addSubject?
          // Let's use the db directly for reliable seeding
          
          const subjectRef = doc(db, "subjects", subjectId);
          await writeBatch(db).set(subjectRef, {
            name: subject.name,
            code: subject.code,
            semester: semData.semester,
            color: subject.color,
            creditHours: subject.creditHours,
            fullMarks: subject.fullMarks,
            createdAt: new Date().toISOString()
          }).commit();

          subjectsCreated++;
          setProgress(p => ({ ...p, current: p.current + 1 }));

          for (const topic of subject.topics) {
            setMessage(`Adding Topic: ${topic.topic}...`);
            const topicRef = doc(collection(db, "syllabus"));
            await writeBatch(db).set(topicRef, {
              topic: topic.topic,
              subjectId: subjectId,
              unit: topic.unit,
              status: 'not-started',
              progress: 0,
              createdAt: new Date().toISOString()
            }).commit();
            topicsCreated++;
            setProgress(p => ({ ...p, current: p.current + 1 }));
          }
        }
      }
      
      setStatus('completed');
      setMessage(`Successfully seeded ${subjectsCreated} subjects and ${topicsCreated} topics!`);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(`Seed failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-surface-body flex items-center justify-center p-6">
      <div className="glass-card max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 rounded-3xl bg-brand-alpha flex items-center justify-center mx-auto mb-6 text-brand-500 text-2xl">
          <i className="fas fa-database" />
        </div>
        <h1 className="text-2xl font-bold text-content-main mb-2">Syllabus Seeding Tool</h1>
        <p className="text-content-muted mb-8 text-sm">
          This will populate your database with the M.Sc. CSIT curriculum data.
        </p>

        {status === 'idle' && (
          <button onClick={handleSeed} className="w-full btn-primary py-3">
            Start Seeding Data
          </button>
        )}

        {(status === 'seeding' || status === 'completed' || status === 'error') && (
          <div className="space-y-4">
            <div className="h-2 w-full bg-boundary-subtle rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <p className={`text-sm font-medium ${status === 'error' ? 'text-red-500' : 'text-content-main'}`}>
              {message}
            </p>
            {status === 'completed' && (
              <a href="/syllabus" className="inline-block btn-primary py-2 px-6 mt-4">
                View Syllabus
              </a>
            )}
            {status === 'error' && (
              <button onClick={() => setStatus('idle')} className="text-brand-500 text-xs font-bold underline">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
