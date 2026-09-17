/**
 * Endpoint Serverless : Synchronisation Globale État Local <-> Vercel Postgres
 * POST /api/sync
 */

import { isDatabaseConfigured, query } from './lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!isDatabaseConfigured()) {
    return res.status(200).json({
      success: true,
      synced: false,
      mode: 'local_storage',
      message: 'Base Vercel Postgres non connectée. Données préservées en local.'
    });
  }

  try {
    const payload = req.body;

    // Si des membres sont fournis, on synchronise dans PostgreSQL
    if (payload && payload.members && Array.isArray(payload.members)) {
      for (const m of payload.members) {
        await query(`
          INSERT INTO members (
            id, code, name, email, phone, cin, city, country, role, 
            rank_code, rank_name, sponsor_code, sponsor_name, password, 
            join_date, ppv, team_pv, gpv, sv, monthly_sales_dh, wallet_dh, 
            clients_count, fidelity_points, active
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, 
            $10, $11, $12, $13, $14, 
            $15, $16, $17, $18, $19, $20, $21, 
            $22, $23, $24
          )
          ON CONFLICT (code) DO UPDATE SET
            name = EXCLUDED.name,
            rank_code = EXCLUDED.rank_code,
            rank_name = EXCLUDED.rank_name,
            ppv = EXCLUDED.ppv,
            team_pv = EXCLUDED.team_pv,
            gpv = EXCLUDED.gpv,
            sv = EXCLUDED.sv,
            wallet_dh = EXCLUDED.wallet_dh,
            fidelity_points = EXCLUDED.fidelity_points,
            active = EXCLUDED.active,
            updated_at = CURRENT_TIMESTAMP
        `, [
          m.id || m.code,
          m.code,
          m.name,
          m.email || '',
          m.phone || '',
          m.cin || '',
          m.city || 'Casablanca',
          m.country || 'Maroc',
          m.role || 'distributor',
          m.rankCode || 'PARTNER',
          m.rankName || 'Partner',
          m.sponsorCode || null,
          m.sponsorName || '',
          m.password || 'routini123',
          m.joinDate || '01/01/2026',
          Number(m.ppv || 0),
          Number(m.teamPV || 0),
          Number(m.gpv || 0),
          Number(m.sv || 0),
          Number(m.monthlySalesDH || 0),
          Number(m.walletDH || 0),
          Number(m.clientsCount || 0),
          Number(m.fidelityPoints || 0),
          Boolean(m.active !== false)
        ]);
      }
    }

    // Sauvegarde de l'état complet dans system_state
    if (payload) {
      await query(`
        INSERT INTO system_state (key, data, updated_at)
        VALUES ('latest_snapshot', $1, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET
          data = EXCLUDED.data,
          updated_at = CURRENT_TIMESTAMP
      `, [JSON.stringify(payload)]);
    }

    // Récupérer le nombre à jour
    const countRes = await query(`SELECT COUNT(*) as count FROM members`);
    const totalMembers = Number(countRes[0]?.count || 0);

    return res.status(200).json({
      success: true,
      synced: true,
      mode: 'neon_postgres',
      totalMembersInDatabase: totalMembers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
