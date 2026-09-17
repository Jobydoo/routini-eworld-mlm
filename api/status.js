/**
 * Endpoint Serverless : Statut & Diagnostic de la Base de Données
 * GET /api/status
 */

import { isDatabaseConfigured, query } from './lib/db.js';

export default async function handler(req, res) {
  // Headers CORS pour autoriser l'accès depuis le front
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const configured = isDatabaseConfigured();
  
  if (!configured) {
    return res.status(200).json({
      status: 'offline',
      configured: false,
      provider: 'Neon Serverless Postgres (Vercel)',
      message: 'Base de données non reliée. Rendez-vous sur votre tableau de bord Vercel -> Storage -> Connecter Neon Postgres.',
      mode: 'local_storage_active',
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Vérification de la connectivité SQL
    const checkTables = await query(`
      SELECT 
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members') as has_members,
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') as has_orders
    `);

    const hasMembers = Number(checkTables[0]?.has_members || 0) > 0;
    let membersCount = 0;
    let ordersCount = 0;

    if (hasMembers) {
      const countRes = await query(`SELECT COUNT(*) as count FROM members`);
      membersCount = Number(countRes[0]?.count || 0);

      const countOrd = await query(`SELECT COUNT(*) as count FROM orders`);
      ordersCount = Number(countOrd[0]?.count || 0);
    }

    return res.status(200).json({
      status: 'connected',
      configured: true,
      provider: 'Neon Serverless Postgres (Vercel)',
      tablesInitialized: hasMembers,
      membersCount,
      ordersCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(200).json({
      status: 'error',
      configured: true,
      provider: 'Neon Serverless Postgres (Vercel)',
      error: error.message,
      mode: 'fallback_local_storage',
      timestamp: new Date().toISOString()
    });
  }
}
