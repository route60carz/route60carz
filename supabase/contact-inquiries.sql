-- ═══════════════════════════════════════════
-- Contact Inquiries Table - Run in Supabase SQL Editor
-- ═══════════════════════════════════════════

-- 1. Add last_login_at to profiles table
alter table public.profiles add column if not exists last_login_at timestamptz;

-- 2. Create contact_inquiries table
create table if not exists public.contact_inquiries (
  id uuid default gen_random_uuid() primary key,
  car_id uuid references public.cars(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  message text,
  status text default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz default now()
);

-- 3. Enable RLS
alter table public.contact_inquiries enable row level security;

-- 4. Drop existing policies if they exist (to avoid errors on re-run)
drop policy if exists "Users can read own inquiries" on public.contact_inquiries;
drop policy if exists "Admins can read all inquiries" on public.contact_inquiries;
drop policy if exists "Authenticated users can insert inquiries" on public.contact_inquiries;
drop policy if exists "Admins can update inquiries" on public.contact_inquiries;

-- 5. Create RLS Policies for contact_inquiries
-- Users can read own inquiries
create policy "Users can read own inquiries"
  on public.contact_inquiries for select
  using (auth.uid() = user_id);

-- Authenticated users can insert their own inquiries
create policy "Authenticated users can insert inquiries"
  on public.contact_inquiries for insert
  with check (auth.uid() = user_id);

-- 6. Create a security definer function to check admin role (avoids infinite recursion)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Admins can read all inquiries (using the function to avoid recursion)
create policy "Admins can read all inquiries"
  on public.contact_inquiries for select
  using (public.is_admin());

-- Admins can update inquiries (using the function to avoid recursion)
create policy "Admins can update inquiries"
  on public.contact_inquiries for update
  using (public.is_admin());

-- 7. Indexes for performance
create index if not exists idx_contact_inquiries_user on public.contact_inquiries(user_id);
create index if not exists idx_contact_inquiries_car on public.contact_inquiries(car_id);
create index if not exists idx_contact_inquiries_status on public.contact_inquiries(status);
create index if not exists idx_contact_inquiries_created on public.contact_inquiries(created_at desc);

-- ═══════════════════════════════════════════
-- AFTER RUNNING THIS: The contact_inquiries table will be ready
-- ═══════════════════════════════════════════
