'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { PaperData } from '@/shared/utils/paperReference';

interface Collection {
  id: string;
  name: string;
  description?: string;
  paperIds: string[];
  createdAt: Date;
  color?: string;
}

interface Note {
  id: string;
  paperId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface ResearchContextType {
    collections: Collection[];
  createCollection: (name: string, description?: string, color?: string) => void;
  deleteCollection: (id: string) => void;
  addPaperToCollection: (collectionId: string, paperId: string) => void;
  removePaperFromCollection: (collectionId: string, paperId: string) => void;

    notes: Note[];
  createNote: (paperId: string, content: string, tags?: string[]) => void;
  updateNote: (id: string, content: string, tags?: string[]) => void;
  deleteNote: (id: string) => void;
  getNotesByPaper: (paperId: string) => Note[];

    savedPapers: string[];
  savePaper: (paperId: string) => void;
  unsavePaper: (paperId: string) => void;
  isSaved: (paperId: string) => boolean;

    compareList: PaperData[];
  addToCompare: (paper: PaperData) => void;
  removeFromCompare: (paperId: string) => void;
  clearCompare: () => void;

    readingProgress: Record<string, number>;   updateProgress: (paperId: string, percentage: number) => void;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [savedPapers, setSavedPapers] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<PaperData[]>([]);
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});

    useEffect(() => {
    const savedCollections = localStorage.getItem('research_collections');
    const savedNotes = localStorage.getItem('research_notes');
    const savedPapersList = localStorage.getItem('research_saved_papers');
    const savedProgress = localStorage.getItem('research_progress');

    if (savedCollections) setCollections(JSON.parse(savedCollections));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedPapersList) setSavedPapers(JSON.parse(savedPapersList));
    if (savedProgress) setReadingProgress(JSON.parse(savedProgress));
  }, []);

    useEffect(() => {
    localStorage.setItem('research_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('research_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('research_saved_papers', JSON.stringify(savedPapers));
  }, [savedPapers]);

  useEffect(() => {
    localStorage.setItem('research_progress', JSON.stringify(readingProgress));
  }, [readingProgress]);

    const createCollection = (name: string, description?: string, color?: string) => {
    const newCollection: Collection = {
      id: `col_${Date.now()}`,
      name,
      description,
      paperIds: [],
      createdAt: new Date(),
      color: color || '#6366f1'
    };
    setCollections(prev => [...prev, newCollection]);
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  const addPaperToCollection = (collectionId: string, paperId: string) => {
    setCollections(prev =>
      prev.map(c =>
        c.id === collectionId && !c.paperIds.includes(paperId)
          ? { ...c, paperIds: [...c.paperIds, paperId] }
          : c
      )
    );
  };

  const removePaperFromCollection = (collectionId: string, paperId: string) => {
    setCollections(prev =>
      prev.map(c =>
        c.id === collectionId
          ? { ...c, paperIds: c.paperIds.filter(p => p !== paperId) }
          : c
      )
    );
  };

    const createNote = (paperId: string, content: string, tags: string[] = []) => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      paperId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, content: string, tags?: string[]) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, content, tags: tags || n.tags, updatedAt: new Date() }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const getNotesByPaper = (paperId: string) => {
    return notes.filter(n => n.paperId === paperId);
  };

    const savePaper = (paperId: string) => {
    setSavedPapers(prev =>
      prev.includes(paperId) ? prev : [...prev, paperId]
    );
  };

  const unsavePaper = (paperId: string) => {
    setSavedPapers(prev => prev.filter(p => p !== paperId));
  };

  const isSaved = (paperId: string) => {
    return savedPapers.includes(paperId);
  };

    const addToCompare = (paper: PaperData) => {
    setCompareList(prev =>
      prev.length < 5 && !prev.find(p => p.paper_id === paper.paper_id)
        ? [...prev, paper]
        : prev
    );
  };

  const removeFromCompare = (paperId: string) => {
    setCompareList(prev => prev.filter(p => p.paper_id !== paperId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

    const updateProgress = (paperId: string, percentage: number) => {
    setReadingProgress(prev => ({ ...prev, [paperId]: percentage }));
  };

  return (
    <ResearchContext.Provider
      value={{
        collections,
        createCollection,
        deleteCollection,
        addPaperToCollection,
        removePaperFromCollection,
        notes,
        createNote,
        updateNote,
        deleteNote,
        getNotesByPaper,
        savedPapers,
        savePaper,
        unsavePaper,
        isSaved,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        readingProgress,
        updateProgress
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within ResearchProvider');
  }
  return context;
}
