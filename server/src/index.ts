import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Geospatial Search: Find farms within radius (km)
// Usage: GET /api/nearby?lat=12.97&lng=77.59&radius=15
app.get('/api/nearby', async (req: Request, res: Response) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const query = `
      SELECT id, name,
             ST_Distance(location, ST_MakePoint($2, $1)::geography) / 1000 as distance_km
      FROM farms
      WHERE ST_DWithin(location, ST_MakePoint($2, $1)::geography, $3::int * 1000)
      ORDER BY distance_km ASC;
    `;
    const result = await pool.query(query, [lat, lng, radius]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
