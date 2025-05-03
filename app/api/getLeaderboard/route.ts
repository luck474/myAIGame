import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 数据库连接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT player_name, MAX(score) as score FROM public.player_score GROUP BY player_name ORDER BY score DESC LIMIT 10'
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}