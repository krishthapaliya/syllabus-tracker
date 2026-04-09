import { Assignment, AssignmentStatus, Exam } from './types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(dateStr: string, timeStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(`${dateStr}T${timeStr || '00:00'}`);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function getAssignmentStatus(assignment: Assignment): AssignmentStatus {
  const now = new Date();
  const due = new Date(`${assignment.dueDate}T${assignment.dueTime || '23:59'}`);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffMs < 0) return 'overdue';
  if (diffHours <= 48) return 'due-soon';
  return 'active';
}

export function getCountdownText(assignment: Assignment): string {
  const now = new Date();
  const due = new Date(`${assignment.dueDate}T${assignment.dueTime || '23:59'}`);
  const diffMs = due.getTime() - now.getTime();
  if (diffMs < 0) {
    const ago = Math.abs(diffMs);
    const days = Math.floor(ago / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ago % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h overdue`;
    return `${hours}h overdue`;
  }
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

export function getExamCountdownText(exam: Exam): string {
  const now = new Date();
  const date = new Date(`${exam.examDate}T${exam.examTime || '00:00'}`);
  const diffMs = date.getTime() - now.getTime();
  if (diffMs < 0) return 'Past';
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `In ${days}d ${hours}h`;
  return `In ${hours}h`;
}

export function isExamUpcoming(exam: Exam): boolean {
  return new Date(`${exam.examDate}T${exam.examTime}`) >= new Date();
}

export const SUBJECT_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#3b82f6', '#ec4899', '#14b8a6', '#f97316',
  '#a855f7', '#06b6d4',
];

export const EXAM_TYPE_LABELS: Record<string, string> = {
  midterm: 'Mid-Term',
  final: 'Final Exam',
  quiz: 'Quiz',
  practical: 'Practical',
  internal: 'Internal',
};

export const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  low:    { label: 'Low',    color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
};

export const STATUS_CONFIG = {
  'not-started': { label: 'Not Started', icon: '⭕', color: 'text-indigo-400',  bg: 'bg-indigo-500/10' },
  'in-progress':  { label: 'In Progress', icon: '🔄', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  'completed':    { label: 'Completed',   icon: '✅', color: 'text-green-400',  bg: 'bg-green-500/10'  },
};
