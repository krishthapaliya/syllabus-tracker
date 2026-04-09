import StudentAppShell from '@/components/StudentAppShell';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <StudentAppShell>{children}</StudentAppShell>;
}
