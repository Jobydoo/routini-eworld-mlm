-- =============================================================================
-- ROUTINI COSMETICS - ROUTINI ONE PLAN (Version 4 • Septembre 2026)
-- Schéma Officiel PostgreSQL pour Neon Serverless Postgres / Vercel Postgres
-- =============================================================================

-- Table des membres du réseau MLM et clients
CREATE TABLE IF NOT EXISTS members (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(64),
  cin VARCHAR(64),
  city VARCHAR(128) DEFAULT 'Casablanca',
  country VARCHAR(64) DEFAULT 'Maroc',
  role VARCHAR(32) DEFAULT 'distributor', -- 'distributor', 'owner', 'client'
  rank_code VARCHAR(32) DEFAULT 'PARTNER', -- 'PARTNER', 'BUILDER', 'LEADER', 'MANAGER', 'DIAMOND', 'AMBASSADOR', 'CLIENT'
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

CREATE INDEX IF NOT EXISTS idx_members_sponsor ON members(sponsor_code);
CREATE INDEX IF NOT EXISTS idx_members_rank ON members(rank_code);
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);

-- Table du catalogue des cosmétiques et soins Routini
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  is_pack BOOLEAN DEFAULT false,
  badge VARCHAR(128),
  description TEXT,
  icon VARCHAR(32) DEFAULT '✨',
  image_url VARCHAR(512),
  price_rp_dh NUMERIC(10, 2) NOT NULL, -- Prix Public (PP)
  price_pm_dh NUMERIC(10, 2) NOT NULL, -- Prix Membre (PM = 90% PP)
  price_dp_dh NUMERIC(10, 2) NOT NULL, -- Prix Distributeur (identique PM)
  pv NUMERIC(10, 2) NOT NULL,         -- Points PV = PP / 10
  sv NUMERIC(10, 2) NOT NULL,         -- Commission Value = 60% PM
  stock INT DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Table des commandes
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

CREATE INDEX IF NOT EXISTS idx_orders_member ON orders(member_code);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- Table des transactions et commissions versées
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(64) PRIMARY KEY,
  date VARCHAR(32) NOT NULL,
  member_code VARCHAR(64) NOT NULL,
  member_name VARCHAR(255) NOT NULL,
  type VARCHAR(64) NOT NULL, -- 'Bonus N1 (Direct)', 'Bonus N2', 'Bonus N3', 'Leadership Différentiel', 'Vente Client', 'Retrait'
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

CREATE INDEX IF NOT EXISTS idx_transactions_member ON transactions(member_code);

-- Table d'état global du système et synchronisation
CREATE TABLE IF NOT EXISTS system_state (
  key VARCHAR(64) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
