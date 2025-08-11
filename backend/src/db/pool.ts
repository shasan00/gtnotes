import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

export async function initDb(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Skipping DB initialization.");
    return;
  }
  const p = getPool();
  // enables pgcrypto for gen_random_uuid if available
  await p.query(`create extension if not exists pgcrypto;`).catch(() => {});
  await p.query(`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      email text not null unique,
      password_hash text,
      google_id text,
      first_name text,
      last_name text,
      role text not null default 'user',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);
  // adds google_id column if it doesn't exist (for existing tables)
  try {
    await p.query(`ALTER TABLE users ADD COLUMN google_id text;`);
  } catch (e: any) {
    // column already exists, ignore error
    if (!e.message?.includes('already exists')) {
      console.warn('Could not add google_id column:', e.message);
    }
  }
  // ensures partial unique index for google_id when present
  await p
    .query(
      `create unique index if not exists idx_users_google_id on users(google_id) where google_id is not null;`
    )
    .catch(() => {});
  try {
    await p.query(`ALTER TABLE users ADD COLUMN role text not null default 'user';`);
  } catch (e: any) {
    // column already exists, ignore error
    if (!e.message?.includes('already exists')) {
      console.warn('Could not add role column:', e.message);
    }
  }
}


