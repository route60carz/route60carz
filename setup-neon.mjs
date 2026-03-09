import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_HmTgfLy4ul9U@ep-divine-forest-a1oze5eu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function main() {
    const sql = neon(DATABASE_URL);

    console.log('🔌 Connected to Neon database');

    // Create extension
    console.log('\n📝 Creating pgcrypto extension...');
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
    console.log('✓ pgcrypto');

    // Create cars table
    console.log('\n📝 Creating cars table...');
    await sql`
        CREATE TABLE IF NOT EXISTS cars (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            make text NOT NULL,
            model text NOT NULL,
            year int4,
            price numeric,
            city text DEFAULT 'Theni',
            fuel_type text DEFAULT 'Petrol',
            image_url text,
            status text DEFAULT 'available',
            description text,
            mileage int4,
            created_at timestamptz DEFAULT now()
        )
    `;
    console.log('✓ cars table created');

    // Create profiles table
    console.log('\n📝 Creating profiles table...');
    await sql`
        CREATE TABLE IF NOT EXISTS profiles (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            email text,
            full_name text,
            role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
            created_at timestamptz DEFAULT now(),
            last_login_at timestamptz
        )
    `;
    console.log('✓ profiles table created');

    // Create contact_inquiries table
    console.log('\n📝 Creating contact_inquiries table...');
    await sql`
        CREATE TABLE IF NOT EXISTS contact_inquiries (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            car_id uuid REFERENCES cars(id) ON DELETE SET NULL,
            user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
            name text NOT NULL,
            phone text NOT NULL,
            message text,
            status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
            created_at timestamptz DEFAULT now()
        )
    `;
    console.log('✓ contact_inquiries table created');

    // Create indexes
    console.log('\n📝 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_make ON cars(make)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_inquiries_car_id ON contact_inquiries(car_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_inquiries_status ON contact_inquiries(status)`;
    console.log('✓ All indexes created');

    // Verify tables
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('\n📦 Tables in database:', tables.map(t => t.table_name));

    // Count rows
    const carCount = await sql`SELECT COUNT(*) as count FROM cars`;
    const profileCount = await sql`SELECT COUNT(*) as count FROM profiles`;
    const inquiryCount = await sql`SELECT COUNT(*) as count FROM contact_inquiries`;
    console.log(`\n📊 Row counts: cars=${carCount[0].count}, profiles=${profileCount[0].count}, inquiries=${inquiryCount[0].count}`);

    console.log('\n✅ Schema setup complete!');
}

main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
