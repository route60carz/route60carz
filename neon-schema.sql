-- ══════════════════════════════════════════════
-- Route 60 Carz Trading — Neon Database Schema
-- ══════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ───── Cars Table ─────
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
);

CREATE INDEX IF NOT EXISTS idx_cars_make ON cars(make);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type);

-- ───── Profiles Table ─────
CREATE TABLE IF NOT EXISTS profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  last_login_at timestamptz
);

-- ───── Contact Inquiries Table ─────
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id uuid REFERENCES cars(id) ON DELETE SET NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text NOT NULL,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_car_id ON contact_inquiries(car_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON contact_inquiries(created_at DESC);
