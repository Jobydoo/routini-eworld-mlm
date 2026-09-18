/**
 * Routini eWorld MLM - Direction Générale (Console Super Admin)
 * Modèle : ROUTINE ONE PLAN — Version 4 (Septembre 2026)
 * Document de Référence : 18 Slides Officielles
 * 
 * Fonctionnalités Administrateur :
 * 1. Gestion Complète des Soins & Packs Routines (Formules V4 : PM = 90% PP, PV = PP / 10, CV = 60% PM)
 * 2. Contrôle de Solidité Financière (Stress Test Slide 15 & 16, Marge Contributive, Payout ≤ 22%)
 * 3. Gestion du Réseau des 6 Grades (Progression structurelle après Builder, 2 actifs du rang précédent)
 * 4. Ajustements Manuels : PV/CV, Grades, Portefeuille E-Point
 */

class AdminController {
  constructor() {
    this.searchMemberQuery = '';
    this.productFilter = 'ALL'; // 'ALL', 'PACKS', 'SOLO'
    this.searchProductQuery = '';
    this.stressTestOrderDH = 500; // Panier de référence étalon (Slide 3)
    this.stressTestCV = 270;      // 60% de 450 DH PM
  }

  init() {
    this.render();
  }

  setMemberSearch(query) {
    this.searchMemberQuery = query.toLowerCase().trim();
    this.render();
  }

  setProductFilter(filter) {
    this.productFilter = filter;
    this.render();
  }

  setProductSearch(query) {
    this.searchProductQuery = query.toLowerCase().trim();
    this.render();
  }

  render() {
    const container = document.getElementById('adminContentArea');
    if (!container) return;

    if (!window.stateManager.isOwner()) {
      container.innerHTML = `
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 24px; border-radius: 8px;">
          <h3 style="color: #991b1b; font-weight: 800;"><i class="fas fa-lock"></i> Accès Réservé à la Direction Générale Routini</h3>
          <p style="color: #7f1d1d; margin-top: 6px; font-size: 0.9rem;">
            Cette section est exclusivement réservée au Fondateur et Administrateur Principal (Compte ADMIN001).
          </p>
          <div style="margin-top: 16px;">
            <button class="btn-primary-auth btn-owner-auth" style="width: auto; padding: 8px 18px;" onclick="window.app.switchAccount('ADMIN001')">
              <i class="fas fa-crown"></i> Se connecter en tant que Direction (ADMIN001)
            </button>
          </div>
        </div>
      `;
      return;
    }

    const stats = window.stateManager.getCompanyStats();
    let members = window.stateManager.members;

    if (this.searchMemberQuery) {
      members = members.filter(m => 
        m.name.toLowerCase().includes(this.searchMemberQuery) ||
        m.code.toLowerCase().includes(this.searchMemberQuery) ||
        m.city.toLowerCase().includes(this.searchMemberQuery)
      );
    }

    let products = window.stateManager.products;
    if (this.productFilter === 'PACKS') {
      products = products.filter(p => p.isPack || p.category === 'Packs & Rituels');
    } else if (this.productFilter === 'SOLO') {
      products = products.filter(p => !p.isPack && p.category !== 'Packs & Rituels');
    }

    if (this.searchProductQuery) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(this.searchProductQuery) ||
        p.id.toLowerCase().includes(this.searchProductQuery) ||
        p.category.toLowerCase().includes(this.searchProductQuery)
      );
    }

    // Calculs du Stress Test Financier V4 (Slide 15 & 16)
    const pp = this.stressTestOrderDH;
    const pm = Math.round(pp * 0.90);
    const cv = this.stressTestCV;

    const commVendeurDH = Math.round(pp * 0.10);
    const n1DH = Number((cv * 0.10).toFixed(2));
    const n2DH = Number((cv * 0.05).toFixed(2));
    const n3DH = Number((cv * 0.03).toFixed(2));
    const leadershipMaxDH = Number((cv * 0.07).toFixed(2)); // Palier suprême 7% Ambassador
    const totalPayoutDH = Number((n1DH + n2DH + n3DH + leadershipMaxDH).toFixed(2));
    const payoutPercentOfMemberPrice = ((totalPayoutDH / pm) * 100).toFixed(1);
    const isSafe = payoutPercentOfMemberPrice <= 22.0;

    container.innerHTML = `
      <!-- En-tête Principal de Direction -->
      <div class="admin-badge-ribbon">
        <div>
          <h3 style="color: #fff;"><i class="fas fa-crown" style="color: var(--rtn-gold);"></i> Direction Générale Routini — Contrôle Central ONE PLAN V4</h3>
          <p style="color: #cbd5e1;">Gestion du catalogue (PM 90%, PV PP/10, CV 60%), solidité financière et base de données cloud.</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <div class="db-status-chip offline" id="adminDbStatusChip" title="Statut de la base Neon Vercel Postgres">
            <span class="db-status-dot"></span>
            <span id="adminDbStatusText">Vercel Postgres : Prêt</span>
          </div>
          <button type="button" class="btn-action-refresh" onclick="window.dbSync && window.dbSync.initOrSyncCloud(true)" title="Synchroniser et initialiser la base cloud" style="background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(232, 200, 203, 0.3); padding: 6px 12px; border-radius: 6px; font-size: 0.76rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
            <i class="fas fa-database" style="color: var(--rtn-rose);"></i> <span>Sync Base Vercel</span>
          </button>
        </div>
      </div>

      <!-- Métriques Globales Entreprise -->
      <div class="metrics-grid">
        <div class="metric-card card-ppv">
          <div class="metric-header">
            <span class="metric-title">Chiffre d'Affaires Global</span>
            <div class="metric-icon"><i class="fas fa-chart-line"></i></div>
          </div>
          <div class="metric-value">${window.stateManager.formatMoney(stats.totalSalesDH)}</div>
          <div class="metric-meta">Ventes totales enregistrées</div>
        </div>

        <div class="metric-card card-gpv">
          <div class="metric-header">
            <span class="metric-title">Volume d'Activité Réseau (PV)</span>
            <div class="metric-icon"><i class="fas fa-award"></i></div>
          </div>
          <div class="metric-value">${stats.totalTurnoverPV.toLocaleString('fr-FR')} PV</div>
          <div class="metric-meta">${stats.totalOrders} commandes livrées</div>
        </div>

        <div class="metric-card card-sv">
          <div class="metric-header">
            <span class="metric-title">Base Commissions (CV)</span>
            <div class="metric-icon"><i class="fas fa-receipt"></i></div>
          </div>
          <div class="metric-value">${stats.totalTurnoverSV.toLocaleString('fr-FR')} CV</div>
          <div class="metric-meta">Base officielle N1/N2/N3 & Leadership</div>
        </div>

        <div class="metric-card card-wallet">
          <div class="metric-header">
            <span class="metric-title">Total Portefeuilles Membres</span>
            <div class="metric-icon"><i class="fas fa-wallet"></i></div>
          </div>
          <div class="metric-value">${window.stateManager.formatMoney(stats.totalWalletsDH)}</div>
          <div class="metric-meta">${stats.totalDistributors} partenaires enregistrés</div>
        </div>
      </div>

      <!-- SECTION 1 : GESTION DES PRODUITS & PACKS AVEC FORMULES V4 (Slide 3) -->
      <div class="data-table-card" style="margin-bottom: 28px;">
        <div class="table-header-bar" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-boxes" style="color: var(--rtn-rose);"></i>
              Catalogue des Soins & Packs Routines (Formules Officielles V4)
            </h3>
            <p style="font-size: 0.78rem; color: #64748b;">
              PM = 90% PP • PV = PP ÷ 10 • CV = 60% PM • Chaque modification se répercute instantanément sur la boutique.
            </p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <div class="search-box" style="min-width: 200px;">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Filtrer un soin ou pack..." value="${this.searchProductQuery}" oninput="window.adminController.setProductSearch(this.value)">
            </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <div class="search-box" style="min-width: 180px;">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Filtrer un produit ou pack..." value="${this.searchProductQuery}" oninput="window.adminController.setProductSearch(this.value)">
            </div>
            <button class="btn-primary-auth" style="width: auto; padding: 8px 14px; font-size: 0.82rem;" onclick="window.adminController.showAddSoloProductModal()">
              <i class="fas fa-plus"></i> Créer Nouveau Produit
            </button>
            <button class="btn-primary-auth" style="width: auto; padding: 8px 14px; font-size: 0.82rem; background: #15803d;" onclick="window.adminController.showAddPackModal()">
              <i class="fas fa-gift"></i> Créer un Pack
            </button>
          </div>
        </div>

        <div style="display: flex; gap: 8px; padding: 10px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <button class="filter-pill ${this.productFilter === 'ALL' ? 'active' : ''}" onclick="window.adminController.setProductFilter('ALL')">Tous (${window.stateManager.products.length})</button>
          <button class="filter-pill ${this.productFilter === 'PACKS' ? 'active' : ''}" onclick="window.adminController.setProductFilter('PACKS')">Packs & Rituels</button>
          <button class="filter-pill ${this.productFilter === 'SOLO' ? 'active' : ''}" onclick="window.adminController.setProductFilter('SOLO')">Produits</button>
        </div>

        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produit ou Pack</th>
                <th>Catégorie</th>
                <th>Prix Public (PP)</th>
                <th>Prix Membre (PM 90%)</th>
                <th>Points (PV = PP/10)</th>
                <th style="background: #fdf2f8; color: #be185d;">Base CV (60% PM)</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => {
                const pp = p.priceRP_DH || 500;
                const pm = p.pricePM_DH || Math.round(pp * 0.90);
                const pv = p.pv || Math.round(pp / 10);
                const cv = p.sv || Math.round(pm * 0.60);
                return `
                  <tr>
                    <td><span style="font-family: monospace; font-weight:700; color: #0284c7;">${p.id}</span></td>
                    <td>
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size: 1.2rem;">${p.icon || '✨'}</span>
                        <div>
                          <strong>${p.name}</strong>
                          ${p.isPromo ? `<span style="font-size: 0.68rem; background: #dc2626; color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 4px; font-weight: 800;"><i class="fas fa-fire"></i> ${p.promoBadge || 'PROMO'}</span>` : ''}
                          ${p.badge && !p.isPromo ? `<span style="font-size: 0.68rem; background: #be185d; color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">${p.badge}</span>` : ''}
                        </div>
                      </div>
                    </td>
                    <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${p.category}</span></td>
                    <td>
                      <strong>${pp} DH</strong>
                      ${p.isPromo && p.originalPriceRP && p.originalPriceRP > pp ? `<small style="display: block; text-decoration: line-through; color: #94a3b8; font-size: 0.72rem;">${p.originalPriceRP} DH</small>` : ''}
                    </td>
                    <td style="color: #15803d; font-weight: 700;">${pm} DH</td>
                    <td><strong style="color: var(--rtn-rose);">${pv} PV</strong></td>
                    <td style="background: #fff1f2; font-weight: 800; color: #be185d;">
                      ${cv} CV
                    </td>
                    <td>${p.stock}</td>
                    <td>
                      <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        <button class="btn-switch-account" style="padding: 4px 7px; font-size: 0.72rem;" onclick="window.adminController.showEditProductModal('${p.id}')" title="Modifier">
                          <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button class="btn-switch-account" style="color: #0284c7; border-color: #bae6fd; padding: 4px 7px; font-size: 0.72rem;" onclick="window.adminController.handleDuplicateProduct('${p.id}')" title="Dupliquer">
                          <i class="fas fa-clone"></i> Dupliquer
                        </button>
                        <button class="btn-switch-account" style="color: #dc2626; border-color: #fca5a5; padding: 4px 7px; font-size: 0.72rem;" title="Effacer" onclick="window.adminController.handleDeleteProduct('${p.id}')">
                          <i class="fas fa-trash-alt"></i> Effacer
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION 2 : SOLIDITÉ FINANCIÈRE & CE QU'IL FAUT CONTRÔLER (Slide 15 & 16) -->
      <div class="data-table-card" style="margin-bottom: 28px; background: #fdfdfd; border-left: 5px solid #15803d;">
        <div class="table-header-bar" style="flex-wrap: wrap;">
          <div>
            <h3 style="display:flex; align-items:center; gap:8px; color:#14532d;">
              <i class="fas fa-balance-scale" style="color: #15803d;"></i>
              Solidité Financière & Ce qu'il faut contrôler (Slide 15 & 16)
            </h3>
            <p style="font-size: 0.8rem; color: #64748b;">
              Le plan doit rester rentable même quand le réseau grandit : contrôle des entrées et des sorties variables.
            </p>
          </div>
        </div>

        <!-- 3 Blocs Entrées / Sorties variables / Données à contrôler (Slide 16) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; padding: 0 20px 20px;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; border-top: 4px solid #16a34a;">
            <strong style="color: #166534; font-size: 0.85rem; text-transform: uppercase;">1. Entrées d'Argent</strong>
            <ul style="font-size: 0.78rem; list-style: none; padding: 0; margin-top: 8px; line-height: 1.8; color: #14532d;">
              <li><i class="fas fa-check-circle"></i> <strong>CA Prix Membre (90% PP)</strong> : réachats réseau</li>
              <li><i class="fas fa-check-circle"></i> <strong>Ventes Clients Directs (100% PP)</strong> : marge max</li>
              <li><i class="fas fa-check-circle"></i> <strong>Ventes Clients Rattachés</strong> : volume régulier</li>
              <li><i class="fas fa-check-circle"></i> Réachat et duplication des membres</li>
            </ul>
          </div>

          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; border-top: 4px solid #f59e0b;">
            <strong style="color: #92400e; font-size: 0.85rem; text-transform: uppercase;">2. Sorties Variables (Commissions)</strong>
            <ul style="font-size: 0.78rem; list-style: none; padding: 0; margin-top: 8px; line-height: 1.8; color: #78350f;">
              <li><i class="fas fa-arrow-circle-right"></i> <strong>Niveau 1</strong> : 10% du CV</li>
              <li><i class="fas fa-arrow-circle-right"></i> <strong>Niveau 2</strong> : 5% du CV (si Builder+)</li>
              <li><i class="fas fa-arrow-circle-right"></i> <strong>Niveau 3</strong> : 3% du CV (si Leader+)</li>
              <li><i class="fas fa-arrow-circle-right"></i> <strong>Leadership</strong> : 1% à 7% différentiel</li>
            </ul>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; border-top: 4px solid #64748b;">
            <strong style="color: #334155; font-size: 0.85rem; text-transform: uppercase;">3. Paramètres à Contrôler</strong>
            <ul style="font-size: 0.78rem; list-style: none; padding: 0; margin-top: 8px; line-height: 1.8; color: #475569;">
              <li><i class="fas fa-info-circle"></i> Coût de revient par produit (COGS)</li>
              <li><i class="fas fa-info-circle"></i> Marge brute réelle avant commissions</li>
              <li><i class="fas fa-info-circle"></i> TVA / fiscalité applicable</li>
              <li><i class="fas fa-info-circle"></i> Coût de livraison & logistique SAV</li>
            </ul>
          </div>
        </div>

        <!-- Simulateur de Stress Test en Direct -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; padding: 0 20px 20px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; color: #0f172a;">Simulateur de Commande Étalon (Slide 3 & 5)</h4>
            <div class="form-group" style="margin-bottom: 10px;">
              <label style="font-size: 0.78rem;">Montant Prix Public de la Commande (DH) :</label>
              <input type="number" id="stressOrderInput" class="form-control" value="${this.stressTestOrderDH}" oninput="window.adminController.updateStressTest()">
              <small style="color: #64748b;">Prix Membre Payé (90%) = <strong>${pm} DH</strong></small>
            </div>
            <div class="form-group" style="margin-bottom: 10px;">
              <label style="font-size: 0.78rem;">CV Assigné (60% du Prix Membre) :</label>
              <input type="number" id="stressCVInput" class="form-control" value="${this.stressTestCV}" oninput="window.adminController.updateStressTest()">
              <small style="color: #64748b;">Formule officielle V4 : <strong>${pm} × 60% = ${Math.round(pm * 0.60)} CV</strong></small>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; color: #0f172a;">Sorties Variables Maximum sur cette Commande</h4>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 3px 0;">
              <span>N1 Réseau (10% CV) :</span>
              <strong>${n1DH.toFixed(2)} DH</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 3px 0;">
              <span>N2 Réseau (5% CV) :</span>
              <strong>${n2DH.toFixed(2)} DH</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 3px 0;">
              <span>N3 Réseau (3% CV) :</span>
              <strong>${n3DH.toFixed(2)} DH</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 3px 0;">
              <span>Leadership Max (7% CV) :</span>
              <strong>${leadershipMaxDH.toFixed(2)} DH</strong>
            </div>
            <div style="border-top: 1.5px solid #cbd5e1; margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between; font-size: 0.95rem;">
              <strong style="color: #0f172a;">Total Sorties Réseau Max :</strong>
              <strong style="color: ${isSafe ? '#15803d' : '#ef4444'}; font-size: 1.1rem;">
                ${totalPayoutDH.toFixed(2)} DH (${payoutPercentOfMemberPrice}% du CA membre)
              </strong>
            </div>
            <div style="margin-top: 6px; font-size: 0.75rem; color: ${isSafe ? '#15803d' : '#ef4444'}; font-weight: 700;">
              ${isSafe ? '✓ Solidité Validée : Payout de 15.0% ≤ Plafond cible de 22%. Marge préservée !' : '⚠ ALERTE : Le CV dépasse le seuil de rentabilité !'}
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 3 : GESTION DES DISTRIBUTEURS & DES 6 GRADES V4 -->
      <div class="data-table-card">
        <div class="table-header-bar" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-users" style="color: var(--rtn-navy);"></i>
              Réseau Partenaires & 6 Grades ROUTINI ONE PLAN V4 (${members.length} enregistrés)
            </h3>
            <p style="font-size: 0.78rem; color: #64748b;">
              Règle V4 : Builder = ≥ 2 000 PV cumulés • Après Builder = 2 actifs du grade précédent (aucun seuil PV !)
            </p>
          </div>
          <div class="search-box" style="min-width: 240px;">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher par nom ou code..." value="${this.searchMemberQuery}" oninput="window.adminController.setMemberSearch(this.value)">
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom & Prénom</th>
                <th>Grade Actuel</th>
                <th>Statut Activité Mensuelle</th>
                <th>Points Perso (PPV)</th>
                <th>Volume Équipe</th>
                <th>Solde E-Point</th>
                <th>Actions Direction</th>
              </tr>
            </thead>
            <tbody>
              ${members.map(m => {
                const activity = window.stateManager.getActivityDetails(m);
                return `
                  <tr>
                    <td><span style="font-family: monospace; font-weight:700; color: var(--rtn-navy);">${m.code}</span></td>
                    <td>
                      <strong>${m.name}</strong>
                      ${m.role === 'owner' ? '<span class="status-badge" style="background:var(--rtn-rose-light); color:var(--rtn-rose-dark); margin-left:6px;">Direction</span>' : ''}
                      <div style="font-size: 0.75rem; color: #64748b;">${m.city}, ${m.country}</div>
                    </td>
                    <td>
                      <span class="rank-tag rank-${m.rankCode ? m.rankCode.toLowerCase() : 'partner'}">
                        ${m.rankName || m.rankCode}
                      </span>
                    </td>
                    <td>
                      ${activity.isActive ? `
                        <span class="status-badge status-success" title="PPV ≥ seuil du grade">
                          <i class="fas fa-check"></i> Actif (${activity.ppv}/${activity.requiredPV} PV)
                        </span>
                      ` : `
                        <span class="status-badge status-warning" style="background:#fee2e2; color:#b91c1c;" title="PPV < seuil. Pas de commissions ce mois-ci">
                          <i class="fas fa-times-circle"></i> Inactif (${activity.ppv}/${activity.requiredPV} PV)
                        </span>
                      `}
                    </td>
                    <td><strong style="color:var(--rtn-rose);">${m.ppv || 0} PV</strong></td>
                    <td><strong style="color:#15803d;">${(m.teamPV || m.gpv || 0).toLocaleString('fr-FR')} PV</strong></td>
                    <td><strong>${window.stateManager.formatMoney(m.walletDH || 0)}</strong></td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn-switch-account" style="padding: 4px 8px; font-size: 0.75rem;" onclick="window.adminController.showAdjustPointsModal('${m.code}')">
                          <i class="fas fa-coins"></i> Ajuster PV/Solde
                        </button>
                        <button class="btn-switch-account" style="padding: 4px 8px; font-size: 0.75rem;" onclick="window.adminController.showChangeRankModal('${m.code}')">
                          <i class="fas fa-graduation-cap"></i> Grade
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (window.i18n && window.i18n.currentLang !== 'fr') {
      window.i18n.translateDOM();
    }
  }

  updateStressTest() {
    const orderInput = document.getElementById('stressOrderInput');
    const cvInput = document.getElementById('stressCVInput');
    if (orderInput) this.stressTestOrderDH = Number(orderInput.value) || 0;
    if (cvInput) this.stressTestCV = Number(cvInput.value) || 0;
    this.render();
  }

  showEditProductModal(productId) {
    const prod = window.stateManager.getProductById(productId);
    if (!prod) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    const pp = prod.priceRP_DH || 500;
    const pm = prod.pricePM_DH || Math.round(pp * 0.90);
    const pv = prod.pv || Math.round(pp / 10);
    const cv = prod.sv || Math.round(pm * 0.60);
    const isPack = prod.isPack || prod.category === 'Packs & Rituels';

    modalTitle.innerHTML = `<i class="fas fa-edit" style="color: var(--rtn-rose);"></i> Modifier l'Article : ${prod.name}`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleEditProductSubmit(event, '${prod.id}')">
        <div class="form-group">
          <label>Nom de l'Article :</label>
          <input type="text" id="editProdName" class="form-control" value="${prod.name}" required>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Type & Catégorie :</label>
            <select id="editProdCategory" class="form-control">
              <option value="Packs & Rituels" ${isPack ? 'selected' : ''}>🎁 Packs & Rituels Beauté</option>
              <option value="Soins Visage" ${prod.category === 'Soins Visage' ? 'selected' : ''}>✨ Soins Visage & Sérums</option>
              <option value="Anti-Âge" ${prod.category === 'Anti-Âge' ? 'selected' : ''}>🌙 Anti-Âge & Nuit</option>
              <option value="Huiles Précieuses" ${prod.category === 'Huiles Précieuses' ? 'selected' : ''}>🌹 Huiles Précieuses</option>
              <option value="Soins Corps" ${prod.category === 'Soins Corps' ? 'selected' : ''}>🧴 Soins Corps</option>
            </select>
          </div>

          <div class="form-group">
            <label>Badge Affiché :</label>
            <input type="text" id="editProdBadge" class="form-control" value="${prod.badge || ''}" placeholder="Ex: Starter Pack, Bestseller...">
          </div>
        </div>

        <!-- Section Promotion pour Pack ou Produit -->
        <div style="background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label style="color: #be185d; font-weight: 800; font-size: 0.88rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
              <input type="checkbox" id="editProdIsPromo" ${prod.isPromo ? 'checked' : ''} onchange="document.getElementById('editPromoFields').style.display = this.checked ? 'grid' : 'none'">
              🔥 Mettre cet article / pack en Promotion
            </label>
          </div>
          <div id="editPromoFields" style="display: ${prod.isPromo ? 'grid' : 'none'}; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.76rem; color: #9f1239;">Badge Promo (ex: PROMO -20%) :</label>
              <input type="text" id="editProdPromoBadge" class="form-control" value="${prod.promoBadge || 'PROMO'}" placeholder="PROMO -20%">
            </div>
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.76rem; color: #9f1239;">Prix d'origine barré (DH) :</label>
              <input type="number" id="editProdOrigRP" class="form-control" value="${prod.originalPriceRP || pp}">
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Description :</label>
          <textarea id="editProdDesc" class="form-control" rows="2" required>${prod.desc || ''}</textarea>
        </div>

        <!-- Ligne Prix Public PP & Prix Membre -->
        <div class="form-grid-2" style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1.5px solid #86efac; margin-bottom: 14px;">
          <div class="form-group" style="margin: 0;">
            <label style="color: #166534; font-weight: 700;">Prix Public PP (DH) :</label>
            <input type="number" id="editProdRP" class="form-control" value="${pp}" min="10" required oninput="window.adminController.autoCalcV4('edit')">
            <small style="color: #15803d;">Prix de vente conseillé (baisse possible)</small>
          </div>

          <div class="form-group" style="margin: 0;">
            <label style="color: #166534; font-weight: 700;">Prix Membre PM (90% PP) :</label>
            <input type="number" id="editProdPM" class="form-control" value="${pm}" min="10" required>
            <small style="color: #15803d;">Prix membres (-10% remise)</small>
          </div>
        </div>

        <!-- Ligne PV et CV (Possibilité d'augmenter les points PV) -->
        <div class="form-grid-2" style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 14px; border: 1.5px solid #e2e8f0;">
          <div class="form-group" style="margin: 0;">
            <label style="color: var(--rtn-rose-dark); font-weight: 700;">Points PV (Qualification) :</label>
            <input type="number" id="editProdPV" class="form-control" value="${pv}" min="1" step="1" required style="font-weight: 700; font-size: 1.05rem;">
            <small style="color: #64748b;">Augmentation des points possible en promo</small>
          </div>

          <div class="form-group" style="margin: 0;">
            <label style="color: #be185d; font-weight: 700;">Base CV (60% PM) :</label>
            <input type="number" id="editProdSV" class="form-control" value="${cv}" min="1" step="1" required style="font-weight: 800; font-size: 1.05rem; border: 2px solid #f43f5e;">
            <small style="color: #64748b;">Base calcul des commissions</small>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Stock Disponible :</label>
            <input type="number" id="editProdStock" class="form-control" value="${prod.stock || 50}" min="0" required>
          </div>
          <div class="form-group">
            <label>Icône / Émoji :</label>
            <input type="text" id="editProdIcon" class="form-control" value="${prod.icon || (isPack ? '🎁' : '✨')}" style="max-width: 100px;">
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px; background: #be185d;">
            <i class="fas fa-save"></i> Enregistrer les Modifications
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  autoCalcV4(mode) {
    const rpInput = document.getElementById(mode === 'edit' ? 'editProdRP' : 'newProdRP');
    const pmInput = document.getElementById(mode === 'edit' ? 'editProdPM' : 'newProdPM');
    const pvInput = document.getElementById(mode === 'edit' ? 'editProdPV' : 'newProdPV');
    const cvInput = document.getElementById(mode === 'edit' ? 'editProdSV' : 'newProdSV');

    if (!rpInput) return;
    const pp = Number(rpInput.value) || 0;
    const pm = Math.round(pp * 0.90);
    const pv = Math.round(pp / 10);
    const cv = Math.round(pm * 0.60);

    if (pmInput) pmInput.value = pm;
    if (pvInput) pvInput.value = pv;
    if (cvInput) cvInput.value = cv;
  }

  handleEditProductSubmit(e, productId) {
    e.preventDefault();

    const category = document.getElementById('editProdCategory').value;
    const isPack = category === 'Packs & Rituels';
    const isPromo = document.getElementById('editProdIsPromo').checked;
    const promoBadge = document.getElementById('editProdPromoBadge') ? document.getElementById('editProdPromoBadge').value.trim() : '';
    const origRP = document.getElementById('editProdOrigRP') ? Number(document.getElementById('editProdOrigRP').value) : null;

    const pp = Number(document.getElementById('editProdRP').value) || 500;
    const pm = Number(document.getElementById('editProdPM').value) || Math.round(pp * 0.90);
    const pv = Number(document.getElementById('editProdPV').value) || Math.round(pp / 10);
    const cv = Number(document.getElementById('editProdSV').value) || Math.round(pm * 0.60);

    const updatedData = {
      name: document.getElementById('editProdName').value,
      category: category,
      isPack: isPack,
      isPromo: isPromo,
      promoBadge: promoBadge,
      originalPriceRP: origRP || pp,
      badge: document.getElementById('editProdBadge').value,
      desc: document.getElementById('editProdDesc').value,
      priceRP_DH: pp,
      pricePM_DH: pm,
      priceDP_DH: pm,
      pv: pv,
      sv: cv,
      stock: Number(document.getElementById('editProdStock').value) || 50,
      icon: document.getElementById('editProdIcon').value || (isPack ? '🎁' : '✨')
    };

    window.stateManager.updateProduct(productId, updatedData);
    window.app.closeModal();
    window.app.showToast(`Article mis à jour (PP: ${pp} DH, PV: ${pv}, Promo: ${isPromo ? 'Oui' : 'Non'}) !`, 'success');
    window.app.renderAllViews();
  }

  // --- FORMULAIRE 1 : CRÉER UN PRODUIT INDIVIDUEL ---
  showAddSoloProductModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-plus-circle" style="color: #15803d;"></i> Créer un Nouveau Produit Individuel`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleAddSoloProductSubmit(event)">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Catégorie :</label>
            <select id="newSoloCategory" class="form-control">
              <option value="Soins Visage">✨ Soins Visage</option>
              <option value="Anti-Âge">🌙 Anti-Âge & Nuit</option>
              <option value="Huiles Précieuses">🌹 Huiles Précieuses</option>
              <option value="Soins Corps">🧴 Soins Corps</option>
            </select>
          </div>

          <div class="form-group">
            <label>Nom du Produit :</label>
            <input type="text" id="newSoloName" class="form-control" placeholder="Ex: Sérum Niacinamide 10% & Zinc" required>
          </div>
        </div>

        <div class="form-group">
          <label>Description :</label>
          <textarea id="newSoloDesc" class="form-control" rows="2" placeholder="Bienfaits, actifs, conseils..." required></textarea>
        </div>

        <div class="form-grid-2" style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1.5px solid #86efac; margin-bottom: 14px;">
          <div class="form-group" style="margin:0;">
            <label style="color: #166534; font-weight:700;">Prix Public PP (DH) :</label>
            <input type="number" id="newProdRP" class="form-control" value="350" min="10" required oninput="window.adminController.autoCalcV4('new')">
          </div>
          <div class="form-group" style="margin:0;">
            <label style="color: #166534; font-weight:700;">Prix Membre PM (90% PP) :</label>
            <input type="number" id="newProdPM" class="form-control" value="315" min="10" required>
          </div>
        </div>

        <div class="form-grid-2" style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 14px; border: 1.5px solid #e2e8f0;">
          <div class="form-group" style="margin:0;">
            <label style="color: var(--rtn-rose-dark); font-weight:700;">Points PV (PP ÷ 10) :</label>
            <input type="number" id="newProdPV" class="form-control" value="35" min="1" required>
          </div>
          <div class="form-group" style="margin:0;">
            <label style="color: #be185d; font-weight:700;">Base CV (60% PM) :</label>
            <input type="number" id="newProdSV" class="form-control" value="189" min="1" required style="border: 2px solid #f43f5e;">
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Stock Initial :</label>
            <input type="number" id="newSoloStock" class="form-control" value="60" min="1" required>
          </div>
          <div class="form-group">
            <label>Émoji / Icône :</label>
            <input type="text" id="newSoloIcon" class="form-control" value="✨" style="max-width: 100px;">
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px;">
            <i class="fas fa-check"></i> Créer et Publier le Produit
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleAddSoloProductSubmit(e) {
    e.preventDefault();

    const category = document.getElementById('newSoloCategory').value;
    const pp = Number(document.getElementById('newProdRP').value) || 350;
    const pm = Number(document.getElementById('newProdPM').value) || Math.round(pp * 0.90);
    const pv = Number(document.getElementById('newProdPV').value) || Math.round(pp / 10);
    const cv = Number(document.getElementById('newProdSV').value) || Math.round(pm * 0.60);

    const productData = {
      name: document.getElementById('newSoloName').value,
      category: category,
      isPack: false,
      badge: 'Nouveau',
      desc: document.getElementById('newSoloDesc').value,
      priceRP_DH: pp,
      pricePM_DH: pm,
      pv: pv,
      sv: cv,
      stock: Number(document.getElementById('newSoloStock').value) || 60,
      icon: document.getElementById('newSoloIcon').value || '✨'
    };

    window.stateManager.addProduct(productData);
    window.app.closeModal();
    window.app.showToast(`Nouveau produit « ${productData.name} » ajouté au catalogue !`, 'success');
    window.app.renderAllViews();
  }

  // --- FORMULAIRE 2 : CRÉER UN PACK (Avec sélection de produits existants) ---
  showAddPackModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-gift" style="color: #15803d;"></i> Créer un Pack de Produits Routini`;

    const soloProducts = window.stateManager.products.filter(p => !p.isPack && p.category !== 'Packs & Rituels');

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleAddPackSubmit(event)">
        <div class="form-group">
          <label>Nom du Pack :</label>
          <input type="text" id="newPackName" class="form-control" placeholder="Ex: Pack Routine Éclat & Fermeté" required>
        </div>

        <div class="form-group">
          <label>Description du Pack :</label>
          <textarea id="newPackDesc" class="form-control" rows="2" placeholder="Description des rituels inclus, conseils beauté..." required></textarea>
        </div>

        <!-- Sélection dynamique des produits existants -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
          <label style="font-weight: 800; color: var(--rtn-navy); display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fas fa-boxes" style="color: var(--rtn-rose);"></i> Sélectionner les produits à inclure dans ce Pack :</span>
            <small style="color: #64748b; font-weight: normal;">Cochez les produits</small>
          </label>
          <div style="max-height: 180px; overflow-y: auto; margin-top: 10px; display: flex; flex-direction: column; gap: 6px; padding-right: 4px;">
            ${soloProducts.map(p => `
              <label style="display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 0.82rem; transition: background 0.15s;" onmouseover="this.style.background='#fdf2f8'" onmouseout="this.style.background='#fff'">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" class="pack-product-checkbox" data-product-id="${p.id}" data-price="${p.priceRP_DH || 350}" onchange="window.adminController.recalcPackTotal()">
                  <span>${p.icon || '✨'} <strong>${p.name}</strong></span>
                </div>
                <span style="font-weight: 700; color: #15803d;">${p.priceRP_DH || 350} DH</span>
              </label>
            `).join('')}
          </div>

          <!-- Total cumulé calculé des produits -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 10px; border-top: 1.5px dashed #cbd5e1; font-size: 0.9rem;">
            <strong>Prix Total Cumulé des Produits Sélectionnés :</strong>
            <span id="packCalculatedTotalText" style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">0 DH</span>
          </div>
        </div>

        <!-- Manipulation du Prix du Pack (Prix Spécial / Réduit) -->
        <div class="form-grid-2" style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1.5px solid #86efac; margin-bottom: 14px;">
          <div class="form-group" style="margin: 0;">
            <label style="color: #166534; font-weight: 700;">Prix Public Vendu du Pack (PP en DH) :</label>
            <input type="number" id="packPriceRP" class="form-control" value="0" min="10" required oninput="window.adminController.autoCalcPackFromRP()">
            <small style="color: #15803d;">Vous pouvez ajuster / baisser ce prix</small>
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="color: #166534; font-weight: 700;">Prix Membre Pack (90% PP) :</label>
            <input type="number" id="packPricePM" class="form-control" value="0" min="10" required>
            <small style="color: #15803d;">Prix payé par les membres</small>
          </div>
        </div>

        <!-- Section Promotion pour le Pack -->
        <div style="background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px;">
          <label style="color: #be185d; font-weight: 800; font-size: 0.88rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" id="packIsPromo" onchange="document.getElementById('packPromoFields').style.display = this.checked ? 'grid' : 'none'">
            🔥 Mettre ce pack en Promotion spéciale
          </label>
          <div id="packPromoFields" style="display: none; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.76rem; color: #9f1239;">Badge Promotionnel :</label>
              <input type="text" id="packPromoBadge" class="form-control" value="PROMO SPÉCIALE" placeholder="Ex: OFFRE -25%">
            </div>
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.76rem; color: #9f1239;">Prix initial barré (DH) :</label>
              <input type="number" id="packOrigPrice" class="form-control" value="0" placeholder="Prix d'origine">
            </div>
          </div>
        </div>

        <!-- Ligne PV et CV (Avec possibilité d'augmenter les points en promo) -->
        <div class="form-grid-2" style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 14px; border: 1.5px solid #e2e8f0;">
          <div class="form-group" style="margin: 0;">
            <label style="color: var(--rtn-rose-dark); font-weight: 700;">Points PV (Qualification) :</label>
            <input type="number" id="packPV" class="form-control" value="0" min="1" step="1" required style="font-weight: 700; font-size: 1.05rem;">
            <small style="color: #64748b;">Augmenter les PV pour rendre le pack attractif</small>
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="color: #be185d; font-weight: 700;">Base CV (60% PM) :</label>
            <input type="number" id="packSV" class="form-control" value="0" min="1" step="1" required style="font-weight: 800; font-size: 1.05rem; border: 2px solid #f43f5e;">
            <small style="color: #64748b;">Base de calcul commissions</small>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Stock Disponible :</label>
            <input type="number" id="packStock" class="form-control" value="40" min="1" required>
          </div>
          <div class="form-group">
            <label>Émoji du Pack :</label>
            <input type="text" id="packIcon" class="form-control" value="🎁" style="max-width: 100px;">
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px; background: #15803d;">
            <i class="fas fa-check"></i> Créer et Publier le Pack
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  recalcPackTotal() {
    let totalSum = 0;
    const checked = document.querySelectorAll('.pack-product-checkbox:checked');
    checked.forEach(cb => {
      totalSum += Number(cb.getAttribute('data-price')) || 0;
    });

    const sumText = document.getElementById('packCalculatedTotalText');
    if (sumText) sumText.textContent = `${totalSum} DH`;

    const rpInput = document.getElementById('packPriceRP');
    const origInput = document.getElementById('packOrigPrice');

    if (rpInput && (!rpInput.value || Number(rpInput.value) === 0 || Number(rpInput.dataset.auto) !== 0)) {
      rpInput.value = totalSum;
      this.autoCalcPackFromRP();
    }
    if (origInput) {
      origInput.value = totalSum;
    }
  }

  autoCalcPackFromRP() {
    const rpInput = document.getElementById('packPriceRP');
    const pmInput = document.getElementById('packPricePM');
    const pvInput = document.getElementById('packPV');
    const cvInput = document.getElementById('packSV');

    if (!rpInput) return;
    const pp = Number(rpInput.value) || 0;
    const pm = Math.round(pp * 0.90);
    const pv = Math.round(pp / 10);
    const cv = Math.round(pm * 0.60);

    if (pmInput) pmInput.value = pm;
    if (pvInput) pvInput.value = pv;
    if (cvInput) cvInput.value = cv;
  }

  handleAddPackSubmit(e) {
    e.preventDefault();

    const checkedBoxes = document.querySelectorAll('.pack-product-checkbox:checked');
    if (checkedBoxes.length === 0) {
      window.app.showToast('Veuillez sélectionner au moins un produit à inclure dans le pack.', 'warning');
      return;
    }

    const includedProducts = [];
    checkedBoxes.forEach(cb => {
      includedProducts.push(cb.getAttribute('data-product-id'));
    });

    const pp = Number(document.getElementById('packPriceRP').value) || 500;
    const pm = Number(document.getElementById('packPricePM').value) || Math.round(pp * 0.90);
    const pv = Number(document.getElementById('packPV').value) || Math.round(pp / 10);
    const cv = Number(document.getElementById('packSV').value) || Math.round(pm * 0.60);

    const isPromo = document.getElementById('packIsPromo').checked;
    const promoBadge = document.getElementById('packPromoBadge').value.trim() || 'PROMO';
    const origPrice = Number(document.getElementById('packOrigPrice').value) || pp;

    const packData = {
      name: document.getElementById('newPackName').value,
      category: 'Packs & Rituels',
      isPack: true,
      isPromo: isPromo,
      promoBadge: promoBadge,
      originalPriceRP: origPrice,
      includedProducts: includedProducts,
      badge: isPromo ? promoBadge : 'Pack Spécial',
      desc: document.getElementById('newPackDesc').value,
      priceRP_DH: pp,
      pricePM_DH: pm,
      pv: pv,
      sv: cv,
      stock: Number(document.getElementById('packStock').value) || 40,
      icon: document.getElementById('packIcon').value || '🎁'
    };

    window.stateManager.addProduct(packData);
    window.app.closeModal();
    window.app.showToast(`Nouveau pack « ${packData.name} » créé avec ${includedProducts.length} produits (Prix: ${pp} DH, PV: ${pv}) !`, 'success');
    window.app.renderAllViews();
  }

  showEditProductModal(productId) {
    const p = window.stateManager.getProductById(productId);
    if (!p) {
      window.app.showToast('Article introuvable.', 'error');
      return;
    }

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-edit" style="color: var(--rtn-rose);"></i> Modifier : ${p.name} (${p.id})`;

    const pp = p.priceRP_DH || 500;
    const pm = p.pricePM_DH || Math.round(pp * 0.9);
    const pv = p.pv || Math.round(pp / 10);
    const cv = p.sv || Math.round(pm * 0.6);
    const isPromo = Boolean(p.isPromo);
    const promoBadge = p.promoBadge || 'PROMO SPÉCIALE';
    const origPrice = p.originalPriceRP || (isPromo ? Math.round(pp * 1.25) : pp);

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleEditProductSubmit(event, '${p.id}')">
        <div class="form-group">
          <label>Nom du Produit ou Pack :</label>
          <input type="text" id="editProdName" class="form-control" value="${p.name.replace(/"/g, '&quot;')}" required>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Catégorie :</label>
            <select id="editProdCategory" class="form-control">
              <option value="Packs & Rituels" ${p.category === 'Packs & Rituels' || p.isPack ? 'selected' : ''}>Packs & Rituels Beauté</option>
              <option value="Soins Visage" ${p.category === 'Soins Visage' ? 'selected' : ''}>Soins Visage</option>
              <option value="Soins Anti-Âge" ${p.category === 'Soins Anti-Âge' ? 'selected' : ''}>Soins Anti-Âge</option>
              <option value="Nettoyants & Démaquillants" ${p.category === 'Nettoyants & Démaquillants' ? 'selected' : ''}>Nettoyants & Démaquillants</option>
              <option value="Soins Corps & Huiles" ${p.category === 'Soins Corps & Huiles' ? 'selected' : ''}>Soins Corps & Huiles</option>
            </select>
          </div>
          <div class="form-group">
            <label>Stock Disponible :</label>
            <input type="number" id="editProdStock" class="form-control" value="${p.stock || 50}" min="0" required>
          </div>
        </div>

        <div class="form-group">
          <label>Description :</label>
          <textarea id="editProdDesc" class="form-control" rows="2" required>${p.desc || ''}</textarea>
        </div>

        <!-- Section Prix & Réduction -->
        <div class="form-grid-2" style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1.5px solid #86efac; margin-bottom: 14px;">
          <div class="form-group" style="margin: 0;">
            <label style="color: #166534; font-weight: 700;">Prix Public Vente (PP en DH) :</label>
            <input type="number" id="editProdPriceRP" class="form-control" value="${pp}" min="10" required oninput="document.getElementById('editProdPricePM').value = Math.round(this.value * 0.9);">
            <small style="color: #15803d;">Prix de vente aux clients</small>
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="color: #166534; font-weight: 700;">Prix Membre (90% PP) :</label>
            <input type="number" id="editProdPricePM" class="form-control" value="${pm}" min="10" required>
            <small style="color: #15803d;">Prix payé par les membres</small>
          </div>
        </div>

        <!-- Section Promotionnelle (Activer / Désactiver Promotion, Prix barré, Badge) -->
        <div style="background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px;">
          <label style="color: #be185d; font-weight: 800; font-size: 0.88rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <input type="checkbox" id="editProdIsPromo" ${isPromo ? 'checked' : ''} onchange="document.getElementById('editPromoFields').style.display = this.checked ? 'grid' : 'none'">
            🔥 Mettre cet article / pack en Promotion
          </label>
          <div id="editPromoFields" style="display: ${isPromo ? 'grid' : 'none'}; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.76rem; color: #9f1239;">Badge Promotionnel :</label>
              <input type="text" id="editProdPromoBadge" class="form-control" value="${promoBadge}" placeholder="Ex: PROMO SPÉCIALE">
            </div>
            <div class="form-group" style="margin: 0;">
              <label style="font-size: 0.76rem; color: #9f1239;">Prix d'origine barré (DH) :</label>
              <input type="number" id="editProdOrigPrice" class="form-control" value="${origPrice}" placeholder="Prix barré">
            </div>
          </div>
          <small style="display:block; color: #9f1239; font-size: 0.72rem; margin-top: 6px;">
            Conseil : Vous pouvez baisser le prix et augmenter les points pour rendre le pack attractif.
          </small>
        </div>

        <!-- Points PV et Base CV -->
        <div class="form-grid-2" style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 14px; border: 1.5px solid #e2e8f0;">
          <div class="form-group" style="margin: 0;">
            <label style="color: var(--rtn-rose-dark); font-weight: 700;">Points PV (Activité / Volume) :</label>
            <input type="number" id="editProdPV" class="form-control" value="${pv}" min="1" step="1" required style="font-weight: 700; font-size: 1.05rem;">
            <small style="color: #64748b;">Augmentez les PV pour les promos</small>
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="color: #be185d; font-weight: 700;">Base CV Commissions (60% PM) :</label>
            <input type="number" id="editProdSV" class="form-control" value="${cv}" min="1" step="1" required style="font-weight: 800; font-size: 1.05rem; border: 2px solid #f472b6;">
            <small style="color: #64748b;">Base de calcul des primes réseau</small>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px;">
            <i class="fas fa-save"></i> Enregistrer les Modifications
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleEditProductSubmit(e, productId) {
    e.preventDefault();
    const isPromo = document.getElementById('editProdIsPromo').checked;
    const pp = Number(document.getElementById('editProdPriceRP').value);
    const pm = Number(document.getElementById('editProdPricePM').value);
    const pv = Number(document.getElementById('editProdPV').value);
    const cv = Number(document.getElementById('editProdSV').value);
    const promoBadge = document.getElementById('editProdPromoBadge') ? document.getElementById('editProdPromoBadge').value.trim() : 'PROMO';
    const origPrice = Number(document.getElementById('editProdOrigPrice') ? document.getElementById('editProdOrigPrice').value : pp);

    const updatedData = {
      name: document.getElementById('editProdName').value.trim(),
      category: document.getElementById('editProdCategory').value,
      desc: document.getElementById('editProdDesc').value.trim(),
      stock: Number(document.getElementById('editProdStock').value) || 50,
      priceRP_DH: pp,
      pricePM_DH: pm,
      pv: pv,
      sv: cv,
      isPromo: isPromo,
      promoBadge: isPromo ? promoBadge : '',
      originalPriceRP: isPromo ? origPrice : pp
    };

    window.stateManager.updateProduct(productId, updatedData);
    window.app.closeModal();
    window.app.showToast(`Article « ${updatedData.name} » mis à jour avec succès !`, 'success');
    this.render();
    window.app.renderAllViews();
  }

  handleDuplicateProduct(productId) {
    const res = window.stateManager.duplicateProduct(productId);
    if (res.success) {
      window.app.showToast(`Article dupliqué avec succès : ${res.product.name} (${res.product.id})`, 'success');
      this.render();
      window.app.renderAllViews();
    } else {
      window.app.showToast(res.message || 'Erreur duplication', 'error');
    }
  }

  handleDeleteProduct(productId) {
    if (confirm('Voulez-vous vraiment retirer cet article du catalogue Routini ?')) {
      window.stateManager.deleteProduct(productId);
      window.app.showToast('Article supprimé du catalogue.', 'success');
      this.render();
      window.app.renderAllViews();
    }
  }

  showAdjustPointsModal(memberCode) {
    const member = window.stateManager.getMemberByCode(memberCode);
    if (!member) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-coins" style="color: var(--rtn-gold);"></i> Ajustement Direction : ${member.name}`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleAdjustSubmit(event, '${member.code}')">
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 0.85rem;">
          Membre : <strong>${member.name}</strong> (${member.code})<br>
          Grade : <strong>${member.rankName || member.rankCode}</strong> • Solde actuel : <strong>${window.stateManager.formatMoney(member.walletDH || 0)}</strong>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Créditer des Points Personnels (PV) :</label>
            <input type="number" id="adjPV" class="form-control" value="0" step="10">
          </div>
          <div class="form-group">
            <label>Créditer de la Base Commissions (CV) :</label>
            <input type="number" id="adjSV" class="form-control" value="0" step="50">
          </div>
        </div>

        <div class="form-group">
          <label>Ajuster le Solde E-Point Cash (DH) :</label>
          <input type="number" id="adjWallet" class="form-control" value="0" step="100" placeholder="+/- DH">
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px;">
            <i class="fas fa-check"></i> Valider les Ajustements
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleAdjustSubmit(e, memberCode) {
    e.preventDefault();
    const addPV = Number(document.getElementById('adjPV').value) || 0;
    const addSV = Number(document.getElementById('adjSV').value) || 0;
    const addWallet = Number(document.getElementById('adjWallet').value) || 0;

    if (addPV !== 0 || addSV !== 0) {
      window.stateManager.injectPoints(memberCode, addPV, addSV);
    }
    if (addWallet !== 0) {
      window.stateManager.creditWallet(memberCode, addWallet);
    }

    window.app.closeModal();
    window.app.showToast(`Ajustements appliqués au compte ${memberCode} avec succès.`, 'success');
    window.app.renderAllViews();
  }

  showChangeRankModal(memberCode) {
    const member = window.stateManager.getMemberByCode(memberCode);
    if (!member) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-graduation-cap" style="color: #0284c7;"></i> Modification de Grade : ${member.name}`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleChangeRankSubmit(event, '${member.code}')">
        <div class="form-group">
          <label>Nouveau Grade à Attribuer (Barème V4) :</label>
          <select id="newRankSelect" class="form-control">
            ${window.stateManager.grades.map(g => `
              <option value="${g.code}" ${member.rankCode === g.code ? 'selected' : ''}>
                ${g.name} (Min perso: ${g.minPersonalPV} PV • Leadership: ${(g.leadershipRate * 100).toFixed(0)}%)
              </option>
            `).join('')}
          </select>
        </div>

        <div style="font-size: 0.8rem; color: #64748b; margin-top: 10px; line-height: 1.6;">
          <em>Note Direction : La modification manuelle du grade force le niveau d'accès N1/N2/N3 et le taux différentiel Leadership sans rétrogradation automatique.</em>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px;">
            <i class="fas fa-check"></i> Enregistrer le Nouveau Grade
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleChangeRankSubmit(e, memberCode) {
    e.preventDefault();
    const newRank = document.getElementById('newRankSelect').value;
    window.stateManager.updateMemberRank(memberCode, newRank);
    window.app.closeModal();
    window.app.showToast(`Grade mis à jour avec succès pour le partenaire ${memberCode}.`, 'success');
    window.app.renderAllViews();
  }
}

window.adminController = new AdminController();
