export interface Verse {
  id: string;
  bookName: string;
  bookOrder: number;
  chapter: number;
  verseNumber: number;
  text: string;
  version: string;
  globalOrder: number;
  chapterContext?: string;
  historicalContext?: string;
  likeCount?: number;
  notesCount?: number;
}

export interface VerseLike {
  verseId: string;
  userId: string;
  createdAt: string;
}

export interface VerseNote {
  id: string;
  verseId: string;
  userId: string;
  content: string;
  isPrivate?: boolean;
  category?: 'personal' | 'comunidad' | 'referencia';
  createdAt: string;
  updatedAt: string;
}

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  isPublicDomain: boolean;
  language: string;
}

export interface BibleBook {
  name: string;
  testament: 'antiguo' | 'nuevo';
  chaptersCount: number;
  category: string;
}
