'use client';
import { useState, useEffect } from 'react';
import StudentSidebar from './StudentSidebar';
import Topbar from './Topbar';
import { usePathname } from 'next/navigation';

export default function StudentAppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getPageTitle = () => {
    if (pathname.includes('/student/dashboard')) return { title: 'Student Dashboard', sub: 'Overview of classes & timeline' };
    if (pathname.includes('/student/notes')) return { title: 'Study Notes', sub: 'View and download course materials' };
    if (pathname.includes('/student/assignments')) return { title: 'Assignments', sub: 'Track active coursework' };
    if (pathname.includes('/student/exams')) return { title: 'Exam Routine', sub: 'View scheduled tests' };
    if (pathname.includes('/student/syllabus')) return { title: 'Syllabus', sub: 'Track your curriculum' };
    return { title: 'Student Portal', sub: 'EduPortal' };
  };

  const { title, sub } = getPageTitle();

  return (
    <div className="flex h-screen bg-surface-body text-content-main overflow-hidden transition-colors duration-300">
      <StudentSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        <Topbar title={title} subtitle={sub} onMenuClick={() => setCollapsed(!collapsed)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-body p-4 sm:p-8 transition-colors duration-300">
           <div className="max-w-7xl mx-auto w-full pb-20 animate-fade-in">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}
