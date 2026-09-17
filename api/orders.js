/**
 * Endpoint Serverless : Commandes & Factures
 * GET /api/orders (ou ?memberCode=818204921)
 * POST /api/orders (Enregistrement d'une commande)
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
      fallback: true,
      message: 'Database non configurée, lecture locale active.'
    });
  }

  try {
    if (req.method === 'GET') {
      const { memberCode } = req.query;
      if (memberCode) {
        const rows = await query(`SELECT * FROM orders WHERE member_code = $1 ORDER BY created_at DESC`, [memberCode]);
        return res.status(200).json(rows);
      } else {
        const rows = await query(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 100`);
        return res.status(200).json(rows);
      }
    }

    if (req.method === 'POST') {
      const o = req.body;
      if (!o || !o.id || !o.memberCode) {
        return res.status(400).json({ error: 'Données de commande invalides (id, memberCode requis)' });
      }

      await query(`
        INSERT INTO orders (
          id, member_code, member_name, sponsor_code, date, status, 
          payment_method, shipping_address, customer_cin, customer_phone, 
          total_rp_dh, total_pm_dh, total_pv, total_sv, 
          fidelity_points_earned, fidelity_points_used, items
        ) VALUES (
          $1, $2, $3, $4, $5, $6, 
          $7, $8, $9, $10, 
          $11, $12, $13, $14, 
          $15, $16, $17
        )
        ON CONFLICT (id) DO NOTHING
      `, [
        o.id,
        o.memberCode,
        o.memberName || '',
        o.sponsorCode || null,
        o.date || new Date().toLocaleDateString('fr-FR'),
        o.status || 'Validée',
        o.paymentMethod || 'E-Point Wallet Routini',
        o.shippingAddress || '',
        o.customerCin || '',
        o.customerPhone || '',
        Number(o.totalRP_DH || o.total_rp_dh || 0),
        Number(o.totalPM_DH || o.total_pm_dh || 0),
        Number(o.totalPV || o.total_pv || 0),
        Number(o.totalSV || o.total_sv || 0),
        Number(o.fidelityPointsEarned || 0),
        Number(o.fidelityPointsUsed || 0),
        JSON.stringify(o.items || [])
      ]);

      return res.status(201).json({ success: true, orderId: o.id });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
