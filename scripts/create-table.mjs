// Create the cars table in Supabase using Management API
// Run: node scripts/create-table.mjs

const PROJECT_REF = 'tjiogecfeocxffrwuxpi';
const PUBLISHABLE_KEY = 'sb_publishable_1b-Pw690ZTC8SvcYJQlEng_qo1rvojz';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaW9nZWNmZW9jeGZmcnd1eHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDAwNzUsImV4cCI6MjA4NzMxNjA3NX0.3iWEZJQEcMA5fQRTTIvX56cP0kwdYT_AQQzD7Poqg5o';

const SQL = `
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

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Enable read access for all users' AND tablename = 'cars'
  ) THEN
    CREATE POLICY "Enable read access for all users" ON public.cars FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert for all users' AND tablename = 'cars'
  ) THEN
    CREATE POLICY "Enable insert for all users" ON public.cars FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Enable delete for all users' AND tablename = 'cars'
  ) THEN
    CREATE POLICY "Enable delete for all users" ON public.cars FOR DELETE USING (true);
  END IF;
END $$;

create index if not exists idx_cars_make on public.cars(make);
create index if not exists idx_cars_price on public.cars(price);
create index if not exists idx_cars_city on public.cars(city);
create index if not exists idx_cars_fuel_type on public.cars(fuel_type);
`;

async function main() {
    console.log('🔧 Creating cars table in Supabase...\n');

    // Try Supabase Management API (v1/projects/{ref}/database/query)
    try {
        const mgmtResp = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ query: SQL }),
            signal: AbortSignal.timeout(30000),
        });

        if (mgmtResp.ok) {
            const result = await mgmtResp.json();
            console.log('✅ Table created successfully via Management API!');
            console.log('Result:', JSON.stringify(result, null, 2));
            return;
        } else {
            const errText = await mgmtResp.text();
            console.log(`⚠️  Management API returned ${mgmtResp.status}: ${errText}`);
            console.log('   The publishable key may not have management access.');
        }
    } catch (err) {
        console.log('⚠️  Management API error:', err.message);
    }

    // Fallback: Try pg/query endpoint on the project URL
    try {
        console.log('\n📡 Trying project SQL endpoint...');
        const sqlResp = await fetch(`https://${PROJECT_REF}.supabase.co/pg/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
            },
            body: JSON.stringify({ query: SQL }),
            signal: AbortSignal.timeout(15000),
        });

        const sqlText = await sqlResp.text();
        console.log(`   Status: ${sqlResp.status}`);
        console.log(`   Response: ${sqlText}`);
    } catch (err) {
        console.log('   Error:', err.message);
    }

    console.log('\n💡 If table creation failed, please manually run the SQL:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/tjiogecfeocxffrwuxpi/sql/new');
    console.log('   2. Paste the contents of supabase/schema.sql');
    console.log('   3. Click "Run"');
    console.log('   4. Then re-run: npx -y tsx scripts/seed.ts');
}

main();
