'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function Sidebar({ 
  collapsed, 
  onToggle, 
  isMobileOpen, 
  onMobileClose 
}: { 
  collapsed: boolean; 
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useApp();

  const navItems = [
    { href: '/dashboard',   icon: 'fa-th-large',     label: t('nav.dashboard' as any) || 'Dashboard',       section: 'Main' },
    { href: '/notes',       icon: 'fa-book-open',    label: t('nav.notes' as any) || 'Notes',               section: 'Academic' },
    { href: '/assignments', icon: 'fa-tasks',        label: t('nav.assignments' as any) || 'Assignments',   section: 'Academic' },
    { href: '/exams',       icon: 'fa-calendar-alt', label: t('nav.exams' as any) || 'Exam Routine',        section: 'Academic' },
    { href: '/syllabus',    icon: 'fa-list-check',   label: t('nav.syllabus' as any) || 'Syllabus',         section: 'Academic' },
    { href: '/subjects',    icon: 'fa-book',         label: t('nav.subjects' as any) || 'Subjects',         section: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('edu_auth');
    router.push('/');
  };

  let lastSection = '';

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-surface-body border-r border-boundary-subtle transition-all duration-300 ${
        collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'
      } w-[280px] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-[70px] border-b border-boundary-subtle flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-alpha">
          <i className="fas fa-graduation-cap text-white text-lg" />
        </div>
        {(isMobileOpen || !collapsed) && (
          <div className="overflow-hidden">
            <span className="block font-extrabold text-lg bg-gradient-to-r from-brand-300 to-brand-400 bg-clip-text text-transparent leading-tight whitespace-nowrap">
              EduPortal
            </span>
            <span className="block text-[10px] text-content-muted whitespace-nowrap">Admin Panel</span>
          </div>
        )}
        
        {/* Mobile Close Button */}
        <button 
          onClick={onMobileClose}
          className="lg:hidden ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-content-muted hover:bg-surface-input transition-colors"
        >
          <i className="fas fa-times" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggle}
          className={`hidden lg:flex ml-auto w-7 h-7 rounded-md border border-boundary-subtle bg-surface-input text-content-muted hover:text-brand-500 hover:bg-brand-alpha hover:border-brand-strong items-center justify-center transition-all flex-shrink-0 ${collapsed ? 'rotate-180' : ''}`}
        >
          <i className="fas fa-chevron-left text-xs" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3">
        {navItems.map(item => {
          const showSection = item.section !== lastSection;
          if (showSection) lastSection = item.section;
          const active = pathname === item.href;

          return (
            <div key={item.href}>
              {showSection && !collapsed && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-content-muted px-2 mt-4 mb-1 first:mt-0">
                  {item.section}
                </p>
              )}
              {showSection && collapsed && <div className="h-4" />}
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all group ${
                  active
                    ? 'bg-brand-alpha text-brand-500 border border-brand-strong'
                    : 'text-content-muted hover:bg-boundary-subtle hover:text-content-main'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <i className={`fas ${item.icon} text-base w-5 text-center flex-shrink-0 ${active ? 'text-brand-500' : 'group-hover:text-content-main'}`} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            </div>
          );
        })}

        {/* Logout */}
        {!collapsed && <p className="text-[10px] font-bold uppercase tracking-widest text-content-muted px-2 mt-4 mb-1">Settings</p>}
        {collapsed && <div className="h-4" />}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-content-muted hover:bg-red-500/10 hover:text-red-500 hover:border hover:border-red-500/20 transition-all group"
          title={collapsed ? 'Logout' : undefined}
        >
          <i className="fas fa-sign-out-alt text-base w-5 text-center flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="flex items-center gap-3 px-4 py-4 border-t border-boundary-subtle flex-shrink-0 bg-surface-card">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center font-bold text-sm flex-shrink-0 text-white">
            A
          </div>
          <div className="overflow-hidden">
            <span className="block text-sm font-semibold text-content-main whitespace-nowrap">Admin User</span>
            <span className="block text-xs text-content-muted whitespace-nowrap">admin@college.edu</span>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center py-4 border-t border-boundary-subtle bg-surface-card">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center font-bold text-sm text-white">A</div>
        </div>
      )}
    </aside>
  );
}
