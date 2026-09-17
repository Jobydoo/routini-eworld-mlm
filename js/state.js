/**
 * Routini eWorld MLM - Gestionnaire d'État Global et Base de Données Locale
 * Modèle Officiel : ROUTINE ONE PLAN — Version 4 (Septembre 2026)
 * Document de Référence : Document Officiel 18 Slides (Septembre 2026)
 * 
 * 6 Règles Fondamentales du Plan en 1 Minute (Slide 2) :
 * 1. Prix Membre (PM) : 90% du Prix Public (PP). Même remise de 10% pour TOUS les grades.
 * 2. Points PV : 1 PV = 10 DH Prix Public (PV = PP ÷ 10). Mesure l'activité et le volume de référence.
 * 3. Commission Value (CV) : 60% du Prix Membre payé (CV = 60% × PM). Base monétaire de calcul des commissions.
 * 4. Commissions Réseau : N1 10% • N2 5% • N3 3% appliqués au CV (jusqu'à 3 niveaux max).
 * 5. Qualification Builder : ≥ 2 000 PV équipe cumulés (Seul grade supérieur avec seuil PV !).
 * 6. Progression après Builder : NOUVELLE RÈGLE 100% STRUCTURELLE (aucun seuil de PV équipe !) :
 *    - Leader : 2 Builders actifs
 *    - Manager : 2 Leaders actifs
 *    - Diamond : 2 Managers actifs
 *    - Ambassador : 2 Diamonds actifs
 * 
 * Activité Personnelle Mensuelle (Slide 8) :
 * - Partner : 50 PV minimum (500 DH PP / 450 DH PM)
 * - Builder : 100 PV minimum (1 000 DH PP / 900 DH PM)
 * - Leader : 200 PV minimum (2 000 DH PP / 1 800 DH PM)
 * - Manager : 400 PV minimum (4 000 DH PP / 3 600 DH PM)
 * - Diamond : 800 PV minimum (8 000 DH PP / 7 200 DH PM)
 * - Ambassador : 1 600 PV minimum (16 000 DH PP / 14 400 DH PM)
 * Règle d'inactivité (Slide 8 & 15) : Si le minimum personnel n'est pas atteint, aucune commission n'est versée ce mois-là.
 * Grade historique et réseau conservés.
 * 
 * Leadership Différentiel (Slide 9) :
 * - Builder 1% • Leader 2% • Manager 3% • Diamond 5% • Ambassador 7%
 * - Formule : Taux membre - Taux plus haut qualifié de la branche = Différentiel payé.
 */

const STORAGE_KEY = 'ROUTINI_ONE_PLAN_STATE_V4_2026';

// Barème officiel des 6 grades Routine ONE PLAN - Version 4
const ROUTINE_GRADES = [
  {
    code: 'PARTNER',
    name: 'Partner',
    minPersonalPV: 50, // 50 PV perso min (Slide 8)
    teamPVCumul: 0,
    structure: 'Inscription + Activité personnelle (≥ 50 PV)',
    depth: 'N1 (10% CV)',
    maxDepth: 1,
    leadershipRate: 0,
    badgeClass: 'rank-partner',
    desc: '50 PV perso/mois (450 DH) • Accès Niveau 1 (10% CV)'
  },
  {
    code: 'BUILDER',
    name: 'Builder',
    minPersonalPV: 100, // 100 PV perso min (Slide 8)
    teamPVCumul: 2000, // ≥ 2 000 PV équipe cumulés (Seul grade avec seuil PV !)
    structure: '≥ 2 000 PV équipe cumulés',
    depth: 'N1 (10%) + N2 (5%)',
    maxDepth: 2,
    leadershipRate: 0.01,
    badgeClass: 'rank-builder',
    desc: '100 PV perso/mois (900 DH) • ≥ 2 000 PV équipe cumulés • Accès N1 (10%) + N2 (5%) • Leadership 1%'
  },
  {
    code: 'LEADER',
    name: 'Leader',
    minPersonalPV: 200, // 200 PV perso min (Slide 8)
    teamPVCumul: 0, // Aucun seuil PV après Builder (Slide 7)
    structure: '2 Builders actifs',
    depth: 'N1 (10%) + N2 (5%) + N3 (3%)',
    maxDepth: 3,
    leadershipRate: 0.02,
    badgeClass: 'rank-leader',
    desc: '200 PV perso/mois (1 800 DH) • 2 Builders actifs directs • Accès N1 + N2 + N3 • Leadership 2%'
  },
  {
    code: 'MANAGER',
    name: 'Manager',
    minPersonalPV: 400, // 400 PV perso min (Slide 8)
    teamPVCumul: 0, // Aucun seuil PV après Builder (Slide 7)
    structure: '2 Leaders actifs',
    depth: 'N1 + N2 + N3',
    maxDepth: 3,
    leadershipRate: 0.03,
    badgeClass: 'rank-manager',
    desc: '400 PV perso/mois (3 600 DH) • 2 Leaders actifs directs • Accès N1 + N2 + N3 • Leadership 3%'
  },
  {
    code: 'DIAMOND',
    name: 'Diamond',
    minPersonalPV: 800, // 800 PV perso min (Slide 8)
    teamPVCumul: 0, // Aucun seuil PV après Builder (Slide 7)
    structure: '2 Managers actifs',
    depth: 'N1 + N2 + N3',
    maxDepth: 3,
    leadershipRate: 0.05,
    badgeClass: 'rank-diamond',
    desc: '800 PV perso/mois (7 200 DH) • 2 Managers actifs directs • Accès N1 + N2 + N3 • Leadership 5%'
  },
  {
    code: 'AMBASSADOR',
    name: 'Ambassador',
    minPersonalPV: 1600, // 1600 PV perso min (Slide 8)
    teamPVCumul: 0, // Aucun seuil PV après Builder (Slide 7)
    structure: '2 Diamonds actifs',
    depth: 'N1 + N2 + N3',
    maxDepth: 3,
    leadershipRate: 0.07,
    badgeClass: 'rank-ambassador',
    desc: '1 600 PV perso/mois (14 400 DH) • 2 Diamonds actifs directs • Accès N1 + N2 + N3 • Leadership 7% (palier suprême)'
  }
];

// Catalogue des Soins Officiels & Packs Routines (Formules strictes V4 : PM = 90% PP, PV = PP / 10, CV = 60% PM)
const INITIAL_PRODUCTS = [
  // --- PACKS ROUTINES COSMÉTIQUES ---
  {
    id: 'PACK-000',
    name: 'Duo Rituel Éclat & Nuit (Formule Étalon ONE PLAN)',
    category: 'Packs & Rituels',
    isPack: true,
    badge: 'Étalon Officiel (Slide 3)',
    desc: 'Le pack référence du plan : Sérum Vitamine C + Crème Anti-Âge Nuit. Illustration exacte : 500 DH PP ➔ 450 DH PM ➔ 50 PV ➔ 270 DH CV.',
    icon: '💎',
    priceRP_DH: 500,
    pricePM_DH: 450,
    priceDP_DH: 450,
    priceRP_EUR: 46.50,
    pricePM_EUR: 41.85,
    priceDP_EUR: 41.85,
    pv: 50,
    sv: 270, // 60% de 450 DH PM
    marginCategory: 'Pack Étalon V4 (CV 60%)',
    stock: 80
  },
  {
    id: 'PACK-001',
    name: 'Pack Routine Glow Découverte (3 Soins + Trousse Beauté)',
    category: 'Packs & Rituels',
    isPack: true,
    badge: 'Starter Pack',
    desc: 'Rituel coup d’éclat : Sérum Vitamine C, Crème Jour SPF 30, Eau Micellaire + Trousse beauté Routini.',
    icon: '🎁',
    priceRP_DH: 1000,
    pricePM_DH: 900,
    priceDP_DH: 900,
    priceRP_EUR: 93.00,
    pricePM_EUR: 83.70,
    priceDP_EUR: 83.70,
    pv: 100,
    sv: 540, // 60% de 900 DH
    marginCategory: 'Pack Découverte (CV 60%)',
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
    priceRP_DH: 2000,
    pricePM_DH: 1800,
    priceDP_DH: 1800,
    priceRP_EUR: 186.00,
    pricePM_EUR: 167.40,
    priceDP_EUR: 167.40,
    pv: 200,
    sv: 1080, // 60% de 1800 DH
    marginCategory: 'Pack Rituel Premium (CV 60%)',
    stock: 35
  },
  {
    id: 'PACK-003',
    name: 'Pack Ambassadrice Institut Routine (Gamme Complète x2)',
    category: 'Packs & Rituels',
    isPack: true,
    badge: 'Master Pro',
    desc: 'Coffret professionnel complet comprenant l’ensemble des soins Routini en double exemplaire pour démonstrations et ateliers.',
    icon: '👑',
    priceRP_DH: 5000,
    pricePM_DH: 4500,
    priceDP_DH: 4500,
    priceRP_EUR: 465.00,
    pricePM_EUR: 418.50,
    priceDP_EUR: 418.50,
    pv: 500,
    sv: 2700, // 60% de 4500 DH
    marginCategory: 'Pack Institut Pro (CV 60%)',
    stock: 20
  },

  // --- LES 9 SOINS DE BASE ROUTINI (PP -> PM 90% -> PV PP/10 -> CV 60% PM) ---
  {
    id: 'RTN-001',
    name: 'Sérum Éclat Vitamine C & Acide Hyaluronique (30ml)',
    category: 'Soins Visage',
    isPack: false,
    badge: 'Bestseller',
    desc: 'Sérum ultra-concentré anti-oxydant, illumine le teint et repulpe la peau dès la première semaine.',
    icon: '✨',
    priceRP_DH: 350,
    pricePM_DH: 315,
    priceDP_DH: 315,
    priceRP_EUR: 32.55,
    pricePM_EUR: 29.30,
    priceDP_EUR: 29.30,
    pv: 35,
    sv: 189,
    marginCategory: 'Cosmétique Visage (CV 60%)',
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
    priceRP_DH: 420,
    pricePM_DH: 378,
    priceDP_DH: 378,
    priceRP_EUR: 39.06,
    pricePM_EUR: 35.15,
    priceDP_EUR: 35.15,
    pv: 42,
    sv: 227,
    marginCategory: 'Cosmétique Anti-Âge (CV 60%)',
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
    priceRP_DH: 300,
    pricePM_DH: 270,
    priceDP_DH: 270,
    priceRP_EUR: 27.90,
    pricePM_EUR: 25.11,
    priceDP_EUR: 25.11,
    pv: 30,
    sv: 162,
    marginCategory: 'Cosmétique Visage (CV 60%)',
    stock: 120
  },
  {
    id: 'RTN-004',
    name: 'Huile Précieuse d’Argan Bio & Rose de Damas (50ml)',
    category: 'Huiles Précieuses',
    isPack: false,
    badge: 'Trésor Maroc',
    desc: 'Élixir pur pressé à froid dans le Souss, parfumé à la rose de Kelaat M\'gouna. Nourrit visage et cheveux.',
    icon: '🌹',
    priceRP_DH: 280,
    pricePM_DH: 252,
    priceDP_DH: 252,
    priceRP_EUR: 26.04,
    pricePM_EUR: 23.44,
    priceDP_EUR: 23.44,
    pv: 28,
    sv: 151,
    marginCategory: 'Huiles Précieuses (CV 60%)',
    stock: 110
  },
  {
    id: 'RTN-005',
    name: 'Eau Micellaire Purifiante aux Fleurs d’Oranger (200ml)',
    category: 'Soins Visage',
    isPack: false,
    badge: '',
    desc: 'Démaquillant doux haute tolérance enrichi en hydrolat de fleur d’oranger et glycérine végétale.',
    icon: '🌸',
    priceRP_DH: 180,
    pricePM_DH: 162,
    priceDP_DH: 162,
    priceRP_EUR: 16.74,
    pricePM_EUR: 15.07,
    priceDP_EUR: 15.07,
    pv: 18,
    sv: 97,
    marginCategory: 'Nettoyant Doux (CV 60%)',
    stock: 180
  },
  {
    id: 'RTN-006',
    name: 'Contour des Yeux Anti-Cernes & Poches Caféine + Peptides (15ml)',
    category: 'Soins Visage',
    isPack: false,
    badge: 'Ciblé',
    desc: 'Gel frais décongestionnant, réduit instantanément l’apparence des cernes sombres et des poches.',
    icon: '👁️',
    priceRP_DH: 250,
    pricePM_DH: 225,
    priceDP_DH: 225,
    priceRP_EUR: 23.25,
    pricePM_EUR: 20.93,
    priceDP_EUR: 20.93,
    pv: 25,
    sv: 135,
    marginCategory: 'Soin Ciblé (CV 60%)',
    stock: 130
  },
  {
    id: 'RTN-007',
    name: 'Masque Purifiant Éclat à l’Argile Rose & Miel du Souss (100ml)',
    category: 'Soins Visage',
    isPack: false,
    badge: 'Détox',
    desc: 'Masque gommant ultra-doux qui affine le grain de peau, resserre les pores et réveille la luminosité.',
    icon: '🍯',
    priceRP_DH: 220,
    pricePM_DH: 198,
    priceDP_DH: 198,
    priceRP_EUR: 20.46,
    pricePM_EUR: 18.41,
    priceDP_EUR: 18.41,
    pv: 22,
    sv: 119,
    marginCategory: 'Masque Détox (CV 60%)',
    stock: 85
  },
  {
    id: 'RTN-008',
    name: 'Lait Corps Hydratant Satinant Fleur d’Oranger & Karité (250ml)',
    category: 'Soins Corps',
    isPack: false,
    badge: '',
    desc: 'Émulsion onctueuse pénétration rapide pour une peau douce, nourrie et délicatement parfumée toute la journée.',
    icon: '🧴',
    priceRP_DH: 240,
    pricePM_DH: 216,
    priceDP_DH: 216,
    priceRP_EUR: 22.32,
    pricePM_EUR: 20.09,
    priceDP_EUR: 20.09,
    pv: 24,
    sv: 130,
    marginCategory: 'Soins Corps (CV 60%)',
    stock: 150
  },
  {
    id: 'RTN-009',
    name: 'Gommage Corps Divin aux Cristaux de Sucre & Argan (200ml)',
    category: 'Soins Corps',
    isPack: false,
    badge: 'Spa Rituel',
    desc: 'Exfoliant fondant traditionnel marocain, élimine les cellules mortes et enveloppe le corps d’un voile soyeux.',
    icon: '🌿',
    priceRP_DH: 200,
    pricePM_DH: 180,
    priceDP_DH: 180,
    priceRP_EUR: 18.60,
    pricePM_EUR: 16.74,
    priceDP_EUR: 16.74,
    pv: 20,
    sv: 108,
    marginCategory: 'Soins Corps (CV 60%)',
    stock: 160
  }
];

// Membres initiaux, commandes et transactions sourcés depuis mock_data.js
const INITIAL_MEMBERS = (typeof window !== 'undefined' && window.ROUTINI_MOCK_DATA && window.ROUTINI_MOCK_DATA.members)
  ? window.ROUTINI_MOCK_DATA.members
  : [];

const INITIAL_ORDERS = (typeof window !== 'undefined' && window.ROUTINI_MOCK_DATA && window.ROUTINI_MOCK_DATA.orders)
  ? window.ROUTINI_MOCK_DATA.orders
  : [];

const INITIAL_TRANSACTIONS = (typeof window !== 'undefined' && window.ROUTINI_MOCK_DATA && window.ROUTINI_MOCK_DATA.transactions)
  ? window.ROUTINI_MOCK_DATA.transactions
  : [];

// Client Direct Démo Officiel (Sans Arbre MLM - ROUTINI ONE PLAN V4 Slide 10)
const DEFAULT_DIRECT_CLIENT = {
  id: "CLT-818101",
  code: "CLT-818101",
  name: "Salma Bennani",
  email: "salma.bennani@gmail.com",
  role: "client",
  rankCode: "CLIENT",
  rankName: "Client Privilège",
  sponsorCode: null, // STRICTEMENT SANS ARBRE NI PARRAINAGE
  sponsorName: "Routini Boutique Directe",
  password: "client123",
  phone: "+212 662 987654",
  city: "Rabat",
  address: "14 Avenue Mohammed VI, Souissi",
  country: "Maroc",
  cin: "BK720194",
  referralCode: "818101",
  referralExpiryDate: "10/05/2027",
  referredFriends: [
    { code: "CLT-920112", name: "Houda Alami", date: "15/06/2026", ordersCount: 3, pointsEarned: 110 },
    { code: "CLT-934502", name: "Yassine Mansour", date: "22/07/2026", ordersCount: 1, pointsEarned: 50 }
  ],
  joinDate: "10/05/2026",
  ppv: 0,
  teamPV: 0,
  gpv: 0,
  sv: 0,
  monthlySalesDH: 0,
  walletDH: 0.00,
  clientsCount: 0,
  fidelityPoints: 340, // 340 points (20 pts = 10 DH => 170 DH de réduction)
  active: true
};

const DEFAULT_CLIENT_ORDERS = [
  {
    id: "CMD-CLT-98421",
    orderType: "direct_client",
    memberCode: "CLT-818101",
    memberName: "Salma Bennani (Client Direct)",
    date: "04/09/2026",
    itemsCount: 2,
    totalPP: 770,
    totalDH: 770,
    totalEUR: 71.61,
    totalPV: 77,
    totalSV: 415.8,
    paymentMethod: "Carte Bancaire CMI (Maroc)",
    shippingAddress: "14 Avenue Mohammed VI, Souissi, Rabat",
    status: "Livrée",
    trackingNumber: "AMN-RBT-77291",
    deliveryCarrier: "Amana Express (Poste Maroc)",
    items: [
      { name: "Crème Anti-Âge Régénératrice Nuit (50ml)", qty: 1, price: 420 },
      { name: "Sérum Éclat Vitamine C & Huile de Figue de Barbarie (30ml)", qty: 1, price: 350 }
    ]
  },
  {
    id: "CMD-CLT-99150",
    orderType: "direct_client",
    memberCode: "CLT-818101",
    memberName: "Salma Bennani (Client Direct)",
    date: "11/09/2026",
    itemsCount: 1,
    totalPP: 500,
    totalDH: 500,
    totalEUR: 46.50,
    totalPV: 50,
    totalSV: 270,
    paymentMethod: "Paiement à la Livraison (COD)",
    shippingAddress: "14 Avenue Mohammed VI, Souissi, Rabat",
    status: "En cours d'expédition",
    trackingNumber: "AMN-RBT-88402",
    deliveryCarrier: "Amana Express (Poste Maroc)",
    items: [
      { name: "Duo Rituel Éclat & Nuit (Pack Étalon)", qty: 1, price: 500 }
    ]
  }
];

class StateManager {
  constructor() {
    this.currency = 'DH';
    this.eurRate = 0.093;
    this.currentUser = null;
    this.cart = [];
    this.orderChannel = 'attached_client'; // 'attached_client' (10% vente directe + CV réseau), 'partner_personal' (Prix Membre 90%, 0% auto-com), 'direct_client' (Prix Public 100%, 0% MLM)
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
        
        // Garantir la présence du client direct démo Salma Bennani
        if (!this.members.some(m => m.code === 'CLT-818101')) {
          this.members.push(JSON.parse(JSON.stringify(DEFAULT_DIRECT_CLIENT)));
        }
        DEFAULT_CLIENT_ORDERS.forEach(ord => {
          if (!this.orders.some(o => o.id === ord.id)) {
            this.orders.unshift(JSON.parse(JSON.stringify(ord)));
          }
        });

        // Respecter l'état de déconnexion si l'utilisateur s'est déconnecté (currentUserId === null)
        if (parsed.currentUserId === null) {
          this.currentUser = null;
        } else {
          const savedUserId = parsed.currentUserId || 'ADMIN001';
          this.currentUser = this.getMemberByCode(savedUserId) || this.members[0];
        }
      } else {
        this.resetToDefaults();
      }
      this.ensureTransactionsInitialized();
    } catch (e) {
      console.error('Erreur chargement état local Routini V4:', e);
      this.resetToDefaults();
    }
  }

  ensureTransactionsInitialized() {
    if (!this.transactions || this.transactions.length === 0) {
      this.transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
    }
    // S'assurer que les transactions existantes ont un memberCode associé
    this.transactions.forEach((tx) => {
      if (!tx.memberCode) {
        tx.memberCode = '818204921'; // Karim Benali (compte démo principal)
      }
    });

    // Transactions de démonstration ciblées pour chaque profil type
    const demoTransactions = [
      {
        memberCode: 'ADMIN001',
        date: '01/09/2026',
        ref: 'DIR-082026',
        desc: 'Clôture mensuelle CA Entreprise (Août 2026 • 185 000 PV)',
        type: 'credit',
        amount: 36000,
        status: 'Validé & Versé'
      },
      {
        memberCode: '818205114',
        date: '01/09/2026',
        ref: 'BONUS-05114-0826',
        desc: 'Commissions mensuelles Ambassador (Août 2026 • ONE PLAN V4)',
        type: 'credit',
        amount: 4890,
        status: 'Validé & Versé'
      },
      {
        memberCode: '818206330',
        date: '01/09/2026',
        ref: 'BONUS-06330-0826',
        desc: 'Commissions mensuelles Diamond 5% (Août 2026 • ONE PLAN V4)',
        type: 'credit',
        amount: 3200,
        status: 'Validé & Versé'
      },
      {
        memberCode: '818210552',
        date: '01/09/2026',
        ref: 'BONUS-10552-0826',
        desc: 'Commissions mensuelles Manager 3% (Août 2026 • ONE PLAN V4)',
        type: 'credit',
        amount: 1850,
        status: 'Validé & Versé'
      },
      {
        memberCode: '818217123',
        date: '01/09/2026',
        ref: 'BONUS-17123-0826',
        desc: 'Commissions mensuelles Leader 2% (Août 2026 • ONE PLAN V4)',
        type: 'credit',
        amount: 1200,
        status: 'Validé & Versé'
      },
      {
        memberCode: '818229345',
        date: '01/09/2026',
        ref: 'BONUS-29345-0826',
        desc: 'Commissions mensuelles Builder 1% (Août 2026 • ONE PLAN V4)',
        type: 'credit',
        amount: 650,
        status: 'Validé & Versé'
      },
      {
        memberCode: '818243789',
        date: '01/09/2026',
        ref: 'BONUS-43789-0826',
        desc: 'Commissions Niveau 1 (Août 2026 • 50 PV validés)',
        type: 'credit',
        amount: 150,
        status: 'Validé & Versé'
      }
    ];

    demoTransactions.forEach(dTx => {
      const exists = this.transactions.some(t => t.memberCode === dTx.memberCode);
      if (!exists) {
        this.transactions.push(dTx);
      }
    });
  }

  saveState() {
    try {
      const data = {
        products: this.products,
        members: this.members,
        orders: this.orders,
        transactions: this.transactions,
        currency: this.currency,
        currentUserId: this.currentUser ? this.currentUser.code : null
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erreur sauvegarde état Routini V4:', e);
    }
  }

  resetToDefaults() {
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.members = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
    if (!this.members.some(m => m.code === 'CLT-818101')) {
      this.members.push(JSON.parse(JSON.stringify(DEFAULT_DIRECT_CLIENT)));
    }
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    DEFAULT_CLIENT_ORDERS.forEach(ord => {
      if (!this.orders.some(o => o.id === ord.id)) {
        this.orders.unshift(JSON.parse(JSON.stringify(ord)));
      }
    });
    this.transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
    this.currency = 'DH';
    this.currentUser = this.members[0]; // Direction par défaut
    this.cart = [];
    this.orderChannel = 'attached_client';
    this.ensureTransactionsInitialized();
    this.saveState();
  }

  setCurrency(curr) {
    if (['DH', 'EUR'].includes(curr)) {
      this.currency = curr;
      this.saveState();
    }
  }

  formatMoney(amountDH) {
    const num = Number(amountDH) || 0;
    if (this.currency === 'EUR') {
      const eur = num * this.eurRate;
      return eur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    }
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' DH';
  }

  login(codeOrEmail, password) {
    if (!codeOrEmail) {
      return { success: false, message: 'Veuillez renseigner votre identifiant ou code partenaire/client.' };
    }

    const input = String(codeOrEmail).trim().toLowerCase();

    // 1. Détection compte Administrateur / Direction (Supporte 'admin', 'admin001' ou le code numérique '0000' / '000000')
    if (input === 'admin' || input === 'admin001' || input === '0000' || input === '000000') {
      const admin = this.members.find(m => m.role === 'owner' || m.code === 'ADMIN001');
      if (admin) {
        if (password && password !== admin.password && password !== 'admin123') {
          return { success: false, message: 'Mot de passe administrateur incorrect.' };
        }
        this.currentUser = admin;
        this.saveState();
        return { success: true, user: admin };
      }
    }

    // 2. Recherche par Code (Distributeur 818..., Client CLT-... ou chiffres seuls ex: 818101) ou par Email
    const member = this.members.find(m => 
      String(m.code).toLowerCase() === input || 
      String(m.id).toLowerCase() === input || 
      (m.referralCode && String(m.referralCode).toLowerCase() === input) ||
      ('clt-' + input) === String(m.code).toLowerCase() ||
      (m.email && m.email.toLowerCase() === input)
    );

    if (!member) {
      return { 
        success: false, 
        message: 'Identifiant ou adresse email introuvable. Veuillez vérifier vos identifiants ou créer un compte client.' 
      };
    }

    // 3. Vérification du mot de passe
    let expectedPass = member.password;
    if (!expectedPass) {
      if (member.role === 'owner') expectedPass = 'admin123';
      else if (member.role === 'client') expectedPass = 'client123';
      else expectedPass = 'routini123';
    }

    if (password && password !== expectedPass && password !== 'routini123' && password !== 'admin123' && password !== 'client123') {
      return { success: false, message: 'Mot de passe incorrect.' };
    }

    this.currentUser = member;
    this.saveState();
    return { success: true, user: member };
  }

  setCurrentUser(memberCode) {
    const found = this.getMemberByCode(memberCode);
    if (found) {
      this.currentUser = found;
      this.saveState();
      return true;
    }
    return false;
  }

  getMemberTransactions(memberCode) {
    if (!memberCode) return [];
    return (this.transactions || []).filter(tx => tx.memberCode === memberCode);
  }

  getMemberByCode(code) {
    if (!code) return null;
    return this.members.find(m => String(m.code).toLowerCase() === String(code).toLowerCase() || String(m.id).toLowerCase() === String(code).toLowerCase());
  }

  getGrade(rankCode) {
    return this.grades.find(g => g.code === rankCode) || this.grades[0];
  }

  isOwner() {
    return this.currentUser && (this.currentUser.role === 'owner' || this.currentUser.code === 'ADMIN001' || this.currentUser.id === 'ADMIN001' || String(this.currentUser.code).toLowerCase() === 'admin');
  }

  isClient() {
    return !!(this.currentUser && (this.currentUser.role === 'client' || this.currentUser.rankCode === 'CLIENT'));
  }

  // Vérification de l'activité personnelle mensuelle (Slide 8 & 15)
  // Partner: 50 PV, Builder: 100 PV, Leader: 200 PV, Manager: 400 PV, Diamond: 800 PV, Ambassador: 1600 PV
  isMemberActive(member) {
    if (!member) return false;
    if (member.role === 'owner') return true;
    const grade = this.getGrade(member.rankCode || 'PARTNER');
    const minRequired = (grade && grade.minPersonalPV) ? grade.minPersonalPV : 50;
    return (member.ppv || 0) >= minRequired;
  }

  getActivityDetails(member) {
    if (!member) return { isActive: false, ppv: 0, requiredPV: 50, rankName: 'Partner', shortfall: 50, percentage: 0 };
    if (member.role === 'owner') {
      return { isActive: true, ppv: member.ppv || 1850, requiredPV: 1600, rankName: 'Direction (Ambassador)', shortfall: 0, percentage: 100 };
    }
    const grade = this.getGrade(member.rankCode || 'PARTNER');
    const requiredPV = grade.minPersonalPV || 50;
    const ppv = member.ppv || 0;
    const isActive = ppv >= requiredPV;
    const shortfall = Math.max(0, requiredPV - ppv);
    const percentage = Math.min(100, Math.round((ppv / requiredPV) * 100));

    return {
      isActive,
      ppv,
      requiredPV,
      rankName: grade.name,
      shortfall,
      percentage,
      equivDH_PP: requiredPV * 10,
      equivDH_PM: Math.round(requiredPV * 10 * 0.90)
    };
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

    // RÈGLE STRICTE ROUTINI V4 : Un client direct n'a aucun arbre généalogique ni descendance
    if (rootMember.role === 'client' || rootMember.rankCode === 'CLIENT') {
      return null;
    }

    const node = {
      ...rootMember,
      depth: currentDepth,
      children: []
    };

    if (currentDepth < maxDepth) {
      const directs = this.getDirectDownlines(rootMember.code).filter(m => m.role !== 'client');
      node.children = directs.map(child => this.buildGenealogyTree(child.code, maxDepth, currentDepth + 1)).filter(Boolean);
    }

    return node;
  }

  /**
   * Évaluation et Promotion des Grades selon ROUTINI ONE PLAN Version 4 (Slide 7)
   * NOUVELLE RÈGLE V4 :
   * - Builder : ≥ 2 000 PV équipe cumulés (Seul grade supérieur avec seuil PV)
   * - Leader : 2 Builders actifs (directs)
   * - Manager : 2 Leaders actifs (directs)
   * - Diamond : 2 Managers actifs (directs)
   * - Ambassador : 2 Diamonds actifs (directs)
   * AUCUN seuil de PV équipe après Builder !
   */
  evaluateRankPromotion(member) {
    if (!member || member.role === 'owner') return;

    const directs = this.getDirectDownlines(member.code);

    // Fonction pour compter les branches actives ayant atteint au minimum un grade donné
    const countActiveDirectsWithRank = (targetRankCode) => {
      const rankHierarchy = ['PARTNER', 'BUILDER', 'LEADER', 'MANAGER', 'DIAMOND', 'AMBASSADOR'];
      const targetIndex = rankHierarchy.indexOf(targetRankCode);
      return directs.filter(d => {
        const dIndex = rankHierarchy.indexOf(d.rankCode || 'PARTNER');
        return dIndex >= targetIndex && this.isMemberActive(d);
      }).length;
    };

    const diamondDirects = countActiveDirectsWithRank('DIAMOND');
    const managerDirects = countActiveDirectsWithRank('MANAGER');
    const leaderDirects = countActiveDirectsWithRank('LEADER');
    const builderDirects = countActiveDirectsWithRank('BUILDER');

    const totalTeamPV = (member.teamPV || 0) + (member.ppv || 0);

    let newRank = 'PARTNER';
    let newName = 'Partner (N1 Accès)';

    if (diamondDirects >= 2) {
      newRank = 'AMBASSADOR';
      newName = 'Ambassador (7% Leadership)';
    } else if (managerDirects >= 2) {
      newRank = 'DIAMOND';
      newName = 'Diamond (5% Leadership)';
    } else if (leaderDirects >= 2) {
      newRank = 'MANAGER';
      newName = 'Manager (3% Leadership)';
    } else if (builderDirects >= 2) {
      newRank = 'LEADER';
      newName = 'Leader (2% Leadership)';
    } else if (member.teamPV >= 2000 || totalTeamPV >= 2000) {
      newRank = 'BUILDER';
      newName = 'Builder (1% Leadership)';
    } else {
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

    if (!data.cin || !data.cin.trim()) {
      return { success: false, message: 'Le numéro de CIN ou Passeport est obligatoire pour toute adhésion.' };
    }

    let newCode;
    do {
      newCode = '818' + Math.floor(100000 + Math.random() * 900000);
    } while (this.getMemberByCode(newCode));

    const kitPV = Number(data.kitPV || 0);
    const kitSV = Number(data.kitSV || (kitPV * 5.4)); // Ratio standard CV V4

    const newMember = {
      id: newCode,
      code: newCode,
      cin: data.cin.trim().toUpperCase(),
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
      monthlySalesDH: kitPV > 0 ? (kitPV * 10) : 0,
      walletDH: 0.00,
      clientsCount: kitPV > 0 ? 1 : 0,
      fidelityPoints: kitPV > 0 ? Math.floor(kitPV * 0.4) : 0,
      active: kitPV >= 50
    };

    this.members.push(newMember);

    if (kitPV > 0) {
      this.propagatePointsUpstream(sponsor.code, kitPV, kitSV);
    }

    this.saveState();
    return { success: true, member: newMember };
  }

  registerDirectClient(data) {
    const nameVal = data ? (data.fullName || data.name || '').trim() : '';
    if (!data || !nameVal || !data.email) {
      return { success: false, message: 'Veuillez renseigner votre nom complet et votre adresse email.' };
    }

    if (!data.cin || !data.cin.trim()) {
      return { success: false, message: 'Le numéro de CIN ou pièce d\'identité est obligatoire pour l\'inscription.' };
    }

    const emailTrimmed = String(data.email).trim().toLowerCase();
    const existing = this.members.find(m => m.email && m.email.toLowerCase() === emailTrimmed);
    if (existing) {
      return { 
        success: false, 
        message: 'Un compte existe déjà avec cette adresse email. Veuillez vous connecter avec votre mot de passe.' 
      };
    }

    let newCode;
    do {
      newCode = 'CLT-' + Math.floor(100000 + Math.random() * 900000);
    } while (this.getMemberByCode(newCode));

    const numericReferral = newCode.replace('CLT-', '');
    const joinDate = new Date().toLocaleDateString('fr-FR');
    // Échéance de parrainage à 12 mois (Slide / Demande Marketing Good)
    const expiry = new Date(Date.now() + 365 * 24 * 3600 * 1000);
    const referralExpiryDate = expiry.toLocaleDateString('fr-FR');

    const clientName = (data.fullName || data.name || 'Client Privilège').trim();
    const newClient = {
      id: newCode,
      code: newCode,
      cin: data.cin.trim().toUpperCase(),
      name: clientName,
      email: emailTrimmed,
      role: 'client',
      rankCode: 'CLIENT',
      rankName: 'Client Privilège',
      sponsorCode: null, // STRICTEMENT SANS ARBRE MLM
      sponsorName: 'Routini Boutique Directe',
      password: data.password || 'client123',
      phone: data.phone || '',
      city: data.city || 'Casablanca',
      address: data.address || '',
      country: data.country || 'Maroc',
      joinDate: joinDate,
      referralCode: numericReferral,
      referralExpiryDate: referralExpiryDate,
      referredFriends: [],
      ppv: 0,
      teamPV: 0,
      gpv: 0,
      sv: 0,
      monthlySalesDH: 0,
      walletDH: 0.00,
      clientsCount: 0,
      fidelityPoints: 50, // Cadeau d'accueil de bienvenue : +50 points fidélité offerts !
      active: true
    };

    // Gestion du parrainage entre clients directs (12 mois de validité)
    if (data.referredBy) {
      const refClean = String(data.referredBy).trim();
      const referrer = this.members.find(m => 
        (m.referralCode && m.referralCode === refClean) || 
        m.code === refClean || 
        m.code === ('CLT-' + refClean)
      );
      if (referrer) {
        newClient.referredBy = referrer.code;
        referrer.fidelityPoints = (referrer.fidelityPoints || 0) + 50; // Bonus parrainage ami
        referrer.referredFriends = referrer.referredFriends || [];
        referrer.referredFriends.unshift({
          code: newCode,
          name: newClient.name,
          cin: newClient.cin,
          date: joinDate,
          ordersCount: 0,
          pointsEarned: 50
        });
      }
    }

    this.members.push(newClient);
    this.currentUser = newClient;
    this.saveState();

    return { 
      success: true, 
      client: newClient,
      message: `Félicitations ${newClient.name} ! Votre compte Client Privilège a été créé avec le code ${newCode} (CIN: ${newClient.cin}) (+50 points fidélité offerts).` 
    };
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

  // --- PANIER & COMMANDE CONFORME ROUTINI ONE PLAN V4 (Slide 2, 3, 10, 15) ---
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
    let totalPP = 0; // Prix Public
    let totalPM = 0; // Prix Membre payé (90% du PP)
    let totalPV = 0; // Points PV (PP / 10)
    let totalSV = 0; // Commission Value CV (60% du PM)
    let totalItems = 0;

    for (const item of this.cart) {
      const p = item.product;
      const qty = item.quantity;
      const pp = p.priceRP_DH || (p.pricePM_DH ? Math.round(p.pricePM_DH / 0.90) : 500);
      const pm = p.pricePM_DH || p.priceDP_DH || Math.round(pp * 0.90);
      const pv = p.pv || Math.round(pp / 10);
      const sv = p.sv || Math.round(pm * 0.60);

      totalPP += pp * qty;
      totalPM += pm * qty;
      totalPV += pv * qty;
      totalSV += sv * qty;
      totalItems += qty;
    }

    const isDirectClient = (this.orderChannel === 'direct_client');

    // Remise 10% systématique pour le Client Direct (Demande Marketing Good)
    const clientDiscountDH = isDirectClient ? Math.round(totalPP * 0.10) : 0;

    // Pas de livraison offerte pour tout le monde (Frais fixes Amana Express 35 DH)
    const shippingFee = totalItems > 0 ? 35 : 0;

    // Montant de base hors livraison
    let baseDH = totalPM;
    if (isDirectClient) {
      baseDH = totalPP - clientDiscountDH; // Prix Public avec 10% de réduction
    } else if (this.orderChannel === 'attached_client') {
      baseDH = totalPP; // Client Rattaché paye Prix Public, et le Partner touche 10% cash
    } else {
      baseDH = totalPM; // Achat Perso Partenaire paye Prix Membre (90% PP)
    }

    // Total net à régler incluant les frais de livraison
    const totalDH = baseDH + shippingFee;

    // Même rapport entre points fidélité et prix qu'une personne parrainée (1 pt = 10 DH PP)
    const fidelityPoints = Math.floor(totalPP / 10);
    const totalEUR = totalDH * this.eurRate;

    // Diagnostic de solidité financière (Slide 15 & 16)
    const maxTheoreticalPayoutDH = totalSV * (0.10 + 0.05 + 0.03 + 0.07);
    const payoutRatioPercent = totalDH > 0 ? ((maxTheoreticalPayoutDH / totalDH) * 100).toFixed(1) : 0;

    return {
      totalPP,
      totalPM,
      clientDiscountDH,
      shippingFee,
      baseDH,
      totalDH,
      totalEUR,
      totalPV,
      totalSV,
      totalItems,
      fidelityPoints,
      maxTheoreticalPayoutDH,
      payoutRatioPercent
    };
  }

  checkoutCart(paymentMethod = 'E-Point', orderChannel = 'attached_client') {
    if (this.cart.length === 0) return { success: false, message: 'Le panier est vide.' };

    const buyer = this.currentUser;
    const isClientUser = buyer && (buyer.role === 'client' || buyer.rankCode === 'CLIENT');
    const effectiveChannel = isClientUser ? 'direct_client' : orderChannel;

    this.orderChannel = effectiveChannel;
    const totals = this.getCartTotals();

    // Méthode de paiement E-Point réservée aux distributeurs ayant un solde suffisant
    if (paymentMethod === 'E-Point') {
      if (buyer.walletDH < totals.totalDH) {
        return {
          success: false,
          message: `Solde E-Point insuffisant (${totals.totalDH.toFixed(2)} DH requis, solde actuel: ${buyer.walletDH.toFixed(2)} DH).`
        };
      }
      buyer.walletDH -= totals.totalDH;
    }

    // Capture des articles du panier
    const cartItems = this.cart.map(item => ({
      id: item.product.id,
      name: item.product.name,
      qty: item.quantity,
      unitPrice: effectiveChannel === 'partner_personal' ? (item.product.pricePM_DH || Math.round(item.product.priceRP_DH * 0.9)) : (item.product.priceRP_DH || 500),
      totalPrice: (effectiveChannel === 'partner_personal' ? (item.product.pricePM_DH || Math.round(item.product.priceRP_DH * 0.9)) : (item.product.priceRP_DH || 500)) * item.quantity,
      pv: item.product.pv || Math.round((item.product.priceRP_DH || 500) / 10)
    }));

    buyer.ppv = (buyer.ppv || 0) + totals.totalPV;
    buyer.fidelityPoints = (buyer.fidelityPoints || 0) + totals.fidelityPoints;
    buyer.gpv = (buyer.gpv || 0) + totals.totalPV;

    const orderId = isClientUser ? 'CMD-CLT-' + Math.floor(10000 + Math.random() * 90000) : 'CMD-RTN-' + Math.floor(10000 + Math.random() * 90000);
    const invoiceNum = 'FAC-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);

    if (effectiveChannel === 'attached_client') {
      buyer.monthlySalesDH = (buyer.monthlySalesDH || 0) + totals.totalDH;
      buyer.clientsCount = (buyer.clientsCount || 0) + 1;
      // Vendeur reçoit sa commission vente directe (10% du CA PP)
      const directBonusDH = Math.round(totals.totalPP * 0.10);
      buyer.walletDH = (buyer.walletDH || 0) + directBonusDH;

      this.transactions.unshift({
        memberCode: buyer.code,
        date: new Date().toLocaleDateString('fr-FR'),
        ref: 'COM-DIR-' + Math.floor(1000 + Math.random() * 9000),
        desc: `Commission directe 10% vente client rattaché (${orderId})`,
        type: 'credit',
        amount: directBonusDH,
        status: 'Validé & Versé'
      });

      if (buyer.sponsorCode) {
        this.propagatePointsUpstream(buyer.sponsorCode, totals.totalPV, totals.totalSV);
      }
    } else if (effectiveChannel === 'partner_personal') {
      if (buyer.sponsorCode) {
        this.propagatePointsUpstream(buyer.sponsorCode, totals.totalPV, totals.totalSV);
      }
    }

    if (paymentMethod === 'E-Point') {
      this.transactions.unshift({
        memberCode: buyer.code,
        date: new Date().toLocaleDateString('fr-FR'),
        ref: 'ACHAT-' + Math.floor(1000 + Math.random() * 9000),
        desc: `Règlement commande ${orderId} en E-Point`,
        type: 'debit',
        amount: totals.totalDH,
        status: 'Validé & Débité'
      });
    }

    if (!isClientUser) {
      this.evaluateRankPromotion(buyer);
    }

    const isDirectClient = (effectiveChannel === 'direct_client' || isClientUser);
    const newOrder = {
      id: orderId,
      invoiceNumber: invoiceNum,
      orderType: isDirectClient ? 'direct_client' : effectiveChannel,
      memberCode: buyer.code,
      memberName: buyer.name,
      customerCin: buyer.cin || 'BK' + Math.floor(100000 + Math.random() * 900000),
      customerPhone: buyer.phone || '+212 661 000000',
      date: new Date().toLocaleDateString('fr-FR'),
      itemsCount: totals.totalItems,
      totalPP: totals.totalPP,
      clientDiscountDH: totals.clientDiscountDH,
      shippingFee: totals.shippingFee,
      baseDH: totals.baseDH,
      totalDH: totals.totalDH,
      totalEUR: totals.totalEUR,
      totalPV: totals.totalPV,
      totalSV: totals.totalSV,
      fidelityPoints: totals.fidelityPoints,
      paymentMethod: paymentMethod,
      shippingAddress: buyer.address ? `${buyer.address}, ${buyer.city}` : `${buyer.city || 'Maroc'}`,
      trackingNumber: isDirectClient ? 'AMN-CAS-' + Math.floor(10000 + Math.random() * 90000) : undefined,
      deliveryCarrier: 'Amana Express (Poste Maroc)',
      status: isDirectClient ? 'En cours de préparation' : 'Validée & Expédiée',
      items: cartItems
    };

    this.orders.unshift(newOrder);
    this.clearCart();
    this.saveState();

    return { success: true, order: newOrder };
  }

  // --- GESTION ADMIN DES PRODUITS AVEC FORMULES V4 EN TEMPS RÉEL (Slide 3) ---
  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  addProduct(newProd) {
    const isPack = Boolean(newProd.isPack || newProd.category === 'Packs & Rituels');
    const prefix = isPack ? 'PACK-' : 'RTN-';
    const id = prefix + String(this.products.length + 1).padStart(3, '0');

    const priceRP = Number(newProd.priceRP_DH) || 500;
    const pricePM = Number(newProd.pricePM_DH) || Math.round(priceRP * 0.90); // 90% PP
    const pv = Number(newProd.pv) || Math.round(priceRP / 10); // PP / 10
    const sv = Number(newProd.sv) || Math.round(pricePM * 0.60); // 60% PM

    const product = {
      id,
      name: newProd.name.trim(),
      category: newProd.category || (isPack ? 'Packs & Rituels' : 'Soins Visage'),
      isPack: isPack,
      isPromo: Boolean(newProd.isPromo),
      promoBadge: newProd.promoBadge ? newProd.promoBadge.trim() : (newProd.isPromo ? 'PROMO' : ''),
      originalPriceRP: Number(newProd.originalPriceRP) || (newProd.isPromo ? Math.round(priceRP * 1.25) : priceRP),
      includedProducts: newProd.includedProducts || [],
      badge: newProd.badge || (newProd.isPromo ? (newProd.promoBadge || 'PROMO') : (isPack ? 'Pack Spécial' : 'Nouveau')),
      desc: newProd.desc ? newProd.desc.trim() : '',
      icon: newProd.icon || (isPack ? '🎁' : '✨'),
      priceRP_DH: priceRP,
      pricePM_DH: pricePM,
      priceDP_DH: pricePM,
      priceRP_EUR: Number((priceRP * this.eurRate).toFixed(2)),
      pricePM_EUR: Number((pricePM * this.eurRate).toFixed(2)),
      priceDP_EUR: Number((pricePM * this.eurRate).toFixed(2)),
      pv: pv,
      sv: sv,
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
    const priceRP = updatedData.priceRP_DH !== undefined ? Number(updatedData.priceRP_DH) : prod.priceRP_DH;
    const pricePM = updatedData.pricePM_DH !== undefined ? Number(updatedData.pricePM_DH) : (prod.pricePM_DH || Math.round(priceRP * 0.90));
    const pv = updatedData.pv !== undefined ? Number(updatedData.pv) : Math.round(priceRP / 10);
    const sv = updatedData.sv !== undefined ? Number(updatedData.sv) : Math.round(pricePM * 0.60);

    prod.name = updatedData.name !== undefined ? updatedData.name.trim() : prod.name;
    prod.category = updatedData.category || prod.category;
    prod.isPack = updatedData.isPack !== undefined ? Boolean(updatedData.isPack) : (prod.category === 'Packs & Rituels');
    prod.isPromo = updatedData.isPromo !== undefined ? Boolean(updatedData.isPromo) : prod.isPromo;
    prod.promoBadge = updatedData.promoBadge !== undefined ? updatedData.promoBadge.trim() : prod.promoBadge;
    prod.originalPriceRP = updatedData.originalPriceRP !== undefined ? Number(updatedData.originalPriceRP) : prod.originalPriceRP;
    if (updatedData.includedProducts) prod.includedProducts = updatedData.includedProducts;
    prod.badge = updatedData.badge !== undefined ? updatedData.badge.trim() : prod.badge;
    prod.desc = updatedData.desc !== undefined ? updatedData.desc.trim() : prod.desc;
    prod.icon = updatedData.icon || prod.icon;
    prod.priceRP_DH = priceRP;
    prod.pricePM_DH = pricePM;
    prod.priceDP_DH = pricePM;
    prod.priceRP_EUR = Number((priceRP * this.eurRate).toFixed(2));
    prod.pricePM_EUR = Number((pricePM * this.eurRate).toFixed(2));
    prod.priceDP_EUR = Number((pricePM * this.eurRate).toFixed(2));
    prod.pv = pv;
    prod.sv = sv;
    prod.marginCategory = updatedData.marginCategory || prod.marginCategory;
    prod.stock = updatedData.stock !== undefined ? Number(updatedData.stock) : prod.stock;

    this.saveState();
    return { success: true, product: prod };
  }

  duplicateProduct(id) {
    const prod = this.getProductById(id);
    if (!prod) return { success: false, message: 'Produit introuvable.' };

    const prefix = prod.isPack ? 'PACK-' : 'RTN-';
    const newId = prefix + String(this.products.length + 1).padStart(3, '0') + '-C';
    const clone = JSON.parse(JSON.stringify(prod));
    clone.id = newId;
    clone.name = prod.name + ' (Copie)';
    if (clone.badge) clone.badge = clone.badge + ' (Copie)';

    this.products.unshift(clone);
    this.saveState();
    return { success: true, product: clone };
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
