'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Subject, Note, Assignment, Exam, SyllabusTopic } from '@/lib/types';
import { Locale, TRANSLATIONS, TranslationKey } from '@/lib/i18n';

export type ThemeMode = 'light' | 'dark';
export type ColorTheme = 'indigo' | 'emerald' | 'rose' | 'amber';

const API_URL = 'http://127.0.0.1:8000/api';

interface AppContextType {
  // Data
  subjects: Subject[];
  notes: Note[];
  assignments: Assignment[];
  exams: Exam[];
  syllabus: SyllabusTopic[];
  
  // Data Actions
  addSubject: (data: Omit<Subject, 'id' | 'createdAt'>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addNote: (data: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>;
  updateAssignment: (id: string, data: Partial<Assignment>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  addExam: (data: Omit<Exam, 'id' | 'createdAt'>) => Promise<void>;
  updateExam: (id: string, data: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  addSyllabus: (data: Omit<SyllabusTopic, 'id' | 'createdAt'>) => Promise<void>;
  updateSyllabus: (id: string, data: Partial<SyllabusTopic>) => Promise<void>;
  deleteSyllabus: (id: string) => Promise<void>;
  getSubjectById: (id: string) => Subject | undefined;

  // Settings & i18n
  mode: ThemeMode;
  colorTheme: ColorTheme;
  secondaryTheme: ColorTheme;
  locale: Locale;
  setMode: (m: ThemeMode) => void;
  setColorTheme: (c: ColorTheme) => void;
  setSecondaryTheme: (c: ColorTheme) => void;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save<T>(key: string, value: T) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [syllabus, setSyllabus] = useState<SyllabusTopic[]>([]);

  // UI Settings state
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('indigo');
  const [secondaryTheme, setSecondaryThemeState] = useState<ColorTheme>('emerald');
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load Data
  useEffect(() => {
    // UI LocalStorage Sync
    setModeState(load<ThemeMode>('edu_ui_mode', 'dark'));
    setColorThemeState(load<ColorTheme>('edu_ui_color', 'indigo'));
    setSecondaryThemeState(load<ColorTheme>('edu_ui_sec_color', 'emerald'));
    setLocaleState(load<Locale>('edu_ui_locale', 'en'));

    // Fetch API Data
    const fetchData = async () => {
      try {
        const [subRes, notRes, asgRes, exRes, sylRes] = await Promise.all([
          fetch(`${API_URL}/subjects/`),
          fetch(`${API_URL}/notes/`),
          fetch(`${API_URL}/assignments/`),
          fetch(`${API_URL}/exams/`),
          fetch(`${API_URL}/syllabus/`)
        ]);
        
        if (subRes.ok) setSubjects(await subRes.json());
        if (notRes.ok) setNotes(await notRes.json());
        if (asgRes.ok) setAssignments(await asgRes.json());
        if (exRes.ok) setExams(await exRes.json());
        if (sylRes.ok) setSyllabus(await sylRes.json());
      } catch (err) {
        console.error("Failed to connect to Django Backend:", err);
      }
    };
    fetchData();
  }, []);

  // Sync UI Settings to DOM
  useEffect(() => {
    if (typeof window === 'undefined') return;
    save('edu_ui_mode', mode);
    save('edu_ui_color', colorTheme);
    save('edu_ui_sec_color', secondaryTheme);
    save('edu_ui_locale', locale);

    const root = document.documentElement;
    root.classList.remove('dark', 'theme-indigo', 'theme-emerald', 'theme-rose', 'theme-amber', 'theme-sec-indigo', 'theme-sec-emerald', 'theme-sec-rose', 'theme-sec-amber');
    
    if (mode === 'dark') root.classList.add('dark');
    root.classList.add(`theme-${colorTheme}`);
    root.classList.add(`theme-sec-${secondaryTheme}`);
  }, [mode, colorTheme, secondaryTheme, locale]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
  const setColorTheme = useCallback((c: ColorTheme) => setColorThemeState(c), []);
  const setSecondaryTheme = useCallback((c: ColorTheme) => setSecondaryThemeState(c), []);
  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback((key: TranslationKey): string => {
    return TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en'][key] || key;
  }, [locale]);

  // DB API Helpers
  const apiCall = async (endpoint: string, method: string = 'GET', body: any = null) => {
    const isFormData = body instanceof FormData;
    const res = await fetch(`${API_URL}/${endpoint}/`, {
      method,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined)
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    // DELETE typically doesn't return JSON
    if (method === 'DELETE') return null;
    return res.json();
  };

  // Subjects
  const addSubject = useCallback(async (data: Omit<Subject, 'id' | 'createdAt'>) => {
    const newObj = await apiCall('subjects', 'POST', data);
    setSubjects(prev => [newObj, ...prev]);
  }, []);
  const deleteSubject = useCallback(async (id: string) => {
    await apiCall(`subjects/${id}`, 'DELETE');
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  // Notes
  const addNote = useCallback(async (data: any) => {
    const newObj = await apiCall('notes', 'POST', data);
    setNotes(prev => [newObj, ...prev]);
  }, []);
  const updateNote = useCallback(async (id: string, data: Partial<Note>) => {
    const newObj = await apiCall(`notes/${id}`, 'PATCH', data);
    setNotes(prev => prev.map(n => n.id === id ? newObj : n));
  }, []);
  const deleteNote = useCallback(async (id: string) => {
    await apiCall(`notes/${id}`, 'DELETE');
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  // Assignments
  const addAssignment = useCallback(async (data: any) => {
    const newObj = await apiCall('assignments', 'POST', data);
    setAssignments(prev => [newObj, ...prev]);
  }, []);
  const updateAssignment = useCallback(async (id: string, data: Partial<Assignment>) => {
    const newObj = await apiCall(`assignments/${id}`, 'PATCH', data);
    setAssignments(prev => prev.map(a => a.id === id ? newObj : a));
  }, []);
  const deleteAssignment = useCallback(async (id: string) => {
    await apiCall(`assignments/${id}`, 'DELETE');
    setAssignments(prev => prev.filter(a => a.id !== id));
  }, []);

  // Exams
  const addExam = useCallback(async (data: Omit<Exam, 'id' | 'createdAt'>) => {
    const newObj = await apiCall('exams', 'POST', data);
    setExams(prev => [newObj, ...prev]);
  }, []);
  const updateExam = useCallback(async (id: string, data: Partial<Exam>) => {
    const newObj = await apiCall(`exams/${id}`, 'PATCH', data);
    setExams(prev => prev.map(e => e.id === id ? newObj : e));
  }, []);
  const deleteExam = useCallback(async (id: string) => {
    await apiCall(`exams/${id}`, 'DELETE');
    setExams(prev => prev.filter(e => e.id !== id));
  }, []);

  // Syllabus
  const addSyllabus = useCallback(async (data: Omit<SyllabusTopic, 'id' | 'createdAt'>) => {
    const newObj = await apiCall('syllabus', 'POST', data);
    setSyllabus(prev => [newObj, ...prev]);
  }, []);
  const updateSyllabus = useCallback(async (id: string, data: Partial<SyllabusTopic>) => {
    const newObj = await apiCall(`syllabus/${id}`, 'PATCH', data);
    setSyllabus(prev => prev.map(s => s.id === id ? newObj : s));
  }, []);
  const deleteSyllabus = useCallback(async (id: string) => {
    await apiCall(`syllabus/${id}`, 'DELETE');
    setSyllabus(prev => prev.filter(s => s.id !== id));
  }, []);

  const getSubjectById = useCallback((id: string) => subjects.find(s => s.id === id), [subjects]);

  return (
    <AppContext.Provider value={{
      subjects, notes, assignments, exams, syllabus,
      addSubject, deleteSubject,
      addNote, updateNote, deleteNote,
      addAssignment, updateAssignment, deleteAssignment,
      addExam, updateExam, deleteExam,
      addSyllabus, updateSyllabus, deleteSyllabus,
      getSubjectById,
      mode, colorTheme, secondaryTheme, locale,
      setMode, setColorTheme, setSecondaryTheme, setLocale, t
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
