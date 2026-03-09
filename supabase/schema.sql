-- ══════════════════════════════════════════════
-- Route 60 Carz Trading — Database Schema
-- ══════════════════════════════════════════════

-- ───── Cars Table ─────
create table if not exists public.cars (
  id uuid default gen_random_uuid() primary key,
  make text not null,
  model text not null,
  year int4,
  price numeric,
  city text default 'Theni',
  fuel_type text default 'Petrol',
  image_url text,
  status text default 'available',
  created_at timestamptz default now()
);

alter table public.cars enable row level security;

-- Public read
create policy "Enable read access for all users" 
on public.cars for select using (true);

-- Admin insert
create policy "Enable insert for admins"
on public.cars for insert
with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Admin update
create policy "Enable update for admins"
on public.cars for update
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Admin delete
create policy "Enable delete for admins"
on public.cars for delete
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create index if not exists idx_cars_make on public.cars(make);
create index if not exists idx_cars_price on public.cars(price);
create index if not exists idx_cars_city on public.cars(city);
create index if not exists idx_cars_fuel_type on public.cars(fuel_type);

-- ───── Profiles Table ─────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can read all profiles"
on public.profiles for select
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Users can update their own profile (but not role)
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Allow insert for authenticated users (for profile creation on signup)
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- ───── Auto-create profile on signup ─────
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

-- Trigger to auto-create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
