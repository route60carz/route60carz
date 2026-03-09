import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_HmTgfLy4ul9U@ep-divine-forest-a1oze5eu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function main() {
    const sql = neon(DATABASE_URL);
    console.log('🔌 Connected to Neon database');

    console.log('\n📝 Creating leads table...');
    try {
        await sql`CREATE TABLE IF NOT EXISTS leads (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            source VARCHAR(50) DEFAULT 'chatbot',
            status VARCHAR(50) DEFAULT 'new',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
        )`;
        console.log('✓ Successfully created leads table');
    } catch (e) {
        console.error('❌ Failed to create table:', e);
    }
}

main();
