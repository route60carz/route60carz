import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_HmTgfLy4ul9U@ep-divine-forest-a1oze5eu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const MOCK_CARS = [
    {
        make: 'Hyundai',
        model: 'Creta',
        year: 2022,
        price: 1550000,
        city: 'Theni',
        fuel_type: 'Diesel',
        status: 'available',
        mileage: 25000,
        description: 'Excellent condition Hyundai Creta with panoramic sunroof, well maintained and single owner. Full service history available at authorized dealer.',
        image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?q=80&w=1400&auto=format&fit=crop'
    },
    {
        make: 'Toyota',
        model: 'Innova Crysta',
        year: 2020,
        price: 2100000,
        city: 'Madurai',
        fuel_type: 'Diesel',
        status: 'available',
        mileage: 60000,
        description: 'Spacious and reliable Innova Crysta for your family needs. Premium leather interiors and captain seats.',
        image_url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1400&auto=format&fit=crop'
    },
    {
        make: 'Maruti Suzuki',
        model: 'Swift ZXi',
        year: 2023,
        price: 780000,
        city: 'Theni',
        fuel_type: 'Petrol',
        status: 'available',
        mileage: 12000,
        description: 'Sporty look, high fuel efficiency. Perfect for city driving. Touchscreen infotainment, push button start.',
        image_url: 'https://images.unsplash.com/photo-1629897149921-177ee13d8a0c?q=80&w=1400&auto=format&fit=crop'
    },
    {
        make: 'Kia',
        model: 'Seltos HTX',
        year: 2021,
        price: 1420000,
        city: 'Coimbatore',
        fuel_type: 'Petrol',
        status: 'pending',
        mileage: 34000,
        description: 'Feature packed Kia Seltos. Includes connected car tech, air purifier, ventilated seats.',
        image_url: 'https://images.unsplash.com/photo-1632341063628-d8ef621f82f8?q=80&w=1400&auto=format&fit=crop'
    },
    {
        make: 'BMW',
        model: 'X1',
        year: 2019,
        price: 2850000,
        city: 'Chennai',
        fuel_type: 'Diesel',
        status: 'available',
        mileage: 45000,
        description: 'Luxury compact SUV. Dynamic performance, premium appeal. Maintained meticulously under BSI package.',
        image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1400&auto=format&fit=crop'
    },
    {
        make: 'Honda',
        model: 'City ZX',
        year: 2022,
        price: 1380000,
        city: 'Salem',
        fuel_type: 'Petrol',
        status: 'sold',
        mileage: 18000,
        description: 'The supreme sedan experience. Comfort, space, and a smooth i-VTEC engine.',
        image_url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1400&auto=format&fit=crop'
    }
];

async function seedCars() {
    console.log('🔌 Connecting to database...');
    const sql = neon(DATABASE_URL);

    // First delete existing cars to prevent duplicates on rerun
    console.log('🗑️ Clearing existing inventory...');
    await sql`DELETE FROM cars`;

    console.log('🚗 Inserting dummy cars...');
    for (const car of MOCK_CARS) {
        await sql`
            INSERT INTO cars (make, model, year, price, city, fuel_type, image_url, status, description, mileage)
            VALUES (${car.make}, ${car.model}, ${car.year}, ${car.price}, ${car.city}, ${car.fuel_type}, ${car.image_url}, ${car.status}, ${car.description}, ${car.mileage})
        `;
        console.log(`  ✓ Inserted ${car.year} ${car.make} ${car.model}`);
    }

    console.log('✅ Done! Seeded dummy car data.');
}

seedCars().catch(err => {
    console.error('❌ Insertion failed:', err);
    process.exit(1);
});
