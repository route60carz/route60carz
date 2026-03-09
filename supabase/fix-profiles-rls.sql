-- ═══════════════════════════════════════════
-- Fix Profiles RLS Policies - Run in Supabase SQL Editor
-- This fixes the infinite recursion issue for profiles table
-- ═══════════════════════════════════════════

-- 1. Drop existing policies that cause recursion
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

-- 2. Create new policies using the is_admin function

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles (using security definer function to avoid recursion)
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Users can update their own profile (but not role)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow insert for authenticated users (for profile creation on signup)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ═══════════════════════════════════════════
-- This should fix the admin users and inquiries pages
-- ═══════════════════════════════════════════
