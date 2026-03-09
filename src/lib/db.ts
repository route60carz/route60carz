import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL!;

export function getDb() {
    return neon(DATABASE_URL);
}

// ─── Car Helpers ────────────────────────────────────────────────────

export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    city: string;
    fuel_type: string;
    image_url: string | null;
    gallery_images: string[] | null;
    status: string;
    description?: string;
    mileage?: number;
    created_at: string;
}

export async function getAllCars(): Promise<Car[]> {
    const sql = getDb();
    const rows = await sql`SELECT * FROM cars ORDER BY created_at DESC`;
    return rows as Car[];
}

export async function getCarById(id: string): Promise<Car | null> {
    const sql = getDb();
    const rows = await sql`SELECT * FROM cars WHERE id = ${id} LIMIT 1`;
    return (rows[0] as Car) ?? null;
}

export async function insertCar(car: Omit<Car, 'id' | 'created_at'>): Promise<Car> {
    const sql = getDb();
    const galleryArr = car.gallery_images && car.gallery_images.length > 0 ? car.gallery_images : null;
    const rows = await sql`
        INSERT INTO cars (make, model, year, price, city, fuel_type, image_url, gallery_images, status)
        VALUES (${car.make}, ${car.model}, ${car.year}, ${car.price}, ${car.city}, ${car.fuel_type}, ${car.image_url}, ${galleryArr}, ${car.status})
        RETURNING *
    `;
    return rows[0] as Car;
}

export async function updateCar(id: string, car: Partial<Omit<Car, 'id' | 'created_at'>>): Promise<Car | null> {
    const sql = getDb();
    const galleryArr = car.gallery_images !== undefined
        ? (car.gallery_images && car.gallery_images.length > 0 ? car.gallery_images : null)
        : undefined;

    const rows = await sql`
        UPDATE cars SET
            make = COALESCE(${car.make ?? null}, make),
            model = COALESCE(${car.model ?? null}, model),
            year = COALESCE(${car.year ?? null}, year),
            price = COALESCE(${car.price ?? null}, price),
            city = COALESCE(${car.city ?? null}, city),
            fuel_type = COALESCE(${car.fuel_type ?? null}, fuel_type),
            image_url = CASE WHEN ${car.image_url !== undefined} THEN ${car.image_url ?? null} ELSE image_url END,
            gallery_images = CASE WHEN ${galleryArr !== undefined} THEN ${galleryArr ?? null} ELSE gallery_images END,
            status = COALESCE(${car.status ?? null}, status)
        WHERE id = ${id}
        RETURNING *
    `;
    return (rows[0] as Car) ?? null;
}


export async function deleteCar(id: string): Promise<boolean> {
    const sql = getDb();
    const rows = await sql`DELETE FROM cars WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
}

export async function getCarStatuses(): Promise<{ status: string }[]> {
    const sql = getDb();
    const rows = await sql`SELECT status FROM cars`;
    return rows as { status: string }[];
}

export async function getRecentCars(limit: number = 5) {
    const sql = getDb();
    const rows = await sql`
        SELECT id, make, model, year, status, price, created_at 
        FROM cars 
        ORDER BY created_at DESC 
        LIMIT ${limit}
    `;
    return rows;
}

// ─── Profile Helpers ────────────────────────────────────────────────

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: 'user' | 'admin';
    created_at: string;
    last_login_at?: string;
}

export async function getAllProfiles(): Promise<Profile[]> {
    const sql = getDb();
    const rows = await sql`SELECT * FROM profiles ORDER BY created_at DESC`;
    return rows as Profile[];
}

export async function getProfileById(id: string): Promise<Profile | null> {
    const sql = getDb();
    const rows = await sql`SELECT * FROM profiles WHERE id = ${id} LIMIT 1`;
    return (rows[0] as Profile) ?? null;
}

export async function getProfileByEmail(email: string): Promise<Profile | null> {
    const sql = getDb();
    const rows = await sql`SELECT * FROM profiles WHERE email = ${email} LIMIT 1`;
    return (rows[0] as Profile) ?? null;
}

export async function updateProfileLogin(id: string): Promise<void> {
    const sql = getDb();
    await sql`UPDATE profiles SET last_login_at = NOW() WHERE id = ${id}`;
}

// ─── Contact Inquiry Helpers ────────────────────────────────────────

export interface ContactInquiry {
    id: string;
    car_id: string;
    user_id: string | null;
    name: string;
    phone: string;
    message: string | null;
    status: 'new' | 'contacted' | 'closed';
    created_at: string;
}

export async function insertInquiry(inquiry: {
    car_id: string;
    user_id: string | null;
    name: string;
    phone: string;
    message: string | null;
    status: string;
}): Promise<{ id: string }> {
    const sql = getDb();
    const rows = await sql`
        INSERT INTO contact_inquiries (car_id, user_id, name, phone, message, status)
        VALUES (${inquiry.car_id}, ${inquiry.user_id}, ${inquiry.name}, ${inquiry.phone}, ${inquiry.message}, ${inquiry.status})
        RETURNING id
    `;
    return rows[0] as { id: string };
}

export async function getAllInquiries() {
    const sql = getDb();
    const rows = await sql`
        SELECT 
            ci.id, ci.car_id, ci.user_id, ci.name, ci.phone, ci.message, ci.status, ci.created_at,
            c.make AS car_make, c.model AS car_model, c.year AS car_year,
            p.email AS user_email, p.full_name AS user_full_name
        FROM contact_inquiries ci
        LEFT JOIN cars c ON ci.car_id = c.id
        LEFT JOIN profiles p ON ci.user_id = p.id
        ORDER BY ci.created_at DESC
    `;
    return rows;
}

export async function updateInquiryStatus(id: string, status: string): Promise<boolean> {
    const sql = getDb();
    const rows = await sql`
        UPDATE contact_inquiries SET status = ${status} WHERE id = ${id} RETURNING id
    `;
    return rows.length > 0;
}

export async function deleteInquiry(id: string): Promise<boolean> {
    const sql = getDb();
    const rows = await sql`
        DELETE FROM contact_inquiries WHERE id = ${id} RETURNING id
    `;
    return rows.length > 0;
}
