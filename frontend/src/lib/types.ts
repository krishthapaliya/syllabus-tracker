export interface Subject {
  id: string;
  name: string;
  code?: string;
  semester?: string;
  teacher?: string;
  color: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  subjectId: string;
  chapter?: string;
  description?: string;
  link?: string;
  file?: string;
  tags?: string;
  dateUploaded?: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string;
  dueTime?: string;
  totalMarks?: string;
  marks?: string;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
  link?: string;
  file?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  examDate: string;
  examTime: string;
  duration?: string;
  venue?: string;
  marks?: string;
  examType: 'midterm' | 'final' | 'quiz' | 'practical' | 'internal';
  notes?: string;
  createdAt: string;
}

export interface SyllabusTopic {
  id: string;
  topic: string;
  subjectId: string;
  unit?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  plannedDate?: string;
  completionDate?: string;
  description?: string;
  progress: number;
  createdAt: string;
}

export type AssignmentStatus = 'overdue' | 'due-soon' | 'active';
