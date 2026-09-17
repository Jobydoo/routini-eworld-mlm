/**
 * Client de Base de Données Serverless pour Vercel (Neon Postgres / Vercel Postgres)
 * Routini eWorld MLM - Version 4
 */

let sqlClient = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL);
}

export function getConnectionString() {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || '';
}

export async function query(queryText, params = []) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED: Aucune variable POSTGRES_URL ou DATABASE_URL détectée. Connectez Neon Postgres dans votre dashboard Vercel (Onglet Storage).');
  }

  const connString = getConnectionString();

  // Essai avec le driver ultra-rapide HTTP de Neon
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(connString);
    
    // Le driver neon HTTP prend du SQL avec des placeholders positionnels
    if (params && params.length > 0) {
      return await sql(queryText, params);
    }
    return await sql(queryText);
  } catch (neonErr) {
    // Fallback sur le driver @vercel/postgres ou pg standard
    try {
      const { sql } = await import('@vercel/postgres');
      return await sql.query(queryText, params);
    } catch (vercelErr) {
      // Fallback sur pg standard si disponible
      const { Pool } = await import('pg');
      if (!sqlClient) {
        sqlClient = new Pool({
          connectionString: connString,
          ssl: { rejectUnauthorized: false }
        });
      }
      const res = await sqlClient.query(queryText, params);
      return res.rows;
    }
  }
}
