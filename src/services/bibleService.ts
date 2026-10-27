import { supabase, isSupabaseConfigured, ensureSession } from '@/lib/supabase';
import type { Verse, VerseNote } from '@/types/bible';

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

/**
 * Obtiene los versiculos ordenados para el feed vertical.
 */
export async function getFeedVerses(version: string = 'RVR09'): Promise<Verse[]> {
  if (!isSupabaseConfigured) {
    return FALLBACK_VERSES.map((v) => ({ ...v, version }));
  }

  try {
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .eq('version', version)
      .order('global_order', { ascending: true })
      .limit(30);

    if (error || !data || data.length === 0) {
      console.warn('Consulta a Supabase sin resultados o con error, usando respaldo:', error?.message);
      return FALLBACK_VERSES.map((v) => ({ ...v, version }));
    }

    return data.map((row) => ({
      id: row.id,
      bookName: row.book_name,
      bookOrder: row.book_order,
      chapter: row.chapter,
      verseNumber: row.verse_number,
      text: row.text,
      version: row.version,
      chapterContext: row.chapter_context,
      historicalContext: row.historical_context,
      globalOrder: row.global_order,
    }));
  } catch (err) {
    console.error('Error al consultar versiculos en Supabase:', err);
    return FALLBACK_VERSES.map((v) => ({ ...v, version }));
  }
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
