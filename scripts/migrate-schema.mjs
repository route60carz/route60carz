/**
 * migrate-schema.mjs
 * Adds missing columns to the Neon database without data loss.
 * Run: node scripts/migrate-schema.mjs
 */
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in your environment.');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
    console.log('🔄 Running schema migration...\n');

    // ── Cars table: add gallery_images ──
    try {
        await sql`ALTER TABLE cars ADD COLUMN IF NOT EXISTS gallery_images text[]`;
        console.log('✅ cars.gallery_images — OK');
    } catch (e) {
        console.log('⚠️  cars.gallery_images — skipped:', e.message);
    }

    // ── Profiles table: add password_hash ──
    try {
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash text`;
        console.log('✅ profiles.password_hash — OK');
    } catch (e) {
        console.log('⚠️  profiles.password_hash — skipped:', e.message);
    }

    // ── Profiles table: add is_email_verified ──
    try {
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_email_verified boolean DEFAULT FALSE`;
        console.log('✅ profiles.is_email_verified — OK');
    } catch (e) {
        console.log('⚠️  profiles.is_email_verified — skipped:', e.message);
    }

    // ── Profiles table: add verification_otp ──
    try {
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_otp text`;
        console.log('✅ profiles.verification_otp — OK');
    } catch (e) {
        console.log('⚠️  profiles.verification_otp — skipped:', e.message);
    }

    // ── Profiles table: add verification_otp_expires_at ──
    try {
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_otp_expires_at timestamptz`;
        console.log('✅ profiles.verification_otp_expires_at — OK');
    } catch (e) {
        console.log('⚠️  profiles.verification_otp_expires_at — skipped:', e.message);
    }

    // ── Profiles table: add unique constraint on email ──
    try {
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email_unique ON profiles(email)`;
        console.log('✅ profiles.email unique index — OK');
    } catch (e) {
        console.log('⚠️  profiles.email unique index — skipped:', e.message);
    }

    console.log('\n🎉 Migration complete!');
}

migrate().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
