import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Cargar variables del archivo .env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...values] = trimmed.split('=');
      env[key.trim()] = values.join('=').trim();
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: No se encontro VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Mapeo canonico oficial de los 66 libros
const CANONICAL_BOOK_NAMES = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
  'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel',
  '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras',
  'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios',
  'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías', 'Lamentaciones',
  'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós',
  'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc',
  'Sofonías', 'Hageo', 'Zacarías', 'Malaquías', 'Mateo',
  'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos',
  '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 'Filipenses',
  'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo',
  'Tito', 'Filemón', 'Hebreos', 'Santiago', '1 Pedro',
  '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas',
  'Apocalipsis'
];

const TRANSLATIONS = [
  {
    code: 'NVI',
    name: 'Nueva Versión Internacional',
    url: 'https://raw.githubusercontent.com/mrk214/bible-data-es-spa/main/data/es___spa___spa/NVI_vid_128.json',
    credits: 'Santa Biblia, NUEVA VERSIÓN INTERNACIONAL NVI © 1999, 2015 por Bíblica, Inc. Usado con permiso.'
  },
  {
    code: 'NTV',
    name: 'Nueva Traducción Viviente',
    url: 'https://raw.githubusercontent.com/mrk214/bible-data-es-spa/main/data/es___spa___spa/NTV_vid_127.json',
    credits: 'Santa Biblia, Nueva Traducción Viviente, © Tyndale House Foundation, 2010. Usado con permiso de Tyndale House Publishers.'
  }
];

const BATCH_SIZE = 400;

async function seedTranslation(translation) {
  console.log('\n==============================================');
  console.log(` Siembra de: ${translation.name} (${translation.code})`);
  console.log(` Créditos: ${translation.credits}`);
  console.log('==============================================');

  console.log(`Descargando datos desde: ${translation.url}`);
  const response = await fetch(translation.url);
  if (!response.ok) {
    throw new Error(`Fallo al descargar ${translation.code}: ${response.status} ${response.statusText}`);
  }

  const rawData = await response.json();
  console.log(`Se recibieron ${rawData.books.length} libros.`);

  const allVerses = [];
  let globalOrder = 1;

  for (let bIndex = 0; bIndex < rawData.books.length; bIndex++) {
    const rawBook = rawData.books[bIndex];
    const bookOrder = bIndex + 1;
    const bookName = CANONICAL_BOOK_NAMES[bIndex] || rawBook.human;

    for (let cIndex = 0; cIndex < rawBook.chapters.length; cIndex++) {
      const rawChapter = rawBook.chapters[cIndex];
      const chapterNumber = cIndex + 1;

      // Agrupar segmentos de versiculos para unir versiculos poéticos o divididos
      const versesMap = new Map();
      if (rawChapter.items && Array.isArray(rawChapter.items)) {
        for (const item of rawChapter.items) {
          if (item.type === 'verse' && item.verse_numbers && item.verse_numbers.length > 0) {
            const vNum = item.verse_numbers[0];
            const textPart = item.lines.join(' ').replace(/<[^>]+>/g, '').trim();
            if (!versesMap.has(vNum)) {
              versesMap.set(vNum, textPart);
            } else {
              versesMap.set(vNum, (versesMap.get(vNum) + ' ' + textPart).trim());
            }
          }
        }
      }

      // Ordenar versiculos numericamente dentro del capitulo
      const sortedVerseNumbers = Array.from(versesMap.keys()).sort((a, b) => a - b);

      for (const verseNumber of sortedVerseNumbers) {
        const verseText = versesMap.get(verseNumber);
        if (!verseText) continue;

        allVerses.push({
          book_name: bookName,
          book_order: bookOrder,
          chapter: chapterNumber,
          verse_number: verseNumber,
          text: verseText,
          version: translation.code,
          chapter_context: `${bookName.toUpperCase()} · CAP. ${chapterNumber}`,
          global_order: globalOrder,
        });

        globalOrder++;
      }
    }
  }

  const totalVerses = allVerses.length;
  const totalBatches = Math.ceil(totalVerses / BATCH_SIZE);
  console.log(`Total de versiculos a ingresar para ${translation.code}: ${totalVerses} en ${totalBatches} lotes.`);

  let insertedCount = 0;

  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, totalVerses);
    const batch = allVerses.slice(start, end);

    let attempts = 0;
    let success = false;

    while (attempts < 3 && !success) {
      attempts++;
      const { error } = await supabase.from('verses').upsert(batch, {
        onConflict: 'version,book_order,chapter,verse_number',
      });

      if (error) {
        console.warn(`[${translation.code} Reintento ${attempts}/3 en lote ${i + 1}] Error: ${error.message}`);
        await new Promise((res) => setTimeout(res, 1500));
      } else {
        success = true;
        insertedCount += batch.length;
      }
    }

    if (!success) {
      console.error(`Error critico: No se pudo ingresar el lote ${i + 1} de ${translation.code}. Continuando con el siguiente lote...`);
    }

    if ((i + 1) % 10 === 0 || i + 1 === totalBatches) {
      const percent = Math.round((insertedCount / totalVerses) * 100);
      console.log(`[${translation.code}] Progreso: ${insertedCount}/${totalVerses} versiculos (${percent}%) - Lote ${i + 1}/${totalBatches}`);
    }
  }

  console.log(`Completada la siembra de ${translation.code}: ${insertedCount} versiculos registrados con exito.`);
}

async function run() {
  const arg = process.argv[2] ? process.argv[2].toUpperCase().replace('--', '') : 'ALL';

  if (arg === 'NVI') {
    await seedTranslation(TRANSLATIONS[0]);
  } else if (arg === 'NTV') {
    await seedTranslation(TRANSLATIONS[1]);
  } else {
    // Sembrar ambas versiones
    await seedTranslation(TRANSLATIONS[0]); // NVI
    await seedTranslation(TRANSLATIONS[1]); // NTV
  }

  console.log('\nProceso de siembra finalizado exitosamente.');
}

run().catch((err) => {
  console.error('Error durante la ejecucion:', err);
  process.exit(1);
});

