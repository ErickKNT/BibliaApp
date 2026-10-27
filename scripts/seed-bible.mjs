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
// Priorizar la service_role key si existe para saltar RLS, de lo contrario usar la anon key
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

const BIBLE_SOURCE_URL =
  'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr1960.json';
const BATCH_SIZE = 400; // Tamano de lote optimo para Supabase PostgREST

async function fetchBibleData() {
  console.log('Descargando la Biblia completa en espanol (Reina-Valera)...');
  const response = await fetch(BIBLE_SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Fallo al descargar la fuente de datos: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

async function main() {
  console.log('==============================================');
  console.log(' BibliaApp - Siembra Completa de la Biblia');
  console.log('==============================================');
  console.log(`Destino: ${supabaseUrl}`);

  const bibleData = await fetchBibleData();
  console.log(`Se descargaron ${bibleData.length} libros correctamente.`);

  const allVerses = [];
  let globalOrder = 1;

  for (let bIndex = 0; bIndex < bibleData.length; bIndex++) {
    const book = bibleData[bIndex];
    const bookOrder = bIndex + 1;
    const bookName = book.name.trim();

    for (let cIndex = 0; cIndex < book.chapters.length; cIndex++) {
      const chapterNumber = cIndex + 1;
      const chapterVerses = book.chapters[cIndex];

      for (let vIndex = 0; vIndex < chapterVerses.length; vIndex++) {
        const verseNumber = vIndex + 1;
        const verseText = chapterVerses[vIndex].trim();

        allVerses.push({
          book_name: bookName,
          book_order: bookOrder,
          chapter: chapterNumber,
          verse_number: verseNumber,
          text: verseText,
          version: 'RVR1960',
          chapter_context: `${bookName.toUpperCase()} · CAP. ${chapterNumber}`,
          global_order: globalOrder,
        });

        globalOrder++;
      }
    }
  }

  const totalVerses = allVerses.length;
  const totalBatches = Math.ceil(totalVerses / BATCH_SIZE);
  console.log(`Total de versiculos procesados: ${totalVerses} en ${totalBatches} lotes.`);
  console.log('Iniciando carga en Supabase...');

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
        console.warn(`[Reintento ${attempts}/3 en lote ${i + 1}] Error: ${error.message}`);
        if (error.message.includes('row-level security')) {
          console.error('\nError critico: La tabla verses tiene RLS activado y no permite insercion con esta clave.');
          console.error('Solucion:');
          console.error('1. Agrega SUPABASE_SERVICE_ROLE_KEY=tu_clave_secreta en tu archivo .env');
          console.error('   O');
          console.error('2. Ejecuta temporalmente en Supabase SQL Editor:');
          console.error('   create policy "Temp seed" on public.verses for insert with check (true);');
          process.exit(1);
        }
        await new Promise((r) => setTimeout(r, 1500));
      } else {
        success = true;
        insertedCount += batch.length;
        const percent = ((insertedCount / totalVerses) * 100).toFixed(1);
        process.stdout.write(
          `\r[Lote ${i + 1}/${totalBatches}] Insertados ${insertedCount}/${totalVerses} versiculos (${percent}%)...`
        );
      }
    }

    if (!success) {
      console.error(`\nFallo definitivo al insertar el lote ${i + 1}.`);
      process.exit(1);
    }
  }

  console.log('\n==============================================');
  console.log(`Carga completada exitosamente: ${insertedCount} versiculos sembrados.`);
  console.log('==============================================');
  process.exit(0);
}

main().catch((err) => {
  console.error('\nError general durante la ejecucion:', err);
  process.exit(1);
});

