-- Migracion: Tablas de Perfiles de Usuario y Rachas en Supabase
-- Autor: BibliaApp Development Team
-- Fecha: 2026-10-27

-- 1. Tabla de Perfiles de Usuario
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Lector Bíblico',
  avatar_color text not null default '#18181b',
  daily_goal int not null default 5,
  theme text not null default 'dark',
  font_size text not null default 'normal',
  preferred_version text not null default 'RVR1960',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Tabla de Rachas y Habitos de Lectura
create table if not exists public.user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int not null default 1,
  longest_streak int not null default 1,
  last_read_date date not null default current_date,
  total_verses_read int not null default 0,
  history_dates text[] not null default array[]::text[],
  updated_at timestamptz default now() not null
);

-- 3. Habilitacion de RLS
alter table public.user_profiles enable row level security;
alter table public.user_streaks enable row level security;

-- Politicas RLS para user_profiles
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Politicas RLS para user_streaks
create policy "Users can view their own streak"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own streak"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own streak"
  on public.user_streaks for update
  using (auth.uid() = user_id);

-- 4. Triggers de actualizacion de timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger tr_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.handle_updated_at();

create or replace trigger tr_user_streaks_updated_at
  before update on public.user_streaks
  for each row
  execute function public.handle_updated_at();

-- 5. Trigger automatico al registrarse un usuario en auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Lector Bíblico'))
  on conflict (id) do nothing;

  insert into public.user_streaks (user_id, current_streak, longest_streak, last_read_date, total_verses_read, history_dates)
  values (new.id, 1, 1, current_date, 1, array[to_char(current_date, 'YYYY-MM-DD')])
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger tr_on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
