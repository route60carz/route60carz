-- ═══════════════════════════════════════════
-- COMPLETE FIX - Run in Supabase SQL Editor
-- This fixes ALL RLS recursion issues
-- ═══════════════════════════════════════════

-- ═══════════════════════════════════════════
-- STEP 1: Create the is_admin function first
-- ═══════════════════════════════════════════
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ═══════════════════════════════════════════
-- STEP 2: Fix profiles table RLS
-- ═══════════════════════════════════════════
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ═══════════════════════════════════════════
-- STEP 3: Fix contact_inquiries table RLS
-- ═══════════════════════════════════════════
drop policy if exists "Users can read own inquiries" on public.contact_inquiries;
drop policy if exists "Admins can read all inquiries" on public.contact_inquiries;
drop policy if exists "Authenticated users can insert inquiries" on public.contact_inquiries;
drop policy if exists "Admins can update inquiries" on public.contact_inquiries;

-- Users can read own inquiries
create policy "Users can read own inquiries"
  on public.contact_inquiries for select
  using (auth.uid() = user_id);

-- Authenticated users can insert their own inquiries
create policy "Authenticated users can insert inquiries"
  on public.contact_inquiries for insert
  with check (auth.uid() = user_id);

-- Admins can update inquiries
create policy "Admins can update inquiries"
  on public.contact_inquiries for update
  using (public.is_admin());

-- ═══════════════════════════════════════════
-- STEP 4: Create functions to get admin data
-- These use security definer to bypass RLS
-- ═══════════════════════════════════════════

-- Function to get all profiles (admin only)
create or replace function public.get_all_profiles()
returns table (
  id uuid,
  email text,
  full_name text,
  role text,
  created_at timestamptz,
  last_login_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.email, p.full_name, p.role, p.created_at, p.last_login_at
  from public.profiles p
  order by p.created_at desc;
$$;

-- Function to get all inquiries with details (admin only)
create or replace function public.get_all_inquiries()
returns table (
  id uuid,
  car_id uuid,
  user_id uuid,
  name text,
  phone text,
  message text,
  status text,
  created_at timestamptz,
  car_make text,
  car_model text,
  car_year int4,
  user_email text,
  user_full_name text
)
language sql
security definer
set search_path = public
as $$
  select 
    ci.id,
    ci.car_id,
    ci.user_id,
    ci.name,
    ci.phone,
    ci.message,
    ci.status,
    ci.created_at,
    c.make,
    c.model,
    c.year,
    p.email,
    p.full_name
  from public.contact_inquiries ci
  left join public.cars c on ci.car_id = c.id
  left join public.profiles p on ci.user_id = p.id
  order by ci.created_at desc;
$$;

-- ═══════════════════════════════════════════
-- IMPORTANT: Make yourself admin!
-- ═══════════════════════════════════════════
-- Run this command with YOUR email:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@example.com';
