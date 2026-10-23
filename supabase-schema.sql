-- OPTIONAL STARTING SCHEMA — inspect and run in Supabase SQL Editor only after reviewing.
-- The current UI still uses localStorage; these tables are not yet wired to the frontend.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text default 'en',
  timezone text,
  personalization_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  planned_at timestamptz,
  duration_minutes integer check (duration_minutes is null or duration_minutes between 1 and 1440),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  status text not null default 'pending' check (status in ('pending','completed','postponed','cancelled')),
  goal_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  target_date date,
  progress integer not null default 0 check (progress between 0 and 100),
  status text not null default 'active' check (status in ('active','completed','paused','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tasks drop constraint if exists tasks_goal_id_fkey;
alter table public.tasks add constraint tasks_goal_id_fkey foreign key (goal_id) references public.goals(id) on delete set null;
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.goals enable row level security;
drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile" on public.profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Users manage own tasks" on public.tasks;
create policy "Users manage own tasks" on public.tasks for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage own goals" on public.goals;
create policy "Users manage own goals" on public.goals for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
