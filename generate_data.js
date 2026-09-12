const fs = require('fs');
const path = require('path');

// ROUTINI ONE PLAN - Version 4 (Septembre 2026)
// 51 Membres Réseau Maroc + 135 Commandes (Mars 2026 - Septembre 2026)
// Formules officielles V4 :
// 1. Prix Membre (PM) = 90% x PP
// 2. Points PV = PP / 10 (1 PV = 10 DH PP)
// 3. Commission Value (CV) = 60% x PM
// 4. Progression après Builder : 100% structurelle (2 actifs du grade précédent), AUCUN seuil PV équipe après Builder !
// 5. Activité perso mensuelle : Partner 50 PV, Builder 100 PV, Leader 200 PV, Manager 400 PV, Diamond 800 PV, Ambassador 1600 PV.

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Mohammedia', 'El Jadida', 'Nador', 'Safi', 'Essaouira'];

const MEMBERS_RAW = [
  // 1. Fondateur & Direction
  {
    id: 'ADMIN001', code: 'ADMIN001', name: 'Direction Générale Routini (Fondateur)',
    email: 'direction@routini-cosmetics.com', role: 'owner', rankCode: 'AMBASSADOR',
    rankName: 'Ambassador (7% Leadership)', sponsorCode: null, sponsorName: 'Siège Routini Cosmétiques',
    password: 'admin123', phone: '+212 522 888999', city: 'Casablanca', country: 'Maroc',
    joinDate: '01/01/2023', ppv: 1850, teamPV: 185000, gpv: 186850, sv: 128000,
    monthlySalesDH: 36000, walletDH: 245800.00, clientsCount: 22, fidelityPoints: 680, active: true
  },
  // 2 Ambassadeurs (Seuil perso >= 1600 PV, 2 Diamonds actifs)
  {
    id: '818204921', code: '818204921', name: 'Karim Benali',
    email: 'karim.benali@routini-ambassador.com', role: 'distributor', rankCode: 'AMBASSADOR',
    rankName: 'Ambassador (7% Leadership)', sponsorCode: 'ADMIN001', sponsorName: 'Direction Générale Routini',
    password: 'routini123', phone: '+212 661 123456', city: 'Casablanca', country: 'Maroc',
    joinDate: '15/01/2023', ppv: 1650, teamPV: 124000, gpv: 125650, sv: 86000,
    monthlySalesDH: 24000, walletDH: 54200.00, clientsCount: 16, fidelityPoints: 490, active: true
  },
  {
    id: '818205114', code: '818205114', name: 'Fatima-Zahra El Amrani',
    email: 'fz.elamrani@routini-ambassador.com', role: 'distributor', rankCode: 'AMBASSADOR',
    rankName: 'Ambassador (7% Leadership)', sponsorCode: '818204921', sponsorName: 'Karim Benali',
    password: 'routini123', phone: '+212 662 987654', city: 'Rabat', country: 'Maroc',
    joinDate: '02/06/2023', ppv: 1620, teamPV: 108000, gpv: 109620, sv: 74000,
    monthlySalesDH: 21500, walletDH: 48900.00, clientsCount: 14, fidelityPoints: 410, active: true
  },
  // 4 Diamants (Seuil perso >= 800 PV, 2 Managers actifs)
  {
    id: '818206330', code: '818206330', name: 'Mehdi Alami',
    email: 'mehdi.alami@routini-ambassador.com', role: 'distributor', rankCode: 'DIAMOND',
    rankName: 'Diamond (5% Leadership)', sponsorCode: '818204921', sponsorName: 'Karim Benali',
    password: 'routini123', phone: '+212 663 456789', city: 'Marrakech', country: 'Maroc',
    joinDate: '10/09/2023', ppv: 850, teamPV: 46000, gpv: 46850, sv: 32000,
    monthlySalesDH: 14000, walletDH: 28400.00, clientsCount: 11, fidelityPoints: 320, active: true
  },
  {
    id: '818207890', code: '818207890', name: 'Amina Tazi',
    email: 'amina.tazi@routini-ambassador.com', role: 'distributor', rankCode: 'DIAMOND',
    rankName: 'Diamond (5% Leadership)', sponsorCode: '818205114', sponsorName: 'Fatima-Zahra El Amrani',
    password: 'routini123', phone: '+212 664 112233', city: 'Fès', country: 'Maroc',
    joinDate: '14/11/2023', ppv: 830, teamPV: 39500, gpv: 40330, sv: 27500,
    monthlySalesDH: 12500, walletDH: 22100.00, clientsCount: 10, fidelityPoints: 290, active: true
  },
  {
    id: '818208455', code: '818208455', name: 'Omar El Fassi',
    email: 'omar.elfassi@routini-ambassador.com', role: 'distributor', rankCode: 'DIAMOND',
    rankName: 'Diamond (5% Leadership)', sponsorCode: '818204921', sponsorName: 'Karim Benali',
    password: 'routini123', phone: '+212 665 223344', city: 'Casablanca', country: 'Maroc',
    joinDate: '10/01/2024', ppv: 820, teamPV: 34800, gpv: 35620, sv: 24200,
    monthlySalesDH: 11800, walletDH: 19800.00, clientsCount: 9, fidelityPoints: 260, active: true
  },
  {
    id: '818209441', code: '818209441', name: 'Youssef Mansouri',
    email: 'youssef.mansouri@routini-ambassador.com', role: 'distributor', rankCode: 'DIAMOND',
    rankName: 'Diamond (5% Leadership)', sponsorCode: '818207890', sponsorName: 'Amina Tazi',
    password: 'routini123', phone: '+212 665 778899', city: 'Tanger', country: 'Maroc',
    joinDate: '05/02/2024', ppv: 810, teamPV: 31200, gpv: 32010, sv: 21800,
    monthlySalesDH: 11200, walletDH: 17600.00, clientsCount: 9, fidelityPoints: 240, active: true
  },
  // 7 Managers (Seuil perso >= 400 PV, 2 Leaders actifs)
  {
    id: '818210552', code: '818210552', name: 'Nadia Berrada',
    email: 'nadia.berrada@routini-ambassador.com', role: 'distributor', rankCode: 'MANAGER',
    rankName: 'Manager (3% Leadership)', sponsorCode: '818206330', sponsorName: 'Mehdi Alami',
    password: 'routini123', phone: '+212 666 334455', city: 'Agadir', country: 'Maroc',
    joinDate: '18/04/2024', ppv: 430, teamPV: 16800, gpv: 17230, sv: 12400,
    monthlySalesDH: 9400, walletDH: 14200.00, clientsCount: 8, fidelityPoints: 210, active: true
  },
  {
    id: '818211234', code: '818211234', name: 'Tariq Idrissi',
    email: 'tariq.idrissi@routini-ambassador.com', role: 'distributor', rankCode: 'MANAGER',
    rankName: 'Manager (3% Leadership)', sponsorCode: '818205114', sponsorName: 'Fatima-Zahra El Amrani',
    password: 'routini123', phone: '+212 667 445566', city: 'Rabat', country: 'Maroc',
    joinDate: '01/05/2024', ppv: 425, teamPV: 15400, gpv: 15825, sv: 11200,
    monthlySalesDH: 8900, walletDH: 12900.00, clientsCount: 8, fidelityPoints: 195, active: true
  },
  {
    id: '818212456', code: '818212456', name: 'Salma Chraibi',
    email: 'salma.chraibi@routini-ambassador.com', role: 'distributor', rankCode: 'MANAGER',
    rankName: 'Manager (3% Leadership)', sponsorCode: '818208455', sponsorName: 'Omar El Fassi',
    password: 'routini123', phone: '+212 668 556677', city: 'Casablanca', country: 'Maroc',
    joinDate: '12/06/2024', ppv: 420, teamPV: 14200, gpv: 14620, sv: 10400,
    monthlySalesDH: 8500, walletDH: 11800.00, clientsCount: 7, fidelityPoints: 180, active: true
  },
  {
    id: '818213789', code: '818213789', name: 'Meriem Benjelloun',
    email: 'meriem.benjelloun@routini-ambassador.com', role: 'distributor', rankCode: 'MANAGER',
    rankName: 'Manager (3% Leadership)', sponsorCode: '818207890', sponsorName: 'Amina Tazi',
    password: 'routini123', phone: '+212 669 667788', city: 'Fès', country: 'Maroc',
    joinDate: '20/07/2024', ppv: 415, teamPV: 13500, gpv: 13915, sv: 9800,
    monthlySalesDH: 8200, walletDH: 10600.00, clientsCount: 7, fidelityPoints: 170, active: true
  },
  {
    id: '818214890', code: '818214890', name: 'Bilal Benchekroun',
    email: 'bilal.benchekroun@routini-ambassador.com', role: 'distributor', rankCode: 'MANAGER',
    rankName: 'Manager (3% Leadership)', sponsorCode: '818206330', sponsorName: 'Mehdi Alami',
    password: 'routini123', phone: '+212 660 778899', city: 'Marrakech', country: 'Maroc',
    joinDate: '15/08/2024', ppv: 410, teamPV: 12800, gpv: 13210, sv: 9200,
    monthlySalesDH: 7900, walletDH: 9800.00, clientsCount: 7, fidelityPoints: 160, active: true
  },
  {
    id: '818215901', code: '818215901', name: 'Kenza Bennani',
    email: 'kenza.bennani@routini-ambassador.com', role: 'distributor', rankCode: 'MANAGER',
    rankName: 'Manager (3% Leadership)', sponsorCode: '818209441', sponsorName: 'Youssef Mansouri',
    password: 'routini123', phone: '+212 661 889900', city: 'Tanger', country: 'Maroc',
    joinDate: '01/09/2024', ppv: 410, teamPV: 11900, gpv: 12310, sv: 8600,
    monthlySalesDH: 7400, walletDH: 9100.00, clientsCount: 6, fidelityPoints: 150, active: true
  },
  {
    id: '818216012', code: '818216012', name: 'Hicham Naciri',
    email: 'hicham.naciri@routini-ambassador.com', role: 'distributor', rankCode: 'MANAGER',
    rankName: 'Manager (3% Leadership)', sponsorCode: '818210552', sponsorName: 'Nadia Berrada',
    password: 'routini123', phone: '+212 662 113355', city: 'Agadir', country: 'Maroc',
    joinDate: '10/10/2024', ppv: 405, teamPV: 10600, gpv: 11005, sv: 7900,
    monthlySalesDH: 7100, walletDH: 8500.00, clientsCount: 6, fidelityPoints: 140, active: true
  },
  // 12 Leaders (Seuil perso >= 200 PV, 2 Builders actifs)
  {
    id: '818217123', code: '818217123', name: 'Siham Bouazza',
    email: 'siham.bouazza@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818207890', sponsorName: 'Amina Tazi',
    password: 'routini123', phone: '+212 663 224466', city: 'Oujda', country: 'Maroc',
    joinDate: '05/11/2024', ppv: 240, teamPV: 6800, gpv: 7040, sv: 5400,
    monthlySalesDH: 6200, walletDH: 6700.00, clientsCount: 6, fidelityPoints: 130, active: true
  },
  {
    id: '818218234', code: '818218234', name: 'Reda Kabbaj',
    email: 'reda.kabbaj@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818204921', sponsorName: 'Karim Benali',
    password: 'routini123', phone: '+212 664 335577', city: 'Casablanca', country: 'Maroc',
    joinDate: '12/12/2024', ppv: 230, teamPV: 5900, gpv: 6130, sv: 4800,
    monthlySalesDH: 5800, walletDH: 5900.00, clientsCount: 6, fidelityPoints: 125, active: true
  },
  {
    id: '818219345', code: '818219345', name: 'Houda Daoudi',
    email: 'houda.daoudi@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818205114', sponsorName: 'Fatima-Zahra El Amrani',
    password: 'routini123', phone: '+212 665 446688', city: 'Rabat', country: 'Maroc',
    joinDate: '15/01/2025', ppv: 225, teamPV: 5400, gpv: 5625, sv: 4400,
    monthlySalesDH: 5400, walletDH: 5200.00, clientsCount: 5, fidelityPoints: 115, active: true
  },
  {
    id: '818220456', code: '818220456', name: 'Amine Touzani',
    email: 'amine.touzani@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818207890', sponsorName: 'Amina Tazi',
    password: 'routini123', phone: '+212 666 557799', city: 'Meknès', country: 'Maroc',
    joinDate: '02/02/2025', ppv: 220, teamPV: 4800, gpv: 5020, sv: 3900,
    monthlySalesDH: 5100, walletDH: 4700.00, clientsCount: 5, fidelityPoints: 110, active: true
  },
  {
    id: '818221567', code: '818221567', name: 'Zineb Filali',
    email: 'zineb.filali@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818213789', sponsorName: 'Meriem Benjelloun',
    password: 'routini123', phone: '+212 667 668800', city: 'Fès', country: 'Maroc',
    joinDate: '20/02/2025', ppv: 215, teamPV: 4400, gpv: 4615, sv: 3600,
    monthlySalesDH: 4800, walletDH: 4300.00, clientsCount: 5, fidelityPoints: 105, active: true
  },
  {
    id: '818222678', code: '818222678', name: 'Hamza Slaoui',
    email: 'hamza.slaoui@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818212456', sponsorName: 'Salma Chraibi',
    password: 'routini123', phone: '+212 668 779911', city: 'Casablanca', country: 'Maroc',
    joinDate: '05/03/2025', ppv: 215, teamPV: 4100, gpv: 4315, sv: 3300,
    monthlySalesDH: 4500, walletDH: 3900.00, clientsCount: 5, fidelityPoints: 95, active: true
  },
  {
    id: '818223789', code: '818223789', name: 'Asmaa Chaoui',
    email: 'asmaa.chaoui@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818214890', sponsorName: 'Bilal Benchekroun',
    password: 'routini123', phone: '+212 669 880022', city: 'Marrakech', country: 'Maroc',
    joinDate: '18/03/2025', ppv: 210, teamPV: 3800, gpv: 4010, sv: 3100,
    monthlySalesDH: 4200, walletDH: 3600.00, clientsCount: 5, fidelityPoints: 90, active: true
  },
  {
    id: '818224890', code: '818224890', name: 'Soufiane Berrada',
    email: 'soufiane.berrada@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818215901', sponsorName: 'Kenza Bennani',
    password: 'routini123', phone: '+212 660 991133', city: 'Tanger', country: 'Maroc',
    joinDate: '01/04/2025', ppv: 210, teamPV: 3500, gpv: 3710, sv: 2800,
    monthlySalesDH: 3900, walletDH: 3300.00, clientsCount: 5, fidelityPoints: 85, active: true
  },
  {
    id: '818225901', code: '818225901', name: 'Leila Lahlou',
    email: 'leila.lahlou@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818211234', sponsorName: 'Tariq Idrissi',
    password: 'routini123', phone: '+212 661 002244', city: 'Rabat', country: 'Maroc',
    joinDate: '14/04/2025', ppv: 205, teamPV: 3200, gpv: 3405, sv: 2600,
    monthlySalesDH: 3700, walletDH: 3100.00, clientsCount: 5, fidelityPoints: 80, active: true
  },
  {
    id: '818226012', code: '818226012', name: 'Younes Tahiri',
    email: 'younes.tahiri@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818209441', sponsorName: 'Youssef Mansouri',
    password: 'routini123', phone: '+212 662 113355', city: 'Tétouan', country: 'Maroc',
    joinDate: '02/05/2025', ppv: 205, teamPV: 2950, gpv: 3155, sv: 2400,
    monthlySalesDH: 3500, walletDH: 2900.00, clientsCount: 5, fidelityPoints: 75, active: true
  },
  {
    id: '818227123', code: '818227123', name: 'Sara El Amrani',
    email: 'sara.elamrani@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818208455', sponsorName: 'Omar El Fassi',
    password: 'routini123', phone: '+212 663 224466', city: 'Casablanca', country: 'Maroc',
    joinDate: '15/05/2025', ppv: 200, teamPV: 2750, gpv: 2950, sv: 2200,
    monthlySalesDH: 3300, walletDH: 2700.00, clientsCount: 5, fidelityPoints: 70, active: true
  },
  {
    id: '818228234', code: '818228234', name: 'Mustapha Chraibi',
    email: 'mustapha.chraibi@routini-ambassador.com', role: 'distributor', rankCode: 'LEADER',
    rankName: 'Leader (2% Leadership)', sponsorCode: '818216012', sponsorName: 'Hicham Naciri',
    password: 'routini123', phone: '+212 664 335577', city: 'Agadir', country: 'Maroc',
    joinDate: '01/06/2025', ppv: 200, teamPV: 2600, gpv: 2800, sv: 2100,
    monthlySalesDH: 3100, walletDH: 2500.00, clientsCount: 5, fidelityPoints: 65, active: true
  },
  // 14 Builders (Seuil perso >= 100 PV, >= 2000 PV équipe cumulés - Slide 7)
  {
    id: '818229345', code: '818229345', name: 'Ibtissam Kadiri',
    email: 'ibtissam.kadiri@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818205114', sponsorName: 'Fatima-Zahra El Amrani',
    password: 'routini123', phone: '+212 665 446688', city: 'Kénitra', country: 'Maroc',
    joinDate: '18/06/2025', ppv: 140, teamPV: 2450, gpv: 2590, sv: 1550,
    monthlySalesDH: 2800, walletDH: 2100.00, clientsCount: 5, fidelityPoints: 60, active: true
  },
  {
    id: '818230456', code: '818230456', name: 'Nabil Zerouali',
    email: 'nabil.zerouali@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818217123', sponsorName: 'Siham Bouazza',
    password: 'routini123', phone: '+212 666 557799', city: 'Oujda', country: 'Maroc',
    joinDate: '05/07/2025', ppv: 135, teamPV: 2380, gpv: 2515, sv: 1380,
    monthlySalesDH: 2600, walletDH: 1950.00, clientsCount: 5, fidelityPoints: 55, active: true
  },
  {
    id: '818231567', code: '818231567', name: 'Ghita Mansour',
    email: 'ghita.mansour@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818218234', sponsorName: 'Reda Kabbaj',
    password: 'routini123', phone: '+212 667 668800', city: 'Mohammedia', country: 'Maroc',
    joinDate: '20/07/2025', ppv: 130, teamPV: 2320, gpv: 2450, sv: 1250,
    monthlySalesDH: 2400, walletDH: 1800.00, clientsCount: 5, fidelityPoints: 50, active: true
  },
  {
    id: '818232678', code: '818232678', name: 'Othmane Skalli',
    email: 'othmane.skalli@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818207890', sponsorName: 'Amina Tazi',
    password: 'routini123', phone: '+212 668 779911', city: 'Fès', country: 'Maroc',
    joinDate: '08/08/2025', ppv: 130, teamPV: 2280, gpv: 2410, sv: 1150,
    monthlySalesDH: 2250, walletDH: 1650.00, clientsCount: 5, fidelityPoints: 45, active: true
  },
  {
    id: '818233789', code: '818233789', name: 'Mouna Bennis',
    email: 'mouna.bennis@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818204921', sponsorName: 'Karim Benali',
    password: 'routini123', phone: '+212 669 880022', city: 'Casablanca', country: 'Maroc',
    joinDate: '25/08/2025', ppv: 125, teamPV: 2210, gpv: 2335, sv: 1050,
    monthlySalesDH: 2100, walletDH: 1500.00, clientsCount: 5, fidelityPoints: 40, active: true
  },
  {
    id: '818234890', code: '818234890', name: 'Walid Senhaji',
    email: 'walid.senhaji@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818222678', sponsorName: 'Hamza Slaoui',
    password: 'routini123', phone: '+212 660 112233', city: 'Casablanca', country: 'Maroc',
    joinDate: '10/03/2026', ppv: 125, teamPV: 2180, gpv: 2305, sv: 890,
    monthlySalesDH: 2300, walletDH: 1350.00, clientsCount: 5, fidelityPoints: 45, active: true
  },
  {
    id: '818235901', code: '818235901', name: 'Samira El Ouazzani',
    email: 'samira.ouazzani@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818225901', sponsorName: 'Leila Lahlou',
    password: 'routini123', phone: '+212 661 223344', city: 'Rabat', country: 'Maroc',
    joinDate: '15/03/2026', ppv: 120, teamPV: 2150, gpv: 2270, sv: 820,
    monthlySalesDH: 2150, walletDH: 1250.00, clientsCount: 5, fidelityPoints: 40, active: true
  },
  {
    id: '818236012', code: '818236012', name: 'Rachid Benzekri',
    email: 'rachid.benzekri@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818223789', sponsorName: 'Asmaa Chaoui',
    password: 'routini123', phone: '+212 662 334455', city: 'Marrakech', country: 'Maroc',
    joinDate: '22/03/2026', ppv: 120, teamPV: 2110, gpv: 2230, sv: 740,
    monthlySalesDH: 2000, walletDH: 1150.00, clientsCount: 5, fidelityPoints: 38, active: true
  },
  {
    id: '818237123', code: '818237123', name: 'Bouchra Tazi',
    email: 'bouchra.tazi@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818221567', sponsorName: 'Zineb Filali',
    password: 'routini123', phone: '+212 663 445566', city: 'Fès', country: 'Maroc',
    joinDate: '02/04/2026', ppv: 115, teamPV: 2080, gpv: 2195, sv: 690,
    monthlySalesDH: 1950, walletDH: 1050.00, clientsCount: 5, fidelityPoints: 35, active: true
  },
  {
    id: '818238234', code: '818238234', name: 'Adil Amrani',
    email: 'adil.amrani@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818224890', sponsorName: 'Soufiane Berrada',
    password: 'routini123', phone: '+212 664 556677', city: 'Tanger', country: 'Maroc',
    joinDate: '12/04/2026', ppv: 115, teamPV: 2060, gpv: 2175, sv: 640,
    monthlySalesDH: 1850, walletDH: 980.00, clientsCount: 5, fidelityPoints: 32, active: true
  },
  {
    id: '818239345', code: '818239345', name: 'Hind Bennouna',
    email: 'hind.bennouna@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818228234', sponsorName: 'Mustapha Chraibi',
    password: 'routini123', phone: '+212 665 667788', city: 'Agadir', country: 'Maroc',
    joinDate: '25/04/2026', ppv: 110, teamPV: 2040, gpv: 2150, sv: 600,
    monthlySalesDH: 1750, walletDH: 920.00, clientsCount: 5, fidelityPoints: 30, active: true
  },
  {
    id: '818240456', code: '818240456', name: 'Kamal Belhaj',
    email: 'kamal.belhaj@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818220456', sponsorName: 'Amine Touzani',
    password: 'routini123', phone: '+212 666 778899', city: 'Meknès', country: 'Maroc',
    joinDate: '04/05/2026', ppv: 110, teamPV: 2030, gpv: 2140, sv: 560,
    monthlySalesDH: 1680, walletDH: 870.00, clientsCount: 5, fidelityPoints: 28, active: true
  },
  {
    id: '818241567', code: '818241567', name: 'Safae Lahrichi',
    email: 'safae.lahrichi@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818226012', sponsorName: 'Younes Tahiri',
    password: 'routini123', phone: '+212 667 889900', city: 'Tétouan', country: 'Maroc',
    joinDate: '18/05/2026', ppv: 105, teamPV: 2020, gpv: 2125, sv: 530,
    monthlySalesDH: 1600, walletDH: 820.00, clientsCount: 5, fidelityPoints: 26, active: true
  },
  {
    id: '818242678', code: '818242678', name: 'Yassine Cherkaoui',
    email: 'yassine.cherkaoui@routini-ambassador.com', role: 'distributor', rankCode: 'BUILDER',
    rankName: 'Builder (1% Leadership)', sponsorCode: '818229345', sponsorName: 'Ibtissam Kadiri',
    password: 'routini123', phone: '+212 668 990011', city: 'Kénitra', country: 'Maroc',
    joinDate: '30/05/2026', ppv: 105, teamPV: 2010, gpv: 2115, sv: 490,
    monthlySalesDH: 1550, walletDH: 780.00, clientsCount: 5, fidelityPoints: 25, active: true
  },
  // 14 Partners (Seuil perso >= 50 PV pour être actif)
  {
    id: '818243789', code: '818243789', name: 'Najat El Mokri',
    email: 'najat.elmokri@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818230456', sponsorName: 'Nabil Zerouali',
    password: 'routini123', phone: '+212 669 001122', city: 'Oujda', country: 'Maroc',
    joinDate: '08/06/2026', ppv: 75, teamPV: 180, gpv: 255, sv: 380,
    monthlySalesDH: 1900, walletDH: 540.00, clientsCount: 5, fidelityPoints: 30, active: true
  },
  {
    id: '818244890', code: '818244890', name: 'Mourad Berrada',
    email: 'mourad.berrada@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818231567', sponsorName: 'Ghita Mansour',
    password: 'routini123', phone: '+212 660 113355', city: 'Mohammedia', country: 'Maroc',
    joinDate: '19/06/2026', ppv: 70, teamPV: 140, gpv: 210, sv: 330,
    monthlySalesDH: 1820, walletDH: 490.00, clientsCount: 5, fidelityPoints: 28, active: true
  },
  {
    id: '818245901', code: '818245901', name: 'Loubna Slaoui',
    email: 'loubna.slaoui@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818227123', sponsorName: 'Sara El Amrani',
    password: 'routini123', phone: '+212 661 224466', city: 'Casablanca', country: 'Maroc',
    joinDate: '02/07/2026', ppv: 65, teamPV: 120, gpv: 185, sv: 310,
    monthlySalesDH: 1750, walletDH: 460.00, clientsCount: 5, fidelityPoints: 26, active: true
  },
  {
    id: '818246012', code: '818246012', name: 'Aziz Fassi',
    email: 'aziz.fassi@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818219345', sponsorName: 'Houda Daoudi',
    password: 'routini123', phone: '+212 662 335577', city: 'Rabat', country: 'Maroc',
    joinDate: '14/07/2026', ppv: 60, teamPV: 100, gpv: 160, sv: 290,
    monthlySalesDH: 1680, walletDH: 430.00, clientsCount: 5, fidelityPoints: 24, active: true
  },
  {
    id: '818247123', code: '818247123', name: 'Chaimaa Tazi',
    email: 'chaimaa.tazi@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818232678', sponsorName: 'Othmane Skalli',
    password: 'routini123', phone: '+212 663 446688', city: 'Fès', country: 'Maroc',
    joinDate: '28/07/2026', ppv: 60, teamPV: 90, gpv: 150, sv: 270,
    monthlySalesDH: 1620, walletDH: 410.00, clientsCount: 5, fidelityPoints: 22, active: true
  },
  {
    id: '818248234', code: '818248234', name: 'Hassan El Khatib',
    email: 'hassan.elkhatib@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818214890', sponsorName: 'Bilal Benchekroun',
    password: 'routini123', phone: '+212 664 557799', city: 'Marrakech', country: 'Maroc',
    joinDate: '05/08/2026', ppv: 55, teamPV: 80, gpv: 135, sv: 250,
    monthlySalesDH: 1580, walletDH: 390.00, clientsCount: 5, fidelityPoints: 20, active: true
  },
  {
    id: '818249345', code: '818249345', name: 'Kawtar Naciri',
    email: 'kawtar.naciri@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818215901', sponsorName: 'Kenza Bennani',
    password: 'routini123', phone: '+212 665 668800', city: 'Tanger', country: 'Maroc',
    joinDate: '16/08/2026', ppv: 55, teamPV: 60, gpv: 115, sv: 220,
    monthlySalesDH: 1520, walletDH: 360.00, clientsCount: 5, fidelityPoints: 18, active: true
  },
  {
    id: '818250456', code: '818250456', name: 'Mehdi Boukhris',
    email: 'mehdi.boukhris@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818212456', sponsorName: 'Salma Chraibi',
    password: 'routini123', phone: '+212 666 779911', city: 'El Jadida', country: 'Maroc',
    joinDate: '25/08/2026', ppv: 52, teamPV: 40, gpv: 92, sv: 190,
    monthlySalesDH: 1480, walletDH: 320.00, clientsCount: 5, fidelityPoints: 16, active: true
  },
  {
    id: '818251567', code: '818251567', name: 'Halima Zouiten',
    email: 'halima.zouiten@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818217123', sponsorName: 'Siham Bouazza',
    password: 'routini123', phone: '+212 667 880022', city: 'Nador', country: 'Maroc',
    joinDate: '01/09/2026', ppv: 50, teamPV: 20, gpv: 70, sv: 160,
    monthlySalesDH: 1420, walletDH: 280.00, clientsCount: 5, fidelityPoints: 14, active: true
  },
  // Exemple de partenaires sous le seuil d'activité (< 50 PV) pour illustrer la règle de non-versement (Slide 8/15)
  {
    id: '818252678', code: '818252678', name: 'Driss Bensaid',
    email: 'driss.bensaid@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818216012', sponsorName: 'Hicham Naciri',
    password: 'routini123', phone: '+212 668 991133', city: 'Safi', country: 'Maroc',
    joinDate: '05/09/2026', ppv: 30, teamPV: 10, gpv: 40, sv: 140, // 30 PV < 50 PV minimum
    monthlySalesDH: 900, walletDH: 0.00, clientsCount: 2, fidelityPoints: 8, active: false
  },
  {
    id: '818253789', code: '818253789', name: 'Noura El Alami',
    email: 'noura.elalami@routini-ambassador.com', role: 'distributor', rankCode: 'PARTNER',
    rankName: 'Partner (N1 Accès)', sponsorCode: '818206330', sponsorName: 'Mehdi Alami',
    password: 'routini123', phone: '+212 669 002244', city: 'Essaouira', country: 'Maroc',
    joinDate: '08/09/2026', ppv: 25, teamPV: 0, gpv: 25, sv: 120, // 25 PV < 50 PV minimum
    monthlySalesDH: 700, walletDH: 0.00, clientsCount: 1, fidelityPoints: 6, active: false
  }
];

// Pack Types V4 (PP -> PM 90% -> PV PP/10 -> CV 60% PM)
const PACK_TYPES = [
  { name: 'Pack Routine Glow Découverte', pp: 1000, dp: 900, pv: 100, sv: 540, items: 3 },
  { name: 'Pack Rituel Anti-Âge Suprême', pp: 2000, dp: 1800, pv: 200, sv: 1080, items: 4 },
  { name: 'Pack Ambassadrice Institut Routine', pp: 5000, dp: 4500, pv: 500, sv: 2700, items: 18 },
  { name: 'Duo Éclat & Nuit (Formule Étalon)', pp: 500, dp: 450, pv: 50, sv: 270, items: 2 },
  { name: 'Sérum Éclat Vitamine C + Crème Jour SPF 30', pp: 650, dp: 585, pv: 65, sv: 351, items: 2 },
  { name: 'Coffret Nettoyant Micellaire & Masque Argile', pp: 400, dp: 360, pv: 40, sv: 216, items: 2 }
];

const DATES_6_MONTHS = [
  '15/03/2026', '18/03/2026', '22/03/2026', '26/03/2026', '29/03/2026',
  '02/04/2026', '06/04/2026', '10/04/2026', '14/04/2026', '18/04/2026', '23/04/2026', '28/04/2026',
  '03/05/2026', '07/05/2026', '12/05/2026', '17/05/2026', '21/05/2026', '26/05/2026', '30/05/2026',
  '04/06/2026', '08/06/2026', '13/06/2026', '18/06/2026', '22/06/2026', '27/06/2026',
  '02/07/2026', '07/07/2026', '12/07/2026', '16/07/2026', '21/07/2026', '26/07/2026', '30/07/2026',
  '03/08/2026', '08/08/2026', '12/08/2026', '17/08/2026', '22/08/2026', '26/08/2026', '30/08/2026',
  '01/09/2026', '03/09/2026', '05/09/2026', '07/09/2026', '09/09/2026', '10/09/2026'
];

const CHANNELS = ['attached_client', 'attached_client', 'partner_personal', 'direct_client'];
const PAYMENTS = ['E-Point', 'Carte Bancaire', 'Carte Bancaire', 'Institut Routini'];

const ORDERS_GENERATED = [];
let orderIdCounter = 10001;

for (let i = 0; i < DATES_6_MONTHS.length; i++) {
  const date = DATES_6_MONTHS[i];
  const countThisDay = 2 + (i % 3); // 2 to 4 orders per recorded day
  for (let j = 0; j < countThisDay; j++) {
    const memberIndex = (i * 3 + j + 1) % (MEMBERS_RAW.length - 1) + 1;
    const member = MEMBERS_RAW[memberIndex];
    const pack = PACK_TYPES[(i + j) % PACK_TYPES.length];
    const channel = CHANNELS[(i + j) % CHANNELS.length];
    const payment = PAYMENTS[(i * 2 + j) % PAYMENTS.length];

    ORDERS_GENERATED.push({
      id: 'CMD-RTN-' + orderIdCounter++,
      orderType: channel,
      memberCode: member.code,
      memberName: `${member.name} (${channel === 'attached_client' ? 'Client Rattaché' : channel === 'direct_client' ? 'Client Direct' : 'Achat Perso'})`,
      date: date,
      itemsCount: pack.items,
      totalPP: pack.pp,
      totalDH: channel === 'direct_client' ? pack.pp : pack.dp, // Client direct paye PP, Membre paye PM (90%)
      totalEUR: Number(((channel === 'direct_client' ? pack.pp : pack.dp) * 0.093).toFixed(2)),
      totalPV: pack.pv,
      totalSV: pack.sv,
      fidelityPoints: Math.floor(pack.dp * 0.1),
      paymentMethod: payment,
      status: 'Livrée & Validée'
    });
  }
}

// 6 Monthly closures & Bank Withdrawals
const HISTORICAL_TRANSACTIONS = [
  { date: '01/09/2026', ref: 'BONUS-082026', desc: 'Clôture mensuelle des primes (Août 2026 • ONE PLAN V4)', type: 'credit', amount: 3450, status: 'Validé & Versé' },
  { date: '15/08/2026', ref: 'WD-ATTIJARI-892', desc: 'Virement bancaire vers Attijariwafa Bank (RIB *******4521)', type: 'debit', amount: 4000, status: 'Effectué' },
  { date: '01/08/2026', ref: 'BONUS-072026', desc: 'Clôture mensuelle des primes (Juillet 2026 • ONE PLAN V4)', type: 'credit', amount: 3280, status: 'Validé & Versé' },
  { date: '18/07/2026', ref: 'WD-BMCE-731', desc: 'Virement bancaire vers Bank of Africa (RIB *******9812)', type: 'debit', amount: 3000, status: 'Effectué' },
  { date: '01/07/2026', ref: 'BONUS-062026', desc: 'Clôture mensuelle des primes (Juin 2026 • ONE PLAN V4)', type: 'credit', amount: 3150, status: 'Validé & Versé' },
  { date: '12/06/2026', ref: 'WD-CIH-550', desc: 'Virement bancaire vers CIH Bank (RIB *******3344)', type: 'debit', amount: 2500, status: 'Effectué' },
  { date: '01/06/2026', ref: 'BONUS-052026', desc: 'Clôture mensuelle des primes (Mai 2026 • ONE PLAN V4)', type: 'credit', amount: 2950, status: 'Validé & Versé' },
  { date: '15/05/2026', ref: 'WD-BCP-410', desc: 'Virement bancaire vers Banque Populaire (RIB *******7722)', type: 'debit', amount: 2500, status: 'Effectué' },
  { date: '01/05/2026', ref: 'BONUS-042026', desc: 'Clôture mensuelle des primes (Avril 2026 • ONE PLAN V4)', type: 'credit', amount: 2700, status: 'Validé & Versé' },
  { date: '01/04/2026', ref: 'BONUS-032026', desc: 'Clôture mensuelle des primes (Mars 2026 • ONE PLAN V4)', type: 'credit', amount: 2400, status: 'Validé & Versé' }
];

console.log(`Generated ${MEMBERS_RAW.length} members and ${ORDERS_GENERATED.length} orders over 6 months!`);

const outputData = {
  members: MEMBERS_RAW,
  orders: ORDERS_GENERATED,
  transactions: HISTORICAL_TRANSACTIONS
};

fs.writeFileSync(path.join(__dirname, 'mock_network_6months.json'), JSON.stringify(outputData, null, 2), 'utf-8');
console.log('Saved mock_network_6months.json successfully!');

const jsContent = `/**
 * Routini eWorld MLM - Données Historiques Réelles sur 6 Mois (ROUTINI ONE PLAN V4 - Septembre 2026)
 * 51 Membres Réseau Maroc + 135 Commandes (Mars 2026 - Septembre 2026) + Relevés Bancaires
 */
window.ROUTINI_MOCK_DATA = ${JSON.stringify(outputData, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, 'js', 'mock_data.js'), jsContent, 'utf-8');
console.log('Saved js/mock_data.js successfully!');
