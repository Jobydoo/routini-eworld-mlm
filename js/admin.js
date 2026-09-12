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
      <div class="admin-badge-ribbon" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
        <div>
          <h3 style="color: #fff;"><i class="fas fa-crown" style="color: var(--rtn-gold);"></i> Direction Générale Routini — Contrôle Central ONE PLAN V4</h3>
          <p style="color: #cbd5e1;">Gestion du catalogue (PM 90%, PV PP/10, CV 60%), solidité financière (Slide 15/16) et supervision du réseau.</p>
        </div>
        <span class="status-badge" style="background: #15803d; color: #fff; font-size: 0.82rem; font-weight: 700;">
          <i class="fas fa-shield-alt"></i> Accès Fondateur Sécurisé
        </span>
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
            <button class="btn-primary-auth" style="width: auto; padding: 8px 16px; font-size: 0.85rem;" onclick="window.adminController.showAddProductModal()">
              <i class="fas fa-plus"></i> Créer Nouveau Produit
            </button>
          </div>
        </div>

        <div style="display: flex; gap: 8px; padding: 10px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <button class="filter-pill ${this.productFilter === 'ALL' ? 'active' : ''}" onclick="window.adminController.setProductFilter('ALL')">Tous (${window.stateManager.products.length})</button>
          <button class="filter-pill ${this.productFilter === 'PACKS' ? 'active' : ''}" onclick="window.adminController.setProductFilter('PACKS')">Packs & Rituels</button>
          <button class="filter-pill ${this.productFilter === 'SOLO' ? 'active' : ''}" onclick="window.adminController.setProductFilter('SOLO')">Soins Individuels</button>
        </div>

        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Soin ou Pack Routine</th>
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
                          ${p.badge ? `<span style="font-size: 0.68rem; background: #be185d; color: #fff; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">${p.badge}</span>` : ''}
                        </div>
                      </div>
                    </td>
                    <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${p.category}</span></td>
                    <td><strong>${pp} DH</strong></td>
                    <td style="color: #15803d; font-weight: 700;">${pm} DH</td>
                    <td><strong style="color: var(--rtn-rose);">${pv} PV</strong></td>
                    <td style="background: #fff1f2; font-weight: 800; color: #be185d;">
                      ${cv} CV
                    </td>
                    <td>${p.stock}</td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn-switch-account" style="padding: 4px 8px; font-size: 0.75rem;" onclick="window.adminController.showEditProductModal('${p.id}')">
                          <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button class="btn-switch-account" style="color: #dc2626; border-color: #fca5a5; padding: 4px 8px;" title="Supprimer" onclick="window.adminController.handleDeleteProduct('${p.id}')">
                          <i class="fas fa-trash-alt"></i>
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

    modalTitle.innerHTML = `<i class="fas fa-edit" style="color: var(--rtn-rose);"></i> Modifier les Barèmes V4 : ${prod.name}`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleEditProductSubmit(event, '${prod.id}')">
        <div style="background: #fdf2f8; border-left: 4px solid var(--rtn-rose); padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 0.85rem;">
          <strong>Règles Officielles V4 :</strong><br>
          En saisissant le <strong>Prix Public (PP)</strong>, le Prix Membre (90%), les PV (PP/10) et la base CV (60% PM) se calculent automatiquement. Vous pouvez aussi ajuster manuellement chaque valeur.
        </div>

        <div class="form-group">
          <label>Nom de l'Article :</label>
          <input type="text" id="editProdName" class="form-control" value="${prod.name}" required>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Type & Catégorie :</label>
            <select id="editProdCategory" class="form-control">
              <option value="Packs & Rituels" ${prod.category === 'Packs & Rituels' ? 'selected' : ''}>🎁 Packs & Rituels Beauté</option>
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

        <div class="form-group">
          <label>Description du Soin / Pack :</label>
          <textarea id="editProdDesc" class="form-control" rows="2" required>${prod.desc || ''}</textarea>
        </div>

        <!-- Ligne Prix Public PP -->
        <div class="form-grid-2" style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1.5px solid #86efac; margin-bottom: 14px;">
          <div class="form-group" style="margin: 0;">
            <label style="color: #166534; font-weight: 700;">Prix Public PP (DH) :</label>
            <input type="number" id="editProdRP" class="form-control" value="${pp}" min="10" required oninput="window.adminController.autoCalcV4('edit')">
            <small style="color: #15803d;">Prix de vente au détail recommandé</small>
          </div>

          <div class="form-group" style="margin: 0;">
            <label style="color: #166534; font-weight: 700;">Prix Membre PM (90% PP) :</label>
            <input type="number" id="editProdPM" class="form-control" value="${pm}" min="10" required>
            <small style="color: #15803d;">Prix payé par les membres (-10% remise)</small>
          </div>
        </div>

        <!-- Ligne PV et CV -->
        <div class="form-grid-2" style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 14px; border: 1.5px solid #e2e8f0;">
          <div class="form-group" style="margin: 0;">
            <label style="color: var(--rtn-rose-dark); font-weight: 700;">Points PV (PP ÷ 10) :</label>
            <input type="number" id="editProdPV" class="form-control" value="${pv}" min="1" step="1" required style="font-weight: 700; font-size: 1.05rem;">
            <small style="color: #64748b;">Mesure l'activité & qualification grade</small>
          </div>

          <div class="form-group" style="margin: 0;">
            <label style="color: #be185d; font-weight: 700;">Base CV (60% PM) :</label>
            <input type="number" id="editProdSV" class="form-control" value="${cv}" min="1" step="1" required style="font-weight: 800; font-size: 1.05rem; border: 2px solid #f43f5e;">
            <small style="color: #64748b;">Base de calcul des commissions N1/N2/N3/Leadership</small>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Stock Disponible :</label>
            <input type="number" id="editProdStock" class="form-control" value="${prod.stock || 50}" min="0" required>
          </div>
          <div class="form-group">
            <label>Icône / Émoji :</label>
            <input type="text" id="editProdIcon" class="form-control" value="${prod.icon || '✨'}" style="max-width: 100px;">
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px; background: #be185d;">
            <i class="fas fa-save"></i> Enregistrer les Modifications V4
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

    const pp = Number(document.getElementById('editProdRP').value) || 500;
    const pm = Number(document.getElementById('editProdPM').value) || Math.round(pp * 0.90);
    const pv = Number(document.getElementById('editProdPV').value) || Math.round(pp / 10);
    const cv = Number(document.getElementById('editProdSV').value) || Math.round(pm * 0.60);

    const updatedData = {
      name: document.getElementById('editProdName').value,
      category: category,
      isPack: isPack,
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
    window.app.showToast(`Article mis à jour selon ONE PLAN V4 (PP: ${pp} DH, PM: ${pm} DH, PV: ${pv}, CV: ${cv}) !`, 'success');
    window.app.renderAllViews();
  }

  showAddProductModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-plus-circle" style="color: #15803d;"></i> Créer un Nouveau Soin ou Pack Routini V4`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleAddProductSubmit(event)">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Type d'article :</label>
            <select id="newProdType" class="form-control">
              <option value="pack">🎁 Pack Routine Cosmétique (Rituel / Starter)</option>
              <option value="solo" selected>✨ Soin Individuel (Crème, Sérum, Huile...)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Catégorie :</label>
            <select id="newProdCategory" class="form-control">
              <option value="Soins Visage">✨ Soins Visage</option>
              <option value="Packs & Rituels">🎁 Packs & Rituels</option>
              <option value="Anti-Âge">🌙 Anti-Âge & Nuit</option>
              <option value="Huiles Précieuses">🌹 Huiles Précieuses</option>
              <option value="Soins Corps">🧴 Soins Corps</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Nom de l'Article :</label>
          <input type="text" id="newProdName" class="form-control" placeholder="Ex: Sérum Niacinamide 10% & Zinc" required>
        </div>

        <div class="form-group">
          <label>Description :</label>
          <textarea id="newProdDesc" class="form-control" rows="2" placeholder="Bienfaits, principes actifs..." required></textarea>
        </div>

        <div class="form-grid-2" style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1.5px solid #86efac; margin-bottom: 14px;">
          <div class="form-group" style="margin:0;">
            <label style="color: #166534; font-weight:700;">Prix Public PP (DH) :</label>
            <input type="number" id="newProdRP" class="form-control" value="500" min="10" required oninput="window.adminController.autoCalcV4('new')">
          </div>
          <div class="form-group" style="margin:0;">
            <label style="color: #166534; font-weight:700;">Prix Membre PM (90% PP) :</label>
            <input type="number" id="newProdPM" class="form-control" value="450" min="10" required>
          </div>
        </div>

        <div class="form-grid-2" style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 14px; border: 1.5px solid #e2e8f0;">
          <div class="form-group" style="margin:0;">
            <label style="color: var(--rtn-rose-dark); font-weight:700;">Points PV (PP ÷ 10) :</label>
            <input type="number" id="newProdPV" class="form-control" value="50" min="1" required>
          </div>
          <div class="form-group" style="margin:0;">
            <label style="color: #be185d; font-weight:700;">Base CV (60% PM) :</label>
            <input type="number" id="newProdSV" class="form-control" value="270" min="1" required style="border: 2px solid #f43f5e;">
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Stock Initial :</label>
            <input type="number" id="newProdStock" class="form-control" value="60" min="1" required>
          </div>
          <div class="form-group">
            <label>Émoji / Icône :</label>
            <input type="text" id="newProdIcon" class="form-control" value="✨" style="max-width: 100px;">
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px;">
            <i class="fas fa-check"></i> Créer et Publier dans la Boutique
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleAddProductSubmit(e) {
    e.preventDefault();

    const category = document.getElementById('newProdCategory').value;
    const isPack = document.getElementById('newProdType').value === 'pack' || category === 'Packs & Rituels';

    const pp = Number(document.getElementById('newProdRP').value) || 500;
    const pm = Number(document.getElementById('newProdPM').value) || Math.round(pp * 0.90);
    const pv = Number(document.getElementById('newProdPV').value) || Math.round(pp / 10);
    const cv = Number(document.getElementById('newProdSV').value) || Math.round(pm * 0.60);

    const productData = {
      name: document.getElementById('newProdName').value,
      category: category,
      isPack: isPack,
      badge: isPack ? 'Pack Spécial' : 'Nouveau',
      desc: document.getElementById('newProdDesc').value,
      priceRP_DH: pp,
      pricePM_DH: pm,
      pv: pv,
      sv: cv,
      stock: Number(document.getElementById('newProdStock').value) || 60,
      icon: document.getElementById('newProdIcon').value || (isPack ? '🎁' : '✨')
    };

    window.stateManager.addProduct(productData);
    window.app.closeModal();
    window.app.showToast(`Nouveau soin « ${productData.name} » ajouté au catalogue officiel !`, 'success');
    window.app.renderAllViews();
  }

  handleDeleteProduct(productId) {
    if (confirm('Voulez-vous vraiment retirer cet article du catalogue Routini ?')) {
      window.stateManager.deleteProduct(productId);
      window.app.showToast('Article supprimé du catalogue.', 'success');
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
