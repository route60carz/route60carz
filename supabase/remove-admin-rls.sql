-- ═══════════════════════════════════════════
-- Remove Admin Restrictions
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════

-- 1. Allow public modifications to Cars
drop policy if exists "Enable insert for admins" on public.cars;
drop policy if exists "Enable update for admins" on public.cars;
drop policy if exists "Enable delete for admins" on public.cars;

drop policy if exists "Enable insert for all users" on public.cars;
drop policy if exists "Enable update for all users" on public.cars;
drop policy if exists "Enable delete for all users" on public.cars;

create policy "Enable insert for all users"
on public.cars for insert
with check (true);

create policy "Enable update for all users"
on public.cars for update
using (true);

create policy "Enable delete for all users"
on public.cars for delete
using (true);

-- 2. Allow public to read and update Contact Inquiries
drop policy if exists "Admins can update inquiries" on public.contact_inquiries;
drop policy if exists "Admins can read all inquiries" on public.contact_inquiries;

drop policy if exists "All users can read all inquiries" on public.contact_inquiries;
drop policy if exists "All users can update inquiries" on public.contact_inquiries;

create policy "All users can read all inquiries"
on public.contact_inquiries for select
using (true);

create policy "All users can update inquiries"
on public.contact_inquiries for update
using (true);

-- Optional: Allow public to delete inquiries just in case
drop policy if exists "Admins can delete inquiries" on public.contact_inquiries;
drop policy if exists "All users can delete inquiries" on public.contact_inquiries;

create policy "All users can delete inquiries"
on public.contact_inquiries for delete
using (true);
