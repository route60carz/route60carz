/**
 * seed-admin.mjs
 * Creates the admin user in the profiles table.
 * Run: node scripts/seed-admin.mjs
 */
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in your environment.');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

const ADMIN_EMAIL = 'admin@route60.com';
const ADMIN_PASSWORD = 'Route60Admin2024';
const ADMIN_NAME = 'Route 60 Admin';

async function seedAdmin() {
    console.log('🔄 Checking for existing admin user...\n');

    // Check if admin already exists
    const existing = await sql`SELECT id, email FROM profiles WHERE email = ${ADMIN_EMAIL} LIMIT 1`;

    if (existing.length > 0) {
        console.log(`✅ Admin user already exists (id: ${existing[0].id})`);
        console.log('   No changes made.');
        return;
    }

    // Hash the password
    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Insert admin user
    const rows = await sql`
        INSERT INTO profiles (email, full_name, password_hash, role, is_email_verified)
        VALUES (${ADMIN_EMAIL}, ${ADMIN_NAME}, ${password_hash}, 'admin', TRUE)
        RETURNING id, email, role
    `;

    console.log('✅ Admin user created successfully!');
    console.log(`   ID:    ${rows[0].id}`);
    console.log(`   Email: ${rows[0].email}`);
    console.log(`   Role:  ${rows[0].role}`);
    console.log(`\n   Login at /admin/login with:`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
}

seedAdmin().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
