import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 数据库连接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
});

export async function POST(req: Request) {
  try {
    const { playerName, score } = await req.json();

    if (!playerName || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO public.player_score (player_name, score) VALUES ($1, $2)',
        [playerName, score]
      );
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}