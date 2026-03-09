-- ═══════════════════════════════════════════
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- 2. RLS policies for profiles
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Admins can read all profiles"
on public.profiles for select
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- 3. Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Update cars RLS for admin write access
-- (Drop existing write policies first if they exist)
drop policy if exists "Enable insert for admins" on public.cars;
drop policy if exists "Enable update for admins" on public.cars;
drop policy if exists "Enable delete for admins" on public.cars;
drop policy if exists "Allow anon insert" on public.cars;
drop policy if exists "Allow anon delete" on public.cars;

create policy "Enable insert for admins"
on public.cars for insert
with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Enable update for admins"
on public.cars for update
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Enable delete for admins"
on public.cars for delete
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ═══════════════════════════════════════════
-- AFTER signing up, promote yourself to admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@example.com';
-- ═══════════════════════════════════════════
