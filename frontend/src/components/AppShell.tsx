'use client';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { usePathname, useRouter } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('edu_auth') !== 'true') {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [pathname]);

  if (!mounted) return null;

  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return { icon: 'fa-th-large', title: 'Dashboard', sub: 'Overview of all your college activities' };
    if (pathname.includes('/notes')) return { icon: 'fa-book-open', title: 'Notes', sub: 'Manage your study materials' };
    if (pathname.includes('/assignments')) return { icon: 'fa-tasks', title: 'Assignments', sub: 'Track and manage coursework' };
    if (pathname.includes('/exams')) return { icon: 'fa-calendar-alt', title: 'Exam Routine', sub: 'Schedule and track upcoming tests' };
    if (pathname.includes('/syllabus')) return { icon: 'fa-list-check', title: 'Syllabus Tracker', sub: 'Track course module progress' };
    if (pathname.includes('/subjects')) return { icon: 'fa-book', title: 'Subjects', sub: 'Manage college subjects and courses' };
    return { icon: 'fa-globe', title: 'EduPortal', sub: 'Admin Portal' };
  };

  const { title, sub } = getPageTitle();

  return (
    <div className="flex h-screen bg-surface-body text-content-main overflow-hidden transition-colors duration-300">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Sidebar Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div className={`flex-1 flex flex-col transition-all duration-300 w-full ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}>
        <Topbar 
          title={title} 
          subtitle={sub} 
          onMenuClick={() => {
            if (window.innerWidth < 1024) {
              setIsMobileMenuOpen(true);
            } else {
              setCollapsed(!collapsed);
            }
          }} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-body p-4 sm:p-8 transition-colors duration-300">
           <div className="max-w-7xl mx-auto w-full pb-20 animate-fade-in px-2 sm:px-0">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}
