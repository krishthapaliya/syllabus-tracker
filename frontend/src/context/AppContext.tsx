'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Subject, Note, Assignment, Exam, SyllabusTopic } from '@/lib/types';
import { Locale, TRANSLATIONS, TranslationKey } from '@/lib/i18n';
import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type ThemeMode = 'light' | 'dark';
export type ColorTheme = 'indigo' | 'emerald' | 'rose' | 'amber';


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
  addNote: (data: any) => Promise<void>;
  updateNote: (id: string, data: any) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addAssignment: (data: any) => Promise<void>;
  updateAssignment: (id: string, data: any) => Promise<void>;
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
        const collections = ['subjects', 'notes', 'assignments', 'exams', 'syllabus'];
        const results: any = {};

        await Promise.all(collections.map(async (col) => {
          const q = query(collection(db, col), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          results[col] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamps to strings or Date objects as expected by UI
            createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
          }));
        }));
        
        setSubjects(results.subjects);
        setNotes(results.notes);
        setAssignments(results.assignments);
        setExams(results.exams);
        setSyllabus(results.syllabus);
      } catch (err) {
        console.error("Failed to connect to Firebase:", err);
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

  // Helper for file uploads to Firebase Storage
  const uploadFile = async (file: File, path: string) => {
    const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  // Subjects
  const addSubject = useCallback(async (data: Omit<Subject, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'subjects'), {
      ...data,
      createdAt: serverTimestamp()
    });
    setSubjects(prev => [{ id: docRef.id, ...data, createdAt: new Date().toISOString() } as Subject, ...prev]);
  }, []);

  const deleteSubject = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'subjects', id));
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  // Notes
  const addNote = useCallback(async (data: any) => {
    let fileUrl = null;
    let finalData = { ...data };

    if (data instanceof FormData) {
      const file = data.get('file') as File;
      if (file) {
        fileUrl = await uploadFile(file, 'notes');
      }
      finalData = Object.fromEntries(data.entries());
      delete finalData.file;
      if (fileUrl) finalData.link = fileUrl;
    }

    const docRef = await addDoc(collection(db, 'notes'), {
      ...finalData,
      createdAt: serverTimestamp()
    });
    setNotes(prev => [{ id: docRef.id, ...finalData, createdAt: new Date().toISOString() } as Note, ...prev]);
  }, []);

  const updateNote = useCallback(async (id: string, data: any) => {
    let finalData = { ...data };
    if (data instanceof FormData) {
      const file = data.get('file') as File;
      if (file) {
        const fileUrl = await uploadFile(file, 'notes');
        finalData = Object.fromEntries(data.entries());
        delete finalData.file;
        finalData.link = fileUrl;
      } else {
        finalData = Object.fromEntries(data.entries());
        delete finalData.file;
      }
    }
    await updateDoc(doc(db, 'notes', id), finalData);
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...finalData } : n));
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'notes', id));
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  // Assignments
  const addAssignment = useCallback(async (data: any) => {
    let fileUrl = null;
    let finalData = { ...data };

    if (data instanceof FormData) {
      const file = data.get('file') as File;
      if (file) {
        fileUrl = await uploadFile(file, 'assignments');
      }
      finalData = Object.fromEntries(data.entries());
      delete finalData.file;
      if (fileUrl) finalData.link = fileUrl;
    }

    const docRef = await addDoc(collection(db, 'assignments'), {
      ...finalData,
      createdAt: serverTimestamp()
    });
    setAssignments(prev => [{ id: docRef.id, ...finalData, createdAt: new Date().toISOString() } as Assignment, ...prev]);
  }, []);

  const updateAssignment = useCallback(async (id: string, data: any) => {
    let finalData = { ...data };
    if (data instanceof FormData) {
      const file = data.get('file') as File;
      if (file) {
        const fileUrl = await uploadFile(file, 'assignments');
        finalData = Object.fromEntries(data.entries());
        delete finalData.file;
        finalData.link = fileUrl;
      } else {
        finalData = Object.fromEntries(data.entries());
        delete finalData.file;
      }
    }
    await updateDoc(doc(db, 'assignments', id), finalData);
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...finalData } : a));
  }, []);

  const deleteAssignment = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'assignments', id));
    setAssignments(prev => prev.filter(a => a.id !== id));
  }, []);

  // Exams
  const addExam = useCallback(async (data: Omit<Exam, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'exams'), {
      ...data,
      createdAt: serverTimestamp()
    });
    setExams(prev => [{ id: docRef.id, ...data, createdAt: new Date().toISOString() } as Exam, ...prev]);
  }, []);

  const updateExam = useCallback(async (id: string, data: Partial<Exam>) => {
    await updateDoc(doc(db, 'exams', id), data);
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  }, []);

  const deleteExam = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'exams', id));
    setExams(prev => prev.filter(e => e.id !== id));
  }, []);

  // Syllabus
  const addSyllabus = useCallback(async (data: Omit<SyllabusTopic, 'id' | 'createdAt'>) => {
    const docRef = await addDoc(collection(db, 'syllabus'), {
      ...data,
      createdAt: serverTimestamp()
    });
    setSyllabus(prev => [{ id: docRef.id, ...data, createdAt: new Date().toISOString() } as SyllabusTopic, ...prev]);
  }, []);

  const updateSyllabus = useCallback(async (id: string, data: Partial<SyllabusTopic>) => {
    await updateDoc(doc(db, 'syllabus', id), data);
    setSyllabus(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, []);

  const deleteSyllabus = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'syllabus', id));
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
