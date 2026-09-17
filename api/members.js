/**
 * Endpoint Serverless : Gestion des Membres MLM Routini
 * GET /api/members (ou ?code=818204921)
 * POST /api/members (Création / Mise à jour)
 */

import { isDatabaseConfigured, query } from './lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!isDatabaseConfigured()) {
    return res.status(200).json({
      fallback: true,
      message: 'Database non configurée, lecture locale active.'
    });
  }

  try {
    if (req.method === 'GET') {
      const { code } = req.query;
      if (code) {
        const rows = await query(`SELECT * FROM members WHERE code = $1 LIMIT 1`, [code]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Membre introuvable' });
        }
        return res.status(200).json(rows[0]);
      } else {
        const rows = await query(`SELECT * FROM members ORDER BY created_at ASC`);
        return res.status(200).json(rows);
      }
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const m = req.body;
      if (!m || !m.code || !m.name) {
        return res.status(400).json({ error: 'Champs obligatoires manquants (code, name)' });
      }

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
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          city = EXCLUDED.city,
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
        m.rankCode || m.rank_code || 'PARTNER',
        m.rankName || m.rank_name || 'Partner',
        m.sponsorCode || m.sponsor_code || null,
        m.sponsorName || m.sponsor_name || '',
        m.password || 'routini123',
        m.joinDate || m.join_date || '01/01/2026',
        Number(m.ppv || 0),
        Number(m.teamPV || m.team_pv || 0),
        Number(m.gpv || 0),
        Number(m.sv || 0),
        Number(m.monthlySalesDH || m.monthly_sales_dh || 0),
        Number(m.walletDH || m.wallet_dh || 0),
        Number(m.clientsCount || m.clients_count || 0),
        Number(m.fidelityPoints || m.fidelity_points || 0),
        Boolean(m.active !== false)
      ]);

      return res.status(200).json({ success: true, memberCode: m.code });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
