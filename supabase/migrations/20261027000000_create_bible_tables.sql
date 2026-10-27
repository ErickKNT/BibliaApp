-- Migracion inicial: Esquema de base de datos para BibliaApp
-- Autor: BibliaApp Development Team
-- Fecha: 2026-10-27

-- 1. Tabla de Versiculos de la Biblia
create table if not exists public.verses (
  id uuid primary key default gen_random_uuid(),
  book_name text not null,
  book_order int not null,           -- 1 para Genesis, 43 para Juan, etc.
  chapter int not null,              -- Numero de capitulo
  verse_number int not null,         -- Numero de versiculo
  text text not null,                -- Texto del versiculo
  version text not null default 'RVR09', -- Traduccion (RVR09, WEB, BL95, etc.)
  chapter_context text,              -- Ej: 'JUAN · CAP. 1'
  historical_context text,           -- Ej: 'Prologo teologico de la encarnacion'
  global_order int not null,         -- Indice secuencial 1..31102 para scroll infinito
  created_at timestamptz default now() not null,
  constraint uq_verse unique (version, book_order, chapter, verse_number)
);

-- Indices para lectura eficiente en scroll infinito
create index if not exists idx_verses_version_order on public.verses (version, global_order);
create index if not exists idx_verses_book_chapter on public.verses (book_order, chapter);

-- 2. Tabla de Me Gusta (Likes)
create table if not exists public.verse_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  verse_id uuid references public.verses(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  constraint uq_user_verse_like unique (user_id, verse_id)
);

create index if not exists idx_verse_likes_user on public.verse_likes (user_id);
create index if not exists idx_verse_likes_verse on public.verse_likes (verse_id);

-- 3. Tabla de Notas y Reflexiones
create table if not exists public.verse_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  verse_id uuid references public.verses(id) on delete cascade not null,
  content text not null,
  is_private boolean not null default true,
  category text not null default 'personal', -- 'personal', 'comunidad', 'referencia'
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_verse_notes_user on public.verse_notes (user_id);
create index if not exists idx_verse_notes_verse on public.verse_notes (verse_id);

-- 4. Trigger para actualizar automaticamente updated_at en verse_notes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger tr_verse_notes_updated_at
  before update on public.verse_notes
  for each row
  execute function public.handle_updated_at();

-- 5. Habilitacion estricta de Row Level Security (RLS)
alter table public.verses enable row level security;
alter table public.verse_likes enable row level security;
alter table public.verse_notes enable row level security;

-- Politicas RLS para Versiculos: Lectura publica total
create policy "Verses are viewable by everyone"
  on public.verses
  for select
  using (true);

-- Politicas RLS para Me Gusta: Control exclusivo del usuario autenticado
create policy "Users can view their own likes"
  on public.verse_likes
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own likes"
  on public.verse_likes
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.verse_likes
  for delete
  using (auth.uid() = user_id);

-- Politicas RLS para Notas: Propietario o notas publicas de comunidad
create policy "Users can view their own notes or public community notes"
  on public.verse_notes
  for select
  using (auth.uid() = user_id or is_private = false);

create policy "Users can insert their own notes"
  on public.verse_notes
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on public.verse_notes
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.verse_notes
  for delete
  using (auth.uid() = user_id);

