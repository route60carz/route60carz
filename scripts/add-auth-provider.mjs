import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function migrate() {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        console.error('❌ DATABASE_URL not set');
        process.exit(1);
    }

    const sql = neon(DATABASE_URL);

    console.log('🔄 Adding auth_provider column to profiles table...');

    try {
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email'`;
        console.log('✅ auth_provider column added (or already exists).');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }

    console.log('✅ Migration complete!');
}

migrate();
