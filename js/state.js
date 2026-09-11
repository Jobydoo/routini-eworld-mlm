/**
 * Routini eWorld MLM - Gestionnaire d'État Global et Base de Données Locale
 * Modèle Officiel : ROUTINE ONE PLAN (V1 - V2 - V3)
 * Document de Référence : 23 Slides Officielles
 * 
 * Principes Fondamentaux :
 * 1. Inscription Partenaire = 0 DH (pas de recrutement payé).
 * 2. 3 Profils Clients (Slide 14) :
 *    - Client Direct (0% commission, points fidélité, stabilisateur de marge)
 *    - Client Rattaché (10% commission au Partner vendeur + CV réseau N1/N2/N3)
 *    - Partner (ventes + réseau, pas de commission sur auto-achat)
 * 3. Les Compteurs (Slide 3 & 21) :
 *    - Points Fidélité Client : 20 pts = 10 DH (remise futur achat, pas de cash)
 *    - PV (Qualification) : Mesure l'activité et détermine le grade
 *    - CV (Commission Volume) : Outil interne de sécurité financière et base de calcul N1/N2/N3/Leadership
 * 4. Règle Anti-Double Paiement & Anti-Auto-Achat (Slide 15, 17, 20) :
 *    - Une vente = une commission personnelle (10% vendeur OU position réseau, jamais deux fois)
 *    - Le N1 commence au niveau supérieur dans la chaîne de parrainage
 * 5. Payout Cash Cible : <= 22% du CA (Slide 19 & 23)
 * 6. Les 6 Grades (Slide 6 & 11) :
 *    - Partner (N1) -> Builder (1%, N1+N2) -> Leader (2%, N1+N2+N3) -> Manager (3%) -> Diamond (5%) -> Ambassador (7%)
 */

const STORAGE_KEY = 'ROUTINI_ONE_PLAN_STATE_V8';

// Barème officiel des 6 grades Routine ONE PLAN
const ROUTINE_GRADES = [
  {
    code: 'PARTNER',
    name: 'Partner',
    minPV: 150,
    minClients: 5,
    structure: 'Actif (150 PV ou 5 clients)',
    depth: 'N1 (10% CV)',
    maxDepth: 1,
    leadershipRate: 0,
    badgeClass: 'rank-partner',
    desc: 'Actif sans achat personnel obligatoire. Accès au Niveau 1.'
  },
  {
    code: 'BUILDER',
    name: 'Builder',
    minPV: 500,
    structure: '2 actifs directs',
    depth: 'N1 + N2',
    maxDepth: 2,
    leadershipRate: 0.01,
    badgeClass: 'rank-builder',
    desc: '500 PV Équipe/mois • Accès N1 (10%) + N2 (5%) • Leadership 1%'
  },
  {
    code: 'LEADER',
    name: 'Leader',
    minPV: 2500,
    structure: '3 Builders directs',
    depth: 'N1 + N2 + N3',
    maxDepth: 3,
    leadershipRate: 0.02,
    badgeClass: 'rank-leader',
    desc: '2 500 PV Équipe/mois • Accès N1 + N2 + N3 • Leadership 2%'
  },
  {
    code: 'MANAGER',
    name: 'Manager',
    minPV: 10000,
    structure: '3 Leaders directs',
    depth: 'N1 + N2 + N3',
    maxDepth: 3,
    leadershipRate: 0.03,
    badgeClass: 'rank-manager',
    desc: '10 000 PV Équipe/mois • Leadership 3%'
  },
  {
    code: 'DIAMOND',
    name: 'Diamond',
    minPV: 30000,
    structure: '3 Managers directs',
    depth: 'N1 + N2 + N3',
    maxDepth: 3,
    leadershipRate: 0.05,
    badgeClass: 'rank-diamond',
    desc: '30 000 PV Équipe/mois • Leadership 5%'
  },
  {
    code: 'AMBASSADOR',
    name: 'Ambassador',
    minPV: 100000,
    structure: '3 Diamonds directs',
    depth: 'N1 + N2 + N3',
    maxDepth: 3,
    leadershipRate: 0.07,
    badgeClass: 'rank-ambassador',
    desc: '100 000 PV Équipe/mois • Leadership 7% (palier suprême)'
  }
];

// Catalogue des 9 Soins Officiels & Packs Routines (avec SV/CV dynamique modifiable par l'Admin)
const INITIAL_PRODUCTS = [
  // --- PACKS ROUTINES COSMÉTIQUES (CV adapté Slide 21) ---
  {
    id: 'PACK-001',
    name: 'Pack Routine Glow Découverte (3 Soins + Trousse)',
    category: 'Packs & Rituels',
    isPack: true,
    badge: 'Starter Pack',
    desc: 'Rituel coup d’éclat : Sérum Vitamine C, Crème Jour SPF 30, Eau Micellaire + Trousse beauté Routini.',
    icon: '🎁',
    priceDP_DH: 740,
    priceRP_DH: 980,
    priceDP_EUR: 68.00,
    priceRP_EUR: 90.00,
    pv: 100,
    sv: 420, // SV / CV Modifiable
    marginCategory: 'Pack promotionnel (CV équilibré)',
    stock: 50
  },
  {
    id: 'PACK-002',
    name: 'Pack Rituel Anti-Âge Suprême Rétinol & Argan',
    category: 'Packs & Rituels',
    isPack: true,
    badge: 'Populaire',
    desc: 'Le rituel régénérant intense : Crème Nuit Rétinol, Huile Précieuse d’Argan & Rose, Masque Argile et Soin Yeux.',
    icon: '✨',
    priceDP_DH: 1460,
    priceRP_DH: 1950,
    priceDP_EUR: 135.00,
    priceRP_EUR: 180.00,
    pv: 200,
    sv: 840,
    marginCategory: 'Pack promotionnel',
    stock: 35
  },
  {
    id: 'PACK-003',
    name: 'Pack Ambassadrice Institut Routine (Gamme Complète x2)',
    category: 'Packs & Rituels',
    isPack: true,
    badge: 'Master Pro',
    desc: 'Coffret professionnel complet comprenant l’ensemble des soins Routini en double exemplaire pour démonstrations.',
    icon: '👑',
    priceDP_DH: 3600,
    priceRP_DH: 4800,
    priceDP_EUR: 330.00,
    priceRP_EUR: 445.00,
    pv: 500,
    sv: 2150,
    marginCategory: 'Pack Institut Pro',
    stock: 20
  },

  // --- LES 9 PRODUITS DE BASE ROUTINI (Slide 21 : Cosmetics à bonne marge = CV élevé) ---
  {
    id: 'RTN-001',
    name: 'Sérum Éclat Vitamine C & Acide Hyaluronique (30ml)',
    category: 'Soins Visage',
    isPack: false,
    badge: 'Bestseller',
    desc: 'Sérum ultra-concentré anti-oxydant, illumine le teint et repulpe la peau dès la première semaine.',
    icon: '✨',
    priceDP_DH: 240,
    priceRP_DH: 320,
    priceDP_EUR: 22.50,
    priceRP_EUR: 30.00,
    pv: 22,
    sv: 110, // CV modifiable
    marginCategory: 'Cosmétique forte marge (CV élevé)',
    stock: 140
  },
  {
    id: 'RTN-002',
    name: 'Crème Anti-Âge Régénératrice Nuit au Rétinol Végétal (50ml)',
    category: 'Anti-Âge',
    isPack: false,
    badge: 'Nouveauté',
    desc: 'Soin de nuit lissant aux peptides et bakuchiol végétal. Raffermit les contours et comble les rides.',
    icon: '🌙',
    priceDP_DH: 290,
    priceRP_DH: 390,
    priceDP_EUR: 27.00,
    priceRP_EUR: 36.50,
    pv: 28,
    sv: 130,
    marginCategory: 'Cosmétique forte marge (CV élevé)',
    stock: 95
  },
  {
    id: 'RTN-003',
    name: 'Crème de Jour Hydratation Intense SPF 30 (50ml)',
    category: 'Soins Visage',
    isPack: false,
    badge: 'Protection',
    desc: 'Bouclier protecteur anti-pollution et anti-UV enrichi en extrait de thé blanc et céramides.',
    icon: '☀️',
    priceDP_DH: 210,
    priceRP_DH: 280,
    priceDP_EUR: 19.50,
    priceRP_EUR: 26.00,
    pv: 18,
    sv: 95,
    marginCategory: 'Cosmétique forte marge',
    stock: 120
  },
  {
    id: 'RTN-004',
    name: 'Huile Précieuse d’Argan Pure Bio & Rose de Damas (100ml)',
    category: 'Huiles Précieuses',
    isPack: false,
    badge: 'Bio Certifié',
    desc: 'Élixir 100% pur pressé à froid certifié bio, infusé de pétales de rose. Nourrit visage et cheveux.',
    icon: '🌹',
    priceDP_DH: 260,
    priceRP_DH: 350,
    priceDP_EUR: 24.00,
    priceRP_EUR: 32.50,
    pv: 25,
    sv: 120,
    marginCategory: 'Huile Précieuse (CV élevé)',
    stock: 110
  },
  {
    id: 'RTN-005',
    name: 'Contour des Yeux Défatigant Caféine & Peptides (15ml)',
    category: 'Soins Visage',
    isPack: false,
    badge: 'Anti-Cernes',
    desc: 'Formule décongestionnante fraîche instantanée anti-cernes, anti-poches et lissante pour le regard.',
    icon: '👁️',
    priceDP_DH: 175,
    priceRP_DH: 235,
    priceDP_EUR: 16.00,
    priceRP_EUR: 22.00,
    pv: 15,
    sv: 80,
    marginCategory: 'Soin ciblé',
    stock: 130
  },
  {
    id: 'RTN-006',
    name: 'Masque Purifiant Éclat Argile Rose & Niacinamide (100ml)',
    category: 'Soins Visage',
    isPack: false,
    badge: 'Purifiant',
    desc: 'Désincruste les pores sans assécher, équilibre le sébum et affine le grain de peau pour un teint lumineux.',
    icon: '🌸',
    priceDP_DH: 160,
    priceRP_DH: 220,
    priceDP_EUR: 15.00,
    priceRP_EUR: 20.50,
    pv: 14,
    sv: 70,
    marginCategory: 'Soin ciblé',
    stock: 85
  },
  {
    id: 'RTN-007',
    name: 'Eau Micellaire Apaisante Eau de Bleuet & Aloe Vera (250ml)',
    category: 'Nettoyants',
    isPack: false,
    badge: 'Douceur',
    desc: 'Démaquille en douceur visage, yeux et lèvres tout en apaisant les peaux sensibles.',
    icon: '💧',
    priceDP_DH: 115,
    priceRP_DH: 155,
    priceDP_EUR: 10.50,
    priceRP_EUR: 14.50,
    pv: 10,
    sv: 45, // Petit prix = CV plus faible (Slide 21)
    marginCategory: 'Nettoyant petit prix (CV ajusté)',
    stock: 175
  },
  {
    id: 'RTN-008',
    name: 'Gommage Exfoliant Corps Sucre Doré & Noix de Coco (200g)',
    category: 'Soins Corps',
    isPack: false,
    badge: 'Gourmand',
    desc: 'Gommage gourmand qui élimine les cellules mortes et laisse un voile satiné parfumé.',
    icon: '🥥',
    priceDP_DH: 185,
    priceRP_DH: 250,
    priceDP_EUR: 17.00,
    priceRP_EUR: 23.00,
    pv: 16,
    sv: 80,
    marginCategory: 'Soins Corps',
    stock: 90
  },
  {
    id: 'RTN-009',
    name: 'Lait Corps Soyeux Beurre de Karité & Fleur d’Oranger (300ml)',
    category: 'Soins Corps',
    isPack: false,
    badge: 'Hydratant',
    desc: 'Lait hydratation 24h à absorption rapide. Adoucit et parfume délicatement la peau.',
    icon: '🧴',
    priceDP_DH: 145,
    priceRP_DH: 195,
    priceDP_EUR: 13.50,
    priceRP_EUR: 18.00,
    pv: 12,
    sv: 60,
    marginCategory: 'Soins Corps',
    stock: 160
  }
];

// Membres initiaux, commandes et transactions (sourcés depuis mock_data.js)
const INITIAL_MEMBERS = (typeof window !== 'undefined' && window.ROUTINI_MOCK_DATA && window.ROUTINI_MOCK_DATA.members)
  ? window.ROUTINI_MOCK_DATA.members
  : [];

const INITIAL_ORDERS = (typeof window !== 'undefined' && window.ROUTINI_MOCK_DATA && window.ROUTINI_MOCK_DATA.orders)
  ? window.ROUTINI_MOCK_DATA.orders
  : [];

const INITIAL_TRANSACTIONS = (typeof window !== 'undefined' && window.ROUTINI_MOCK_DATA && window.ROUTINI_MOCK_DATA.transactions)
  ? window.ROUTINI_MOCK_DATA.transactions
  : [];

class StateManager {
  constructor() {
    this.currency = 'DH';
    this.eurRate = 0.093;
    this.currentUser = null;
    this.cart = [];
    this.orderChannel = 'attached_client'; // 'attached_client' (10% + CV), 'partner_personal' (0% auto-com), 'direct_client' (0% MLM)
    this.grades = ROUTINE_GRADES;
    this.transactions = [];
    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.products = parsed.products || INITIAL_PRODUCTS;
        this.members = (parsed.members && parsed.members.length >= 50) ? parsed.members : INITIAL_MEMBERS;
        this.orders = (parsed.orders && parsed.orders.length >= 100) ? parsed.orders : INITIAL_ORDERS;
        this.transactions = (parsed.transactions && parsed.transactions.length >= 5) ? parsed.transactions : INITIAL_TRANSACTIONS;
        this.currency = parsed.currency || 'DH';
        const savedUserId = parsed.currentUserId || 'ADMIN001';
        this.currentUser = this.getMemberByCode(savedUserId) || this.members[0];
      } else {
        this.resetToDefaults();
      }
    } catch (e) {
      console.error('Erreur chargement état local Routini:', e);
      this.resetToDefaults();
    }
  }

  saveState() {
    try {
      const data = {
        products: this.products,
        members: this.members,
        orders: this.orders,
        transactions: this.transactions,
        currency: this.currency,
        currentUserId: this.currentUser ? this.currentUser.code : 'ADMIN001'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erreur sauvegarde état Routini:', e);
    }
  }

  resetToDefaults() {
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.members = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
    this.currency = 'DH';
    this.currentUser = this.members[0]; // Administrateur par défaut
    this.cart = [];
    this.orderChannel = 'attached_client';
    this.saveState();
  }

  setCurrency(curr) {
    if (curr === 'DH' || curr === 'EUR') {
      this.currency = curr;
      this.saveState();
    }
  }

  formatMoney(amountDH) {
    if (typeof amountDH !== 'number' || isNaN(amountDH)) amountDH = 0;
    if (this.currency === 'EUR') {
      const eur = amountDH * this.eurRate;
      return eur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    }
    return amountDH.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' DH';
  }

  getMemberByCode(code) {
    if (!code) return null;
    const clean = String(code).trim().toLowerCase();
    if (clean === 'admin' || clean === 'admin001') {
      return this.members.find(m => m.code === 'ADMIN001' || m.id === 'ADMIN001' || m.role === 'owner') || this.members[0];
    }
    return this.members.find(m => 
      m.code.toLowerCase() === clean || 
      m.id.toLowerCase() === clean || 
      (m.email && m.email.toLowerCase() === clean)
    );
  }

  getGrade(rankCode) {
    return this.grades.find(g => g.code === rankCode) || this.grades[0];
  }

  login(code, password) {
    const member = this.getMemberByCode(code);
    if (!member) {
      return { success: false, message: 'Identifiant introuvable. Pour l\'administrateur, utilisez "admin" ou "ADMIN001".' };
    }

    const isAdmin = member.role === 'owner' || member.code === 'ADMIN001' || member.id === 'ADMIN001';
    if (isAdmin) {
      if (password === 'admin123' || password === 'admin' || password === member.password) {
        this.currentUser = member;
        this.saveState();
        return { success: true, user: member };
      }
    } else {
      if (password === 'routini123' || password === member.password) {
        this.currentUser = member;
        this.saveState();
        return { success: true, user: member };
      }
    }

    return { success: false, message: 'Mot de passe incorrect (admin123 pour l\'Admin, routini123 pour les membres).' };
  }

  switchUser(code) {
    const member = this.getMemberByCode(code);
    if (member) {
      this.currentUser = member;
      this.cart = [];
      this.saveState();
      return true;
    }
    return false;
  }

  isOwner() {
    return this.currentUser && (this.currentUser.role === 'owner' || this.currentUser.code === 'ADMIN001' || this.currentUser.id === 'ADMIN001' || String(this.currentUser.code).toLowerCase() === 'admin');
  }

  getDirectDownlines(sponsorCode) {
    return this.members.filter(m => m.sponsorCode === sponsorCode);
  }

  getDownlinesByLevel(sponsorCode, targetLevel = 1) {
    const result = [];
    const traverse = (code, currentLevel) => {
      const directs = this.getDirectDownlines(code);
      if (currentLevel === targetLevel) {
        result.push(...directs);
      } else if (currentLevel < targetLevel) {
        for (const d of directs) {
          traverse(d.code, currentLevel + 1);
        }
      }
    };
    traverse(sponsorCode, 1);
    return result;
  }

  getAllDownlines(sponsorCode) {
    const result = [];
    const traverse = (code, level = 1) => {
      const directs = this.getDirectDownlines(code);
      for (const d of directs) {
        result.push({ ...d, downlineLevel: level });
        traverse(d.code, level + 1);
      }
    };
    traverse(sponsorCode, 1);
    return result;
  }

  buildGenealogyTree(rootCode, maxDepth = 4, currentDepth = 1) {
    const rootMember = this.getMemberByCode(rootCode);
    if (!rootMember) return null;

    const node = {
      ...rootMember,
      depth: currentDepth,
      children: []
    };

    if (currentDepth < maxDepth) {
      const directs = this.getDirectDownlines(rootMember.code);
      node.children = directs.map(child => this.buildGenealogyTree(child.code, maxDepth, currentDepth + 1)).filter(Boolean);
    }

    return node;
  }

  isMemberActive(member) {
    if (!member) return false;
    return (member.ppv >= 150) || ((member.clientsCount || 0) >= 5);
  }

  evaluateRankPromotion(member) {
    if (member.role === 'owner') return;

    const teamPV = member.teamPV || 0;
    const directs = this.getDirectDownlines(member.code);
    const activeDirects = directs.filter(d => this.isMemberActive(d)).length;
    const builderDirects = directs.filter(d => ['BUILDER', 'LEADER', 'MANAGER', 'DIAMOND', 'AMBASSADOR'].includes(d.rankCode)).length;
    const leaderDirects = directs.filter(d => ['LEADER', 'MANAGER', 'DIAMOND', 'AMBASSADOR'].includes(d.rankCode)).length;
    const managerDirects = directs.filter(d => ['MANAGER', 'DIAMOND', 'AMBASSADOR'].includes(d.rankCode)).length;
    const diamondDirects = directs.filter(d => ['DIAMOND', 'AMBASSADOR'].includes(d.rankCode)).length;

    let newRank = 'PARTNER';
    let newName = 'Partner (N1 Accès)';

    if (teamPV >= 100000 && diamondDirects >= 3) {
      newRank = 'AMBASSADOR';
      newName = 'Ambassador (7% Leadership)';
    } else if (teamPV >= 30000 && managerDirects >= 3) {
      newRank = 'DIAMOND';
      newName = 'Diamond (5% Leadership)';
    } else if (teamPV >= 10000 && leaderDirects >= 3) {
      newRank = 'MANAGER';
      newName = 'Manager (3% Leadership)';
    } else if (teamPV >= 2500 && builderDirects >= 3) {
      newRank = 'LEADER';
      newName = 'Leader (2% Leadership)';
    } else if (teamPV >= 500 && activeDirects >= 2) {
      newRank = 'BUILDER';
      newName = 'Builder (1% Leadership)';
    } else if (this.isMemberActive(member)) {
      newRank = 'PARTNER';
      newName = 'Partner (N1 Accès)';
    }

    member.rankCode = newRank;
    member.rankName = newName;
  }

  registerNewMember(data) {
    const sponsor = this.getMemberByCode(data.sponsorCode);
    if (!sponsor) {
      return { success: false, message: 'Code parrain introuvable.' };
    }

    let newCode;
    do {
      newCode = '818' + Math.floor(100000 + Math.random() * 900000);
    } while (this.getMemberByCode(newCode));

    const kitPV = Number(data.kitPV || 0);
    const kitSV = Number(data.kitSV || (kitPV * 4.2));

    const newMember = {
      id: newCode,
      code: newCode,
      name: data.fullName,
      email: data.email,
      role: 'distributor',
      rankCode: 'PARTNER',
      rankName: 'Partner (N1 Accès)',
      sponsorCode: sponsor.code,
      sponsorName: sponsor.name,
      password: data.password || 'routini123',
      phone: data.phone || '',
      city: data.city || 'Casablanca',
      country: data.country || 'Maroc',
      joinDate: new Date().toLocaleDateString('fr-FR'),
      ppv: kitPV,
      teamPV: 0,
      gpv: kitPV,
      sv: kitSV,
      monthlySalesDH: kitPV > 0 ? (kitPV * 9.8) : 0,
      walletDH: 0.00,
      clientsCount: kitPV > 0 ? 1 : 0,
      fidelityPoints: kitPV > 0 ? Math.floor(kitPV * 0.4) : 0,
      active: true
    };

    this.members.push(newMember);

    if (kitPV > 0) {
      this.propagatePointsUpstream(sponsor.code, kitPV, kitSV);
    }

    this.saveState();
    return { success: true, member: newMember };
  }

  propagatePointsUpstream(startSponsorCode, addedPV, addedSV) {
    let currentSponsorCode = startSponsorCode;
    let iterations = 0;
    while (currentSponsorCode && iterations < 20) {
      const sp = this.getMemberByCode(currentSponsorCode);
      if (!sp) break;
      sp.teamPV = (sp.teamPV || 0) + addedPV;
      sp.gpv = (sp.gpv || 0) + addedPV;
      sp.sv = (sp.sv || 0) + addedSV;
      this.evaluateRankPromotion(sp);
      currentSponsorCode = sp.sponsorCode;
      iterations++;
    }
  }

  // --- PANIER & COMMANDE AVEC RÈGLE ANTI-DOUBLE PAIEMENT & ANTI-AUTO-ACHAT (Slide 15, 17, 20) ---
  addToCart(productId, quantity = 1) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existing = this.cart.find(item => item.product.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
  }

  updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.cart = this.cart.filter(item => item.product.id !== productId);
    } else {
      const existing = this.cart.find(item => item.product.id === productId);
      if (existing) existing.quantity = quantity;
    }
  }

  clearCart() {
    this.cart = [];
  }

  getCartTotals() {
    let totalDH = 0;
    let totalPV = 0;
    let totalSV = 0;
    let totalItems = 0;

    for (const item of this.cart) {
      totalDH += item.product.priceDP_DH * item.quantity;
      totalPV += item.product.pv * item.quantity;
      totalSV += item.product.sv * item.quantity;
      totalItems += item.quantity;
    }

    const fidelityPoints = Math.floor(totalDH * 0.05 * 2); // 20 pts = 10 DH
    const totalEUR = totalDH * this.eurRate;

    // Diagnostic de payout théorique (Slide 19 : Plafond <= 22%)
    // Vendeur 10% DH + N1 10% CV + N2 5% CV + N3 3% CV
    const maxTheoreticalPayoutDH = (totalDH * 0.10) + (totalSV * (0.10 + 0.05 + 0.03));
    const payoutRatioPercent = totalDH > 0 ? ((maxTheoreticalPayoutDH / totalDH) * 100).toFixed(1) : 0;

    return { totalDH, totalEUR, totalPV, totalSV, totalItems, fidelityPoints, maxTheoreticalPayoutDH, payoutRatioPercent };
  }

  checkoutCart(paymentMethod = 'E-Point', orderChannel = 'attached_client') {
    if (this.cart.length === 0) return { success: false, message: 'Le panier est vide.' };

    const totals = this.getCartTotals();
    const buyer = this.currentUser;

    if (paymentMethod === 'E-Point') {
      if (buyer.walletDH < totals.totalDH) {
        return {
          success: false,
          message: `Solde E-Point insuffisant (${totals.totalDH} DH requis, solde actuel: ${buyer.walletDH} DH).`
        };
      }
      buyer.walletDH -= totals.totalDH;
    }

    // Traitement des compteurs selon le type de commande (Slide 15 & 17) :
    // 1. 'attached_client' (Vente client rattaché) :
    //    - Le Partner vendeur touche 10% sur le CA (en DH)
    //    - La vente génère du CV pour le parrain et les niveaux supérieurs (N1, N2, N3)
    //    - Slide 20 : Le Partner vendeur ne touche PAS le N1 sur sa propre vente
    // 2. 'partner_personal' (Auto-achat de réassort) :
    //    - Pas de 10% auto-commission (Slide 15)
    //    - Crédite des PPV
    // 3. 'direct_client' (Client direct sans parrain) :
    //    - 0% MLM, stabilise la marge
    buyer.ppv = (buyer.ppv || 0) + totals.totalPV;
    buyer.fidelityPoints = (buyer.fidelityPoints || 0) + totals.fidelityPoints;
    buyer.gpv = (buyer.gpv || 0) + totals.totalPV;

    if (orderChannel === 'attached_client') {
      buyer.monthlySalesDH = (buyer.monthlySalesDH || 0) + totals.totalDH;
      buyer.clientsCount = (buyer.clientsCount || 0) + 1;
      // Vendeur reçoit immédiatement ses 10% sur vente client
      const personalCommissionDH = Math.round(totals.totalDH * 0.10);
      buyer.walletDH = (buyer.walletDH || 0) + personalCommissionDH;

      // La chaîne réseau (N1/N2/N3) commence au PARRAIN direct (Slide 20 : Règle Anti-Double Paiement)
      if (buyer.sponsorCode) {
        this.propagatePointsUpstream(buyer.sponsorCode, totals.totalPV, totals.totalSV);
      }
    } else if (orderChannel === 'partner_personal') {
      // Auto-achat : pas de 10% direct, mais le CV remonte pour qualification
      if (buyer.sponsorCode) {
        this.propagatePointsUpstream(buyer.sponsorCode, totals.totalPV, totals.totalSV);
      }
    }

    this.evaluateRankPromotion(buyer);

    const orderId = 'CMD-RTN-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      orderType: orderChannel,
      memberCode: buyer.code,
      memberName: `${buyer.name} (${orderChannel === 'attached_client' ? 'Client Rattaché' : 'Achat Perso'})`,
      date: new Date().toLocaleDateString('fr-FR'),
      itemsCount: totals.totalItems,
      totalDH: totals.totalDH,
      totalEUR: totals.totalEUR,
      totalPV: totals.totalPV,
      totalSV: totals.totalSV,
      fidelityPoints: totals.fidelityPoints,
      paymentMethod: paymentMethod,
      status: 'Validée & Expédiée'
    };

    this.orders.unshift(newOrder);
    this.clearCart();
    this.saveState();

    return { success: true, order: newOrder };
  }

  // --- GESTION ADMIN DES PRODUITS & PACKS (SV/CV DYNAMIQUE MODIFIABLE) ---
  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  addProduct(newProd) {
    const isPack = Boolean(newProd.isPack || newProd.category === 'Packs & Rituels');
    const prefix = isPack ? 'PACK-' : 'RTN-';
    const id = prefix + String(this.products.length + 1).padStart(3, '0');

    const priceDP = Number(newProd.priceDP_DH) || 0;
    const priceRP = Number(newProd.priceRP_DH) || Math.round(priceDP * 1.33);

    const product = {
      id,
      name: newProd.name.trim(),
      category: newProd.category || (isPack ? 'Packs & Rituels' : 'Soins Visage'),
      isPack: isPack,
      badge: newProd.badge || (isPack ? 'Pack Spécial' : 'Nouveau'),
      desc: newProd.desc ? newProd.desc.trim() : '',
      icon: newProd.icon || (isPack ? '🎁' : '✨'),
      priceDP_DH: priceDP,
      priceRP_DH: priceRP,
      priceDP_EUR: Number((priceDP * this.eurRate).toFixed(2)),
      priceRP_EUR: Number((priceRP * this.eurRate).toFixed(2)),
      pv: Number(newProd.pv) || 0,
      sv: Number(newProd.sv) || 0, // SV / CV modifiable
      marginCategory: newProd.marginCategory || (isPack ? 'Pack promotionnel' : 'Cosmétique standard'),
      stock: Number(newProd.stock) || 50
    };

    this.products.unshift(product);
    this.saveState();
    return product;
  }

  updateProduct(id, updatedData) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return { success: false, message: 'Produit introuvable.' };

    const prod = this.products[index];
    const priceDP = updatedData.priceDP_DH !== undefined ? Number(updatedData.priceDP_DH) : prod.priceDP_DH;
    const priceRP = updatedData.priceRP_DH !== undefined ? Number(updatedData.priceRP_DH) : prod.priceRP_DH;

    prod.name = updatedData.name !== undefined ? updatedData.name.trim() : prod.name;
    prod.category = updatedData.category || prod.category;
    prod.isPack = updatedData.isPack !== undefined ? Boolean(updatedData.isPack) : (prod.category === 'Packs & Rituels');
    prod.badge = updatedData.badge !== undefined ? updatedData.badge.trim() : prod.badge;
    prod.desc = updatedData.desc !== undefined ? updatedData.desc.trim() : prod.desc;
    prod.icon = updatedData.icon || prod.icon;
    prod.priceDP_DH = priceDP;
    prod.priceRP_DH = priceRP;
    prod.priceDP_EUR = Number((priceDP * this.eurRate).toFixed(2));
    prod.priceRP_EUR = Number((priceRP * this.eurRate).toFixed(2));
    prod.pv = updatedData.pv !== undefined ? Number(updatedData.pv) : prod.pv;
    prod.sv = updatedData.sv !== undefined ? Number(updatedData.sv) : prod.sv; // SV / CV Modifiable
    prod.marginCategory = updatedData.marginCategory || prod.marginCategory;
    prod.stock = updatedData.stock !== undefined ? Number(updatedData.stock) : prod.stock;

    this.saveState();
    return { success: true, product: prod };
  }

  deleteProduct(id) {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    this.cart = this.cart.filter(item => item.product.id !== id);
    this.saveState();
    return this.products.length < initialLen;
  }

  injectPoints(memberCode, addedPV, addedSV) {
    const member = this.getMemberByCode(memberCode);
    if (!member) return false;

    member.ppv = (member.ppv || 0) + addedPV;
    member.gpv = (member.gpv || 0) + addedPV;
    member.sv = (member.sv || 0) + addedSV;

    if (member.sponsorCode) {
      this.propagatePointsUpstream(member.sponsorCode, addedPV, addedSV);
    }

    this.evaluateRankPromotion(member);
    this.saveState();
    return true;
  }

  updateMemberRank(memberCode, newRankCode) {
    const member = this.getMemberByCode(memberCode);
    const grade = this.getGrade(newRankCode);
    if (!member || !grade) return false;

    member.rankCode = grade.code;
    member.rankName = `${grade.name} (${grade.leadershipRate > 0 ? (grade.leadershipRate * 100) + '% Leadership' : 'N1'})`;
    this.saveState();
    return true;
  }

  creditWallet(memberCode, amountDH) {
    const member = this.getMemberByCode(memberCode);
    if (!member) return false;
    member.walletDH = (member.walletDH || 0) + amountDH;
    this.saveState();
    return true;
  }

  getCompanyStats() {
    const totalMembers = this.members.length;
    const totalDistributors = this.members.filter(m => m.role === 'distributor').length;
    let totalSalesDH = 0;
    let totalTurnoverPV = 0;
    let totalTurnoverSV = 0;

    for (const ord of this.orders) {
      totalSalesDH += ord.totalDH;
      totalTurnoverPV += ord.totalPV;
      totalTurnoverSV += ord.totalSV;
    }

    const totalWalletsDH = this.members.reduce((acc, m) => acc + (m.walletDH || 0), 0);
    const totalProducts = this.products.length;
    const totalPacks = this.products.filter(p => p.isPack || p.category === 'Packs & Rituels').length;

    return {
      totalMembers,
      totalDistributors,
      totalSalesDH,
      totalTurnoverPV,
      totalTurnoverSV,
      totalWalletsDH,
      totalOrders: this.orders.length,
      totalProducts,
      totalPacks
    };
  }
}

window.stateManager = new StateManager();
