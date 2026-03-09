import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_HmTgfLy4ul9U@ep-divine-forest-a1oze5eu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function main() {
    const sql = neon(DATABASE_URL);
    console.log('🔌 Connected to Neon database');

    console.log('\n📝 Adding email verification fields to profiles table...');
    try {
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_otp TEXT`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_otp_expires_at TIMESTAMP`;
        console.log('✓ Successfully added email verification columns');
    } catch (e) {
        console.error('❌ Failed to add columns:', e);
    }
}

main();
