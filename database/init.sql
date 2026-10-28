-- Enable PostGIS extension for spatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Farms table
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price_per_kg DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    harvest_date DATE DEFAULT CURRENT_DATE
);

-- Geospatial Index
CREATE INDEX IF NOT EXISTS farms_geo_idx ON farms USING GIST (location);

-- Seed Data (Example: Bengaluru Coordinates)
INSERT INTO farms (name, description, location)
VALUES
('Green Valley Organic Farm', 'Fresh organic vegetables directly harvested.', ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326)::geography),
('Sunrise Dairy & Produce', 'Farm-fresh milk and seasonal fruits.', ST_SetSRID(ST_MakePoint(77.6033, 12.9352), 4326)::geography);
