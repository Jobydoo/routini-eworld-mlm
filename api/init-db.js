/**
 * Endpoint Serverless : Initialisation et Migration de la Base de Données
 * GET / POST /api/init-db
 * Crée les tables et injecte les 51 membres du réseau MLM Routini
 */

import { isDatabaseConfigured, query } from './lib/db.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!isDatabaseConfigured()) {
    return res.status(400).json({
      success: false,
      message: 'DATABASE_NOT_CONFIGURED: POSTGRES_URL est absent. Activez Neon Postgres dans votre dashboard Vercel (onglet Storage).'
    });
  }

  try {
    // 1. Création des tables
    await query(`
      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(64) PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(64),
        cin VARCHAR(64),
        city VARCHAR(128) DEFAULT 'Casablanca',
        country VARCHAR(64) DEFAULT 'Maroc',
        role VARCHAR(32) DEFAULT 'distributor',
        rank_code VARCHAR(32) DEFAULT 'PARTNER',
        rank_name VARCHAR(128) DEFAULT 'Partner',
        sponsor_code VARCHAR(64),
        sponsor_name VARCHAR(255),
        password VARCHAR(128) DEFAULT 'routini123',
        join_date VARCHAR(32) DEFAULT TO_CHAR(CURRENT_DATE, 'DD/MM/YYYY'),
        ppv NUMERIC(12, 2) DEFAULT 0,
        team_pv NUMERIC(12, 2) DEFAULT 0,
        gpv NUMERIC(12, 2) DEFAULT 0,
        sv NUMERIC(12, 2) DEFAULT 0,
        monthly_sales_dh NUMERIC(12, 2) DEFAULT 0,
        wallet_dh NUMERIC(12, 2) DEFAULT 0,
        clients_count INT DEFAULT 0,
        fidelity_points INT DEFAULT 0,
        active BOOLEAN DEFAULT true,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(128) NOT NULL,
        is_pack BOOLEAN DEFAULT false,
        badge VARCHAR(128),
        description TEXT,
        icon VARCHAR(32) DEFAULT '✨',
        image_url VARCHAR(512),
        price_rp_dh NUMERIC(10, 2) NOT NULL,
        price_pm_dh NUMERIC(10, 2) NOT NULL,
        price_dp_dh NUMERIC(10, 2) NOT NULL,
        pv NUMERIC(10, 2) NOT NULL,
        sv NUMERIC(10, 2) NOT NULL,
        stock INT DEFAULT 100,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        member_code VARCHAR(64) NOT NULL,
        member_name VARCHAR(255) NOT NULL,
        sponsor_code VARCHAR(64),
        date VARCHAR(32) NOT NULL,
        status VARCHAR(32) DEFAULT 'Validée',
        payment_method VARCHAR(64) DEFAULT 'E-Point Wallet Routini',
        shipping_address TEXT,
        customer_cin VARCHAR(64),
        customer_phone VARCHAR(64),
        total_rp_dh NUMERIC(12, 2) DEFAULT 0,
        total_pm_dh NUMERIC(12, 2) DEFAULT 0,
        total_pv NUMERIC(12, 2) DEFAULT 0,
        total_sv NUMERIC(12, 2) DEFAULT 0,
        fidelity_points_earned INT DEFAULT 0,
        fidelity_points_used INT DEFAULT 0,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(64) PRIMARY KEY,
        date VARCHAR(32) NOT NULL,
        member_code VARCHAR(64) NOT NULL,
        member_name VARCHAR(255) NOT NULL,
        type VARCHAR(64) NOT NULL,
        level INT DEFAULT 1,
        source_member_code VARCHAR(64),
        source_member_name VARCHAR(255),
        order_id VARCHAR(64),
        cv_base_dh NUMERIC(12, 2) DEFAULT 0,
        rate_percent NUMERIC(5, 2) DEFAULT 0,
        amount_dh NUMERIC(12, 2) NOT NULL,
        status VARCHAR(32) DEFAULT 'Acquitté',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS system_state (
        key VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Seeding des données initiales si la table est vide ou si body.forceSeeding est passé
    const existing = await query(`SELECT COUNT(*) as count FROM members`);
    const count = Number(existing[0]?.count || 0);

    let seededCount = 0;
    let seedPayload = req.body?.members;

    if (!seedPayload && count === 0) {
      try {
        const dataFilePath = path.join(process.cwd(), 'mock_network_6months.json');
        if (fs.existsSync(dataFilePath)) {
          const raw = fs.readFileSync(dataFilePath, 'utf-8');
          const parsed = JSON.parse(raw);
          seedPayload = parsed.members;
        }
      } catch (err) {
        console.warn('Fichier mock non accessible côté serverless, utilisation de la charge utile directe.');
      }
    }

    if (seedPayload && Array.isArray(seedPayload)) {
      for (const m of seedPayload) {
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
            active = EXCLUDED.active,
            updated_at = CURRENT_TIMESTAMP
        `, [
          m.id || m.code,
          m.code,
          m.name,
          m.email || '',
          m.phone || '+212 661 000000',
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
        seededCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Base de données Neon Postgres initialisée avec succès !',
      tablesCreated: ['members', 'products', 'orders', 'transactions', 'system_state'],
      seededMembers: seededCount,
      existingCountBefore: count
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
