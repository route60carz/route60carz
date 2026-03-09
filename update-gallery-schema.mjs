import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_HmTgfLy4ul9U@ep-divine-forest-a1oze5eu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function main() {
    const sql = neon(DATABASE_URL);
    console.log('🔌 Connected to Neon database');

    console.log('\n📝 Adding gallery_images column to cars table...');
    try {
        await sql`ALTER TABLE cars ADD COLUMN IF NOT EXISTS gallery_images TEXT[]`;
        console.log('✓ Successfully added gallery_images column (TEXT array)');
    } catch (e) {
        console.error('❌ Failed:', e.message);
    }
}

main();
