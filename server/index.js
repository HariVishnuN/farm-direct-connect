const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Supabase PostgreSQL using the .env connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test Route
app.get('/', (req, res) => {
  res.json({ message: "FarmDirect Connect API is running successfully!" });
});

// 1. Get all nearby farms using PostGIS geolocation
app.get('/api/farms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, 
             ST_Y(location::geometry) as latitude, 
             ST_X(location::geometry) as longitude, 
             created_at 
      FROM farms
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 2. Add a new farm with coordinates
app.post('/api/farms', async (req, res) => {
  try {
    const { name, description, latitude, longitude } = req.body;
    const newFarm = await pool.query(
      `INSERT INTO farms (name, description, location) 
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)) RETURNING *`,
      [name, description, longitude, latitude]
    );
    res.json(newFarm.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});