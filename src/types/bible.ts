export interface Verse {
  id: string;
  bookName: string;
  bookOrder: number;
  chapter: number;
  verseNumber: number;
  text: string;
  version: string;
  globalOrder: number;
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
