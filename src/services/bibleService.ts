import { supabase, isSupabaseConfigured, ensureSession } from '@/lib/supabase';
import type { Verse, VerseNote } from '@/types/bible';
import { CANONICAL_BOOKS } from '@/data/bibleBooks';

export interface LastReading {
  bookOrder: number;
  chapter: number;
  bookName: string;
  verseNumber?: number;
}

// Datos de respaldo offline (Dominio Publico)
const FALLBACK_VERSES: Verse[] = [
  {
    id: 'flp-4-13',
    bookName: 'Filipenses',
    bookOrder: 50,
    chapter: 4,
    verseNumber: 13,
    text: 'Todo lo puedo en Cristo que me fortalece.',
    version: 'RVR09',
    globalOrder: 29462,
    chapterContext: 'FILIPENSES · CAP. 4',
    historicalContext: 'Contexto: Carta desde prision en Roma',
    likeCount: 12400,
    notesCount: 148,
  },
  {
    id: 'jn-1-1',
    bookName: 'Juan',
    bookOrder: 43,
    chapter: 1,
    verseNumber: 1,
    text: 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.',
    version: 'RVR09',
    globalOrder: 26046,
    chapterContext: 'JUAN · CAP. 1',
    historicalContext: 'Contexto: Prologo teologico de la encarnacion',
    likeCount: 9840,
    notesCount: 82,
  },
  {
    id: 'jn-1-5',
    bookName: 'Juan',
    bookOrder: 43,
    chapter: 1,
    verseNumber: 5,
    text: 'Y la luz en las tinieblas resplandece; mas las tinieblas no la comprendieron.',
    version: 'RVR09',
    globalOrder: 26050,
    chapterContext: 'JUAN · CAP. 1',
    historicalContext: 'Contexto: La victoria de la luz sobre el cosmos',
    likeCount: 7120,
    notesCount: 39,
  },
  {
    id: 'sal-23-1',
    bookName: 'Salmos',
    bookOrder: 19,
    chapter: 23,
    verseNumber: 1,
    text: 'Jehova es mi pastor; nada me faltara.',
    version: 'RVR09',
    globalOrder: 14241,
    chapterContext: 'SALMOS · CAP. 23',
    historicalContext: 'Contexto: Salmo pastoral de David en el desierto',
    likeCount: 18900,
    notesCount: 245,
  },
];

interface VerseRow {
  id: string;
  book_name: string;
  book_order: number;
  chapter: number;
  verse_number: number;
  text: string;
  version: string;
  chapter_context?: string;
  historical_context?: string;
  global_order: number;
}

function mapVerseRow(row: VerseRow): Verse {
  return {
    id: row.id,
    bookName: row.book_name,
    bookOrder: row.book_order,
    chapter: row.chapter,
    verseNumber: row.verse_number,
    text: row.text,
    version: row.version,
    chapterContext: row.chapter_context || `${row.book_name.toUpperCase()} · CAP. ${row.chapter}`,
    historicalContext: row.historical_context,
    globalOrder: row.global_order,
  };
}

function createOfflineFallbackVerses(bookOrder: number, chapter: number, version: string): Verse[] {
  const canonical = CANONICAL_BOOKS.find((b) => b.order === bookOrder);
  const bookName = canonical ? canonical.name : `Libro ${bookOrder}`;

  return [
    {
      id: `offline-${bookOrder}-${chapter}-1`,
      bookName,
      bookOrder,
      chapter,
      verseNumber: 1,
      text: `Lectura de ${bookName} capitulo ${chapter}. Conectate a Supabase para cargar los 31,104 versiculos completos de la Biblia.`,
      version,
      chapterContext: `${bookName.toUpperCase()} · CAP. ${chapter}`,
      historicalContext: `Canon Biblico #${bookOrder} · ${canonical?.category || 'Escrituras'}`,
      globalOrder: bookOrder * 1000 + chapter,
      likeCount: 0,
      notesCount: 0,
    },
  ];
}

function getLocalCachedVerses(key: string): Verse[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Almacenamiento no disponible
  }
  return null;
}

function setLocalCachedVerses(key: string, verses: Verse[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(verses));
  } catch {
    // Cuota de almacenamiento excedida
  }
}


/**
 * Obtiene los versiculos iniciales para el feed vertical.
 */
export async function getFeedVerses(version: string = 'RVR1960', limit: number = 30): Promise<Verse[]> {
  if (!isSupabaseConfigured) {
    return FALLBACK_VERSES.map((v) => ({ ...v, version }));
  }

  const cacheKey = 'biblia_cached_feed_' + version;

  try {
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .eq('version', version)
      .order('global_order', { ascending: true })
      .limit(limit);

    if (error || !data || data.length === 0) {
      console.warn('Consulta a Supabase sin resultados con version', version, error?.message);
      // Si la version especificada no esta poblada, intentar RVR1960 como respaldo
      if (version !== 'RVR1960') {
        const { data: fallbackData } = await supabase
          .from('verses')
          .select('*')
          .eq('version', 'RVR1960')
          .order('global_order', { ascending: true })
          .limit(limit);

        if (fallbackData && fallbackData.length > 0) {
          const fallbackVerses = fallbackData.map(mapVerseRow);
          setLocalCachedVerses(cacheKey, fallbackVerses);
          return fallbackVerses;
        }
      }
      const localCached = getLocalCachedVerses(cacheKey);
      if (localCached) return localCached;
      return FALLBACK_VERSES.map((v) => ({ ...v, version }));
    }

    const mapped = data.map(mapVerseRow);
    setLocalCachedVerses(cacheKey, mapped);
    return mapped;
  } catch (err) {
    console.error('Error al consultar versiculos en Supabase:', err);
    const localCached = getLocalCachedVerses(cacheKey);
    if (localCached) return localCached;
    return FALLBACK_VERSES.map((v) => ({ ...v, version }));
  }
}

/**
 * Obtiene versiculos a partir de un libro y capitulo especifico para navegacion directa.
 */
export async function getVersesByBookAndChapter(
  bookOrder: number,
  chapter: number,
  version: string = 'RVR1960',
  limit: number = 40
): Promise<Verse[]> {
  const cacheKey = 'biblia_cached_chap_' + version + '_' + bookOrder + '_' + chapter;

  if (!isSupabaseConfigured) {
    const cached = getLocalCachedVerses(cacheKey);
    if (cached) return cached;
    return createOfflineFallbackVerses(bookOrder, chapter, version);
  }

  try {
    // 1. Obtener el global_order del versiculo 1 de ese capitulo
    const { data: firstVerse, error: firstError } = await supabase
      .from('verses')
      .select('global_order')
      .eq('version', version)
      .eq('book_order', bookOrder)
      .eq('chapter', chapter)
      .order('verse_number', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstError || !firstVerse) {
      // Reintentar con version RVR1960 si la actual no devuelve resultados
      if (version !== 'RVR1960') {
        return getVersesByBookAndChapter(bookOrder, chapter, 'RVR1960', limit);
      }
      console.warn(`No se encontro el versiculo para libro ${bookOrder}, capitulo ${chapter}`);
      return createOfflineFallbackVerses(bookOrder, chapter, version);
    }

    // 2. Traer el lote de versiculos a partir de ese global_order para lectura fluida
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .eq('version', version)
      .gte('global_order', firstVerse.global_order)
      .order('global_order', { ascending: true })
      .limit(limit);

    if (error || !data || data.length === 0) {
      const cached = getLocalCachedVerses(cacheKey);
      if (cached) return cached;
      return createOfflineFallbackVerses(bookOrder, chapter, version);
    }

    const mapped = data.map(mapVerseRow);
    setLocalCachedVerses(cacheKey, mapped);
    return mapped;
  } catch (err) {
    console.error('Error al cargar versiculos por libro y capitulo:', err);
    const cached = getLocalCachedVerses(cacheKey);
    if (cached) return cached;
    return createOfflineFallbackVerses(bookOrder, chapter, version);
  }
}

/**
 * Carga el siguiente lote de versiculos para scroll infinito progresivo.
 */
export async function getMoreVerses(
  afterGlobalOrder: number,
  version: string = 'RVR1960',
  limit: number = 30
): Promise<Verse[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .eq('version', version)
      .gt('global_order', afterGlobalOrder)
      .order('global_order', { ascending: true })
      .limit(limit);

    if (error || !data) return [];
    return data.map(mapVerseRow);
  } catch (err) {
    console.error('Error al paginar mas versiculos:', err);
    return [];
  }
}

/**
 * Persiste la ultima lectura del usuario en almacenamiento local.
 */
export function saveLastReading(reading: LastReading): void {
  try {
    localStorage.setItem('biblia_last_reading', JSON.stringify(reading));
  } catch {
    // Almacenamiento no disponible
  }
}

/**
 * Obtiene la ultima lectura guardada o retorna Genesis 1 por defecto.
 */
export function getLastReading(): LastReading {
  try {
    const stored = localStorage.getItem('biblia_last_reading');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Retornar valor inicial
  }
  return {
    bookOrder: 1,
    chapter: 1,
    bookName: 'Génesis',
    verseNumber: 1,
  };
}

/**
 * Alterna el estado de Me Gusta (Like) para un versiculo.
 */
export async function toggleVerseLike(verseId: string, isCurrentlyLiked: boolean): Promise<boolean> {
  const userId = await ensureSession();

  if (!isSupabaseConfigured || !userId) {
    // Persistencia local para modo de desarrollo o sin conexion
    const localLikes = JSON.parse(localStorage.getItem('biblia_likes') || '[]');
    const nextLikes = isCurrentlyLiked
      ? localLikes.filter((id: string) => id !== verseId)
      : [...localLikes, verseId];
    localStorage.setItem('biblia_likes', JSON.stringify(nextLikes));
    return !isCurrentlyLiked;
  }

  try {
    if (isCurrentlyLiked) {
      const { error } = await supabase
        .from('verse_likes')
        .delete()
        .eq('verse_id', verseId)
        .eq('user_id', userId);

      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('verse_likes')
        .insert({
          verse_id: verseId,
          user_id: userId,
        });

      if (error) throw error;
      return true;
    }
  } catch (err) {
    console.error('Error al actualizar Me Gusta en Supabase:', err);
    return isCurrentlyLiked;
  }
}

/**
 * Obtiene las notas de un versiculo especifico.
 */
export async function getVerseNotes(verseId: string): Promise<VerseNote[]> {
  const userId = await ensureSession();

  if (!isSupabaseConfigured || !userId) {
    const localNotes = JSON.parse(localStorage.getItem('biblia_notes') || '[]');
    return localNotes.filter((n: VerseNote) => n.verseId === verseId);
  }

  try {
    const { data, error } = await supabase
      .from('verse_notes')
      .select('*')
      .eq('verse_id', verseId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Error al cargar notas de Supabase:', error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      verseId: row.verse_id,
      userId: row.user_id,
      content: row.content,
      isPrivate: row.is_private,
      category: row.category,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error('Error al obtener notas:', err);
    return [];
  }
}

/**
 * Guarda una nueva nota o reflexion en Supabase.
 */
export async function addVerseNote(
  verseId: string,
  content: string,
  isPrivate: boolean = true,
  category: 'personal' | 'comunidad' | 'referencia' = 'personal'
): Promise<VerseNote | null> {
  const userId = await ensureSession();

  const newNoteData: VerseNote = {
    id: `note-${Date.now()}`,
    verseId,
    userId: userId || 'local-guest-user',
    content,
    isPrivate,
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured || !userId) {
    const localNotes = JSON.parse(localStorage.getItem('biblia_notes') || '[]');
    localStorage.setItem('biblia_notes', JSON.stringify([newNoteData, ...localNotes]));
    return newNoteData;
  }

  try {
    const { data, error } = await supabase
      .from('verse_notes')
      .insert({
        verse_id: verseId,
        user_id: userId,
        content,
        is_private: isPrivate,
        category,
      })
      .select()
      .single();

    if (error || !data) {
      throw error || new Error('No se recibio confirmacion de creacion de nota.');
    }

    return {
      id: data.id,
      verseId: data.verse_id,
      userId: data.user_id,
      content: data.content,
      isPrivate: data.is_private,
      category: data.category,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error('Error al guardar nota en Supabase:', err);
    // Respaldo local si falla la red
    const localNotes = JSON.parse(localStorage.getItem('biblia_notes') || '[]');
    localStorage.setItem('biblia_notes', JSON.stringify([newNoteData, ...localNotes]));
    return newNoteData;
  }
}

