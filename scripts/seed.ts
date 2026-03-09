import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjiogecfeocxffrwuxpi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaW9nZWNmZW9jeGZmcnd1eHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDAwNzUsImV4cCI6MjA4NzMxNjA3NX0.3iWEZJQEcMA5fQRTTIvX56cP0kwdYT_AQQzD7Poqg5o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SEED_CARS = [
    {
        make: 'Honda',
        model: 'City',
        price: 950000,
        year: 2021,
        city: 'Theni',
        fuel_type: 'Petrol',
        image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&auto=format&fit=crop&w=800',
        status: 'available',
    },
    {
        make: 'Mahindra',
        model: 'Bolero',
        price: 780000,
        year: 2020,
        city: 'Madurai',
        fuel_type: 'Diesel',
        image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&auto=format&fit=crop&w=800',
        status: 'available',
    },
    {
        make: 'Hyundai',
        model: 'Creta',
        price: 1250000,
        year: 2023,
        city: 'Theni',
        fuel_type: 'Petrol',
        image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&auto=format&fit=crop&w=800',
        status: 'available',
    },
    {
        make: 'Toyota',
        model: 'Fortuner',
        price: 3200000,
        year: 2022,
        city: 'Theni',
        fuel_type: 'Diesel',
        image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&auto=format&fit=crop&w=800',
        status: 'available',
    },
    {
        make: 'Kia',
        model: 'Seltos',
        price: 1100000,
        year: 2022,
        city: 'Chennai',
        fuel_type: 'Petrol',
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&auto=format&fit=crop&w=800',
        status: 'available',
    },
    {
        make: 'Maruti Suzuki',
        model: 'Swift',
        price: 650000,
        year: 2021,
        city: 'Theni',
        fuel_type: 'Diesel',
        image_url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&auto=format&fit=crop&w=800',
        status: 'available',
    },
];

async function seed() {
    console.log('🚗 Seeding Route 60 cars database...\n');

    // Check if table has existing data
    const { data: existing, error: checkError } = await supabase
        .from('cars')
        .select('id')
        .limit(1);

    if (checkError) {
        console.error('❌ Error checking table. The "cars" table might not exist yet.');
        console.error('   Please go to Supabase Dashboard → SQL Editor and run the contents of supabase/schema.sql first.');
        console.error('   Error:', checkError.message);
        process.exit(1);
    }

    if (existing && existing.length > 0) {
        console.log('⚠️  Table already has data. Clearing existing rows...');
        const { error: deleteError } = await supabase.from('cars').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (deleteError) {
            console.error('❌ Error clearing table:', deleteError.message);
            process.exit(1);
        }
        console.log('   ✅ Cleared existing data.\n');
    }

    // Insert seed data
    const { data, error } = await supabase
        .from('cars')
        .insert(SEED_CARS)
        .select();

    if (error) {
        console.error('❌ Error inserting seed data:', error.message);
        process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data.length} cars:\n`);
    data.forEach((car: Record<string, unknown>) => {
        console.log(`   🚙 ${car.year} ${car.make} ${car.model} — ₹${Number(car.price).toLocaleString('en-IN')} (${car.city})`);
    });

    console.log('\n🎉 Database seeded successfully!');
}

seed();
