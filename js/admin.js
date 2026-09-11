/**
 * Routini eWorld MLM - Direction Générale (Console Super Admin)
 * Modèle : ROUTINE ONE PLAN (23 Slides Officielles)
 * 
 * Fonctionnalités Administrateur :
 * 1. Gestion Complète des Soins & Packs Routines (Modification du SV/CV, PV, Prix, Stock)
 * 2. Contrôle de Solidité Financière (Stress Test Slide 19 & 23, Marge Contributive, Plafond Cash <= 22%)
 * 3. Gestion du Réseau des 6 Grades (Partner, Builder 1%, Leader 2%, Manager 3%, Diamond 5%, Ambassador 7%)
 * 4. Ajustements Manuels : PV/SV, Grades, Portefeuille E-Point
 */

class AdminController {
  constructor() {
    this.searchMemberQuery = '';
    this.productFilter = 'ALL'; // 'ALL', 'PACKS', 'SOLO'
    this.searchProductQuery = '';
    this.stressTestOrderDH = 500;
    this.stressTestCV = 225;
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

    // Calculs du Stress Test (Slide 19)
    const commVendeurDH = Math.round(this.stressTestOrderDH * 0.10);
    const n1DH = Number((this.stressTestCV * 0.10).toFixed(2));
    const n2DH = Number((this.stressTestCV * 0.05).toFixed(2));
    const n3DH = Number((this.stressTestCV * 0.03).toFixed(2));
    const totalPayoutDH = Number((commVendeurDH + n1DH + n2DH + n3DH).toFixed(2));
    const payoutPercent = ((totalPayoutDH / this.stressTestOrderDH) * 100).toFixed(1);
    const isSafe = payoutPercent <= 22.0;

    container.innerHTML = `
      <!-- En-tête Principal de Direction -->
      <div class="admin-badge-ribbon" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
        <div>
          <h3 style="color: #fff;"><i class="fas fa-crown" style="color: var(--rtn-gold);"></i> Direction Générale Routini — Contrôle Central ONE PLAN</h3>
          <p style="color: #cbd5e1;">Gestion du catalogue, barème SV/CV dynamique, solidité financière (Slide 19/23) et supervision du réseau.</p>
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
            <span class="metric-title">Volume Mondial (PV)</span>
            <div class="metric-icon"><i class="fas fa-cubes"></i></div>
          </div>
          <div class="metric-value">${stats.totalTurnoverPV.toLocaleString('fr-FR')} PV</div>
          <div class="metric-meta">Qualification des 6 grades</div>
        </div>

        <div class="metric-card card-sv">
          <div class="metric-header">
            <span class="metric-title">Base Commissions (SV / CV)</span>
            <div class="metric-icon"><i class="fas fa-percentage"></i></div>
          </div>
          <div class="metric-value">${stats.totalTurnoverSV.toLocaleString('fr-FR')} CV</div>
          <div class="metric-meta">Outil de sécurité financière (Slide 21)</div>
        </div>

        <div class="metric-card card-wallet">
          <div class="metric-header">
            <span class="metric-title">Catalogue Articles</span>
            <div class="metric-icon"><i class="fas fa-boxes"></i></div>
          </div>
          <div class="metric-value">${stats.totalProducts} Références</div>
          <div class="metric-meta">${stats.totalPacks} Packs Routines • ${stats.totalProducts - stats.totalPacks} Soins Solo</div>
        </div>
      </div>

      <!-- SECTION 1 : GESTION DES PRODUITS & PACKS AVEC SV/CV MODIFIABLE -->
      <div class="data-table-card" style="margin-bottom: 28px; border-top: 4px solid var(--rtn-gold);">
        <div class="table-header-bar" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-tags" style="color: var(--rtn-rose);"></i>
              Catalogue des Soins & Packs Routines (SV/CV & PV Modifiables)
            </h3>
            <p style="font-size: 0.8rem; color: #64748b;">
              L'Administrateur peut ajuster directement le <strong>SV (Commission Volume)</strong>, les <strong>PV</strong>, les prix et les stocks de chaque soin ou pack.
            </p>
          </div>
          
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <div class="search-box" style="min-width: 220px;">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Rechercher soin ou pack..." value="${this.searchProductQuery}" oninput="window.adminController.setProductSearch(this.value)">
            </div>

            <button class="btn-primary-auth" style="width: auto; padding: 9px 20px; background: #15803d;" onclick="window.adminController.showAddProductModal()">
              <i class="fas fa-plus-circle"></i> Ajouter Soin / Pack
            </button>
          </div>
        </div>

        <!-- Onglets Filtres : Tous / Packs Seuls / Soins Individuels -->
        <div style="display: flex; gap: 8px; padding: 12px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap;">
          <button class="filter-pill ${this.productFilter === 'ALL' ? 'active' : ''}" onclick="window.adminController.setProductFilter('ALL')">
            Tous les Articles (${window.stateManager.products.length})
          </button>
          <button class="filter-pill ${this.productFilter === 'PACKS' ? 'active' : ''}" style="border: 1px solid #f59e0b; color: #b45309; font-weight: 700;" onclick="window.adminController.setProductFilter('PACKS')">
            🎁 Packs & Rituels Routines (${stats.totalPacks})
          </button>
          <button class="filter-pill ${this.productFilter === 'SOLO' ? 'active' : ''}" onclick="window.adminController.setProductFilter('SOLO')">
            ✨ Soins Solo (${stats.totalProducts - stats.totalPacks})
          </button>
        </div>

        <!-- Table des Produits avec SV/CV en évidence -->
        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Réf.</th>
                <th>Type</th>
                <th>Nom du Soin / Pack</th>
                <th>Catégorie</th>
                <th>Prix Partenaire (DP)</th>
                <th>Prix Public (RP)</th>
                <th style="background: #f1f5f9; color: var(--rtn-rose-dark);">Points (PV)</th>
                <th style="background: #fdf2f8; color: #be185d;">Valeur Vente (SV / CV)</th>
                <th>Stock</th>
                <th>Action Admin</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td><span style="font-family: monospace; font-weight:700; color: #475569;">${p.id}</span></td>
                  <td>
                    ${p.isPack || p.category === 'Packs & Rituels'
                      ? '<span class="status-badge" style="background:#fef3c7; color:#b45309; font-weight:700;"><i class="fas fa-box-open"></i> PACK</span>' 
                      : '<span class="status-badge" style="background:#e0f2fe; color:#0369a1;"><i class="fas fa-flask"></i> SOIN</span>'
                    }
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 1.25rem;">${p.icon || '💄'}</span>
                      <div>
                        <strong>${p.name}</strong>
                        ${p.badge ? `<span style="font-size: 0.68rem; background: var(--rtn-rose-light); color: var(--rtn-rose-dark); padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: 600;">${p.badge}</span>` : ''}
                      </div>
                    </div>
                  </td>
                  <td><small style="color: #64748b;">${p.category}</small></td>
                  <td><strong>${window.stateManager.formatMoney(p.priceDP_DH)}</strong></td>
                  <td><span style="color: #64748b;">${window.stateManager.formatMoney(p.priceRP_DH)}</span></td>
                  <td style="background: #f8fafc;">
                    <span class="product-badge-pv" style="display:inline-block; font-size: 0.85rem; padding: 3px 8px;">${p.pv} PV</span>
                  </td>
                  <td style="background: #fff1f2;">
                    <span class="product-badge-sv" style="display:inline-block; font-size: 0.88rem; padding: 4px 10px; font-weight: 800; background: #be185d; color: #fff;">
                      ${p.sv} SV/CV
                    </span>
                  </td>
                  <td>
                    <span style="font-size: 0.85rem; font-weight: 600; color: ${p.stock < 30 ? '#ef4444' : '#15803d'};">
                      ${p.stock} unités
                    </span>
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <button class="btn-switch-account" style="color: #be185d; border-color: #fca5a5; font-weight: 700;" title="Modifier le SV et PV" onclick="window.adminController.showEditProductModal('${p.id}')">
                        <i class="fas fa-edit"></i> Modifier SV/PV
                      </button>
                      <button class="btn-switch-account" style="color: #dc2626; border-color: #fca5a5;" title="Supprimer" onclick="window.adminController.handleDeleteProduct('${p.id}')">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION 2 : STRESS TEST CV & FORMULE DE MARGE CONTRIBUTIVE (Slide 19 & 23) -->
      <div class="data-table-card" style="margin-bottom: 28px; background: #fdfdfd; border-left: 5px solid #15803d;">
        <div class="table-header-bar" style="flex-wrap: wrap;">
          <div>
            <h3 style="display:flex; align-items:center; gap:8px; color:#14532d;">
              <i class="fas fa-balance-scale" style="color: #15803d;"></i>
              Stress Test Financier & Plafond de Payout Cash (Slide 19 & 23)
            </h3>
            <p style="font-size: 0.8rem; color: #64748b;">
              Vérification de sécurité : le payout total cash (Vendeur 10% + N1 10% CV + N2 5% CV + N3 3% CV) doit rester inférieur au plafond cible de <strong>22 % du CA</strong> pour préserver la marge Routini.
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; padding: 18px 20px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; color: #0f172a;">Simulateur de Commande Test (Slide 19)</h4>
            <div class="form-group" style="margin-bottom: 10px;">
              <label style="font-size: 0.78rem;">Montant Commande Client (DH) :</label>
              <input type="number" id="stressOrderInput" class="form-control" value="${this.stressTestOrderDH}" oninput="window.adminController.updateStressTest()">
            </div>
            <div class="form-group" style="margin-bottom: 10px;">
              <label style="font-size: 0.78rem;">CV Assigné aux Produits (en CV) :</label>
              <input type="number" id="stressCVInput" class="form-control" value="${this.stressTestCV}" oninput="window.adminController.updateStressTest()">
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; color: #0f172a;">Répartition des Flux de Commissions</h4>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 4px 0;">
              <span>Commission Vendeur (10% CA) :</span>
              <strong>${commVendeurDH.toFixed(2)} DH</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 4px 0;">
              <span>N1 Réseau (10% CV) :</span>
              <strong>${n1DH.toFixed(2)} DH</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 4px 0;">
              <span>N2 Réseau (5% CV) :</span>
              <strong>${n2DH.toFixed(2)} DH</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 4px 0;">
              <span>N3 Réseau (3% CV) :</span>
              <strong>${n3DH.toFixed(2)} DH</strong>
            </div>
            <div style="border-top: 1.5px solid #cbd5e1; margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between; font-size: 0.95rem;">
              <strong style="color: #0f172a;">Total Payout Cash :</strong>
              <strong style="color: ${isSafe ? '#15803d' : '#ef4444'}; font-size: 1.1rem;">
                ${totalPayoutDH.toFixed(2)} DH (${payoutPercent}% du CA)
              </strong>
            </div>
            <div style="margin-top: 6px; font-size: 0.75rem; color: ${isSafe ? '#15803d' : '#ef4444'}; font-weight: 700;">
              ${isSafe ? '✓ Sécurité Validée (inférieur ou égal au plafond cible de 22%)' : '⚠ ALERTE : Le CV est trop élevé et dépasse le plafond de 22% ! Réduire le CV.'}
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 3 : GESTION DES DISTRIBUTEURS & DES 6 GRADES ROUTINE ONE PLAN -->
      <div class="data-table-card">
        <div class="table-header-bar" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-users" style="color: var(--rtn-navy);"></i>
              Réseau Partenaires & 6 Grades Routine ONE PLAN (${members.length} enregistrés)
            </h3>
            <p style="font-size: 0.78rem; color: #64748b;">
              Grades officiels : Partner • Builder (1%) • Leader (2%) • Manager (3%) • Diamond (5%) • Ambassador (7%)
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
                <th>Parrain</th>
                <th>Points Perso (PPV)</th>
                <th>Volume Équipe</th>
                <th>Solde E-Point</th>
                <th>Actions Direction</th>
              </tr>
            </thead>
            <tbody>
              ${members.map(m => `
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
                  <td>${m.sponsorName || 'Siège Routini'}</td>
                  <td><strong style="color:var(--rtn-rose);">${m.ppv || 0} PV</strong></td>
                  <td><strong style="color:#15803d;">${(m.teamPV || m.gpv || 0).toLocaleString('fr-FR')} PV</strong></td>
                  <td><strong style="color:#b45309;">${window.stateManager.formatMoney(m.walletDH || 0)}</strong></td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <button class="btn-switch-account" style="color: var(--rtn-rose); border-color: #cbd5e1;" title="Injecter des points" onclick="window.adminController.showInjectPointsModal('${m.code}')">
                        <i class="fas fa-plus"></i> PV/SV
                      </button>
                      <button class="btn-switch-account" style="color: #b45309; border-color: #cbd5e1;" title="Modifier le rang" onclick="window.adminController.showEditRankModal('${m.code}')">
                        <i class="fas fa-award"></i> Grade
                      </button>
                      <button class="btn-switch-account" style="color: #15803d; border-color: #cbd5e1;" title="Ajuster E-Point" onclick="window.adminController.showAdjustWalletModal('${m.code}')">
                        <i class="fas fa-coins"></i> Solde
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Actions Générales Système -->
      <div class="admin-actions-bar" style="margin-top: 24px;">
        <button class="btn-admin-action btn-admin-secondary" onclick="window.adminController.handleMonthlyBonusRun()">
          <i class="fas fa-calculator"></i> Exécuter la Clôture Mensuelle des Primes (ONE PLAN)
        </button>
        <button class="btn-admin-action btn-admin-secondary" onclick="window.adminController.exportDataJSON()">
          <i class="fas fa-file-export"></i> Exporter les Données (JSON)
        </button>
        <button class="btn-admin-action btn-admin-secondary" style="color: var(--rtn-rose-dark);" onclick="window.adminController.handleResetSystem()">
          <i class="fas fa-redo-alt"></i> Réinitialiser Données Démo
        </button>
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

  // --- MODALE MODIFICATION D'UN PRODUIT OU PACK (SV/CV, PV, PRIX) ---
  showEditProductModal(productId) {
    const prod = window.stateManager.getProductById(productId);
    if (!prod) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-edit" style="color: var(--rtn-rose);"></i> Modifier les Barèmes : ${prod.name}`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleEditProductSubmit(event, '${prod.id}')">
        <div style="background: #fdf2f8; border-left: 4px solid var(--rtn-rose); padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 0.85rem;">
          <strong>Contrôle Administrateur Routini :</strong><br>
          Vous pouvez modifier le <strong>SV (Commission Volume)</strong> qui sert de base au calcul des 10%, 5%, 3% et Leadership, ainsi que les <strong>PV</strong> de qualification.
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
              <option value="Nettoyants" ${prod.category === 'Nettoyants' ? 'selected' : ''}>💧 Nettoyants</option>
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

        <div class="form-grid-2" style="background: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 14px; border: 1.5px solid #e2e8f0;">
          <div class="form-group">
            <label style="color: var(--rtn-rose-dark); font-weight: 700;">Points Valeur (PV Qualification) :</label>
            <input type="number" id="editProdPV" class="form-control" value="${prod.pv}" min="1" step="1" required style="font-weight: 700; font-size: 1.05rem;">
            <small style="color: #64748b;">Mesure l'activité & qualification grade</small>
          </div>

          <div class="form-group">
            <label style="color: #be185d; font-weight: 700;">Valeur Vente (SV / CV Commissions) :</label>
            <input type="number" id="editProdSV" class="form-control" value="${prod.sv}" min="1" step="1" required style="font-weight: 800; font-size: 1.05rem; border: 2px solid #f43f5e;">
            <small style="color: #64748b;">Base de calcul des bonus d'équipe (N1/N2/N3/Leadership)</small>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Prix Partenaire DP (DH) :</label>
            <input type="number" id="editProdDP" class="form-control" value="${prod.priceDP_DH}" min="10" required>
          </div>

          <div class="form-group">
            <label>Prix Vente Public RP (DH) :</label>
            <input type="number" id="editProdRP" class="form-control" value="${prod.priceRP_DH}" min="10" required>
          </div>

          <div class="form-group">
            <label>Stock Disponible :</label>
            <input type="number" id="editProdStock" class="form-control" value="${prod.stock || 50}" min="0" required>
          </div>
        </div>

        <div class="form-group">
          <label>Icône / Émoji :</label>
          <input type="text" id="editProdIcon" class="form-control" value="${prod.icon || '✨'}" style="max-width: 100px;">
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px; background: #be185d;">
            <i class="fas fa-save"></i> Enregistrer les Modifications (SV/PV)
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleEditProductSubmit(e, productId) {
    e.preventDefault();

    const category = document.getElementById('editProdCategory').value;
    const isPack = category === 'Packs & Rituels';

    const updatedData = {
      name: document.getElementById('editProdName').value,
      category: category,
      isPack: isPack,
      badge: document.getElementById('editProdBadge').value,
      desc: document.getElementById('editProdDesc').value,
      pv: document.getElementById('editProdPV').value,
      sv: document.getElementById('editProdSV').value,
      priceDP_DH: document.getElementById('editProdDP').value,
      priceRP_DH: document.getElementById('editProdRP').value,
      stock: document.getElementById('editProdStock').value,
      icon: document.getElementById('editProdIcon').value || (isPack ? '🎁' : '✨')
    };

    window.stateManager.updateProduct(productId, updatedData);
    window.app.closeModal();
    window.app.showToast(`Article mis à jour ! SV fixé à ${updatedData.sv} et PV à ${updatedData.pv}.`, 'success');
    window.app.renderAllViews();
  }

  // --- MODALE AJOUT DE PRODUIT OU PACK ---
  showAddProductModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-plus-circle" style="color: #15803d;"></i> Créer un Nouveau Soin ou Pack Routini`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleAddProductSubmit(event)">
        <div class="form-grid-2">
          <div class="form-group">
            <label>Type d'article :</label>
            <select id="newProdType" class="form-control" onchange="window.adminController.toggleTypeHelp(this.value)">
              <option value="pack">🎁 Pack Routine Cosmétique (Rituel / Starter)</option>
              <option value="solo">✨ Soin Individuel (Crème, Sérum, Huile...)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Catégorie :</label>
            <select id="newProdCategory" class="form-control">
              <option value="Packs & Rituels">🎁 Packs & Rituels</option>
              <option value="Soins Visage">✨ Soins Visage</option>
              <option value="Anti-Âge">🌙 Anti-Âge & Nuit</option>
              <option value="Huiles Précieuses">🌹 Huiles Précieuses</option>
              <option value="Soins Corps">🧴 Soins Corps</option>
              <option value="Nettoyants">💧 Nettoyants & Démaquillants</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Nom du Produit ou Pack :</label>
          <input type="text" id="newProdName" class="form-control" placeholder="Ex: Pack Routine Éclat Impérial Argan & Rose" required>
        </div>

        <div class="form-group">
          <label>Description & Contenu :</label>
          <textarea id="newProdDesc" class="form-control" rows="2" placeholder="Détail des soins inclus, actifs et bienfaits..." required></textarea>
        </div>

        <div class="form-grid-2" style="background: #fdf2f8; padding: 14px; border-radius: 8px; margin-bottom: 14px; border: 1.5px solid var(--rtn-rose-light);">
          <div class="form-group">
            <label style="color: var(--rtn-rose-dark); font-weight: 700;">Points Valeur (PV Qualification) :</label>
            <input type="number" id="newProdPV" class="form-control" value="100" min="1" required style="font-weight:700;">
          </div>

          <div class="form-group">
            <label style="color: #be185d; font-weight: 700;">Valeur Vente (SV / CV Commissions) :</label>
            <input type="number" id="newProdSV" class="form-control" value="420" min="1" required style="font-weight:800; border: 2px solid #f43f5e;">
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label>Prix Partenaire DP (DH) :</label>
            <input type="number" id="newProdDP" class="form-control" value="740" required>
          </div>

          <div class="form-group">
            <label>Prix Vente Public RP (DH) :</label>
            <input type="number" id="newProdRP" class="form-control" value="980" required>
          </div>

          <div class="form-group">
            <label>Stock Initial :</label>
            <input type="number" id="newProdStock" class="form-control" value="50" min="1" required>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Badge Spécial (Optionnel) :</label>
            <input type="text" id="newProdBadge" class="form-control" placeholder="Ex: Starter Pack, Nouveauté...">
          </div>

          <div class="form-group">
            <label>Icône :</label>
            <input type="text" id="newProdIcon" class="form-control" value="🎁">
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 24px; background: #15803d;">
            <i class="fas fa-plus"></i> Insérer au Catalogue Routini
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  toggleTypeHelp(val) {
    const cat = document.getElementById('newProdCategory');
    const icon = document.getElementById('newProdIcon');
    if (val === 'pack') {
      cat.value = 'Packs & Rituels';
      icon.value = '🎁';
    } else {
      cat.value = 'Soins Visage';
      icon.value = '✨';
    }
  }

  handleAddProductSubmit(e) {
    e.preventDefault();
    const type = document.getElementById('newProdType').value;
    const isPack = type === 'pack';

    const newProd = {
      name: document.getElementById('newProdName').value,
      category: document.getElementById('newProdCategory').value,
      isPack: isPack,
      badge: document.getElementById('newProdBadge').value,
      desc: document.getElementById('newProdDesc').value,
      priceDP_DH: document.getElementById('newProdDP').value,
      priceRP_DH: document.getElementById('newProdRP').value,
      pv: document.getElementById('newProdPV').value,
      sv: document.getElementById('newProdSV').value,
      stock: document.getElementById('newProdStock').value,
      icon: document.getElementById('newProdIcon').value || (isPack ? '🎁' : '✨')
    };

    window.stateManager.addProduct(newProd);
    window.app.closeModal();
    window.app.showToast(`${isPack ? 'Nouveau Pack' : 'Nouveau Soin'} inséré au catalogue avec SV = ${newProd.sv} !`, 'success');
    window.app.renderAllViews();
  }

  handleDeleteProduct(id) {
    const prod = window.stateManager.getProductById(id);
    if (!prod) return;

    if (confirm(`Confirmez-vous la suppression de l'article "${prod.name}" (${prod.id}) ?`)) {
      window.stateManager.deleteProduct(id);
      window.app.showToast(`L'article ${id} a été retiré du catalogue.`, 'warning');
      window.app.renderAllViews();
    }
  }

  // --- MODIFICATION DES GRADES (ROUTINE ONE PLAN) ---
  showEditRankModal(code) {
    const member = window.stateManager.getMemberByCode(code);
    if (!member) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-award" style="color: #b45309;"></i> Grade Routine ONE PLAN : ${member.name}`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleEditRankSubmit(event, '${member.code}')">
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 14px; font-size: 0.85rem;">
          Grade actuel : <strong>${member.rankName || member.rankCode}</strong><br>
          Sélectionnez le nouveau grade selon la hiérarchie officielle Routine ONE PLAN.
        </div>

        <div class="form-group">
          <label>Nouveau Grade Officiel :</label>
          <select id="editRankSelect" class="form-control">
            <option value="PARTNER" ${member.rankCode === 'PARTNER' ? 'selected' : ''}>Partner (Actif 150 PV • Accès Niveau 1 • 0% Leadership)</option>
            <option value="BUILDER" ${member.rankCode === 'BUILDER' ? 'selected' : ''}>Builder (500 PV Équipe • 2 Actifs • N1 + N2 • 1% Leadership)</option>
            <option value="LEADER" ${member.rankCode === 'LEADER' ? 'selected' : ''}>Leader (2 500 PV Équipe • 3 Builders • N1 + N2 + N3 • 2% Leadership)</option>
            <option value="MANAGER" ${member.rankCode === 'MANAGER' ? 'selected' : ''}>Manager (10 000 PV Équipe • 3 Leaders • 3% Leadership)</option>
            <option value="DIAMOND" ${member.rankCode === 'DIAMOND' ? 'selected' : ''}>Diamond (30 000 PV Équipe • 3 Managers • 5% Leadership)</option>
            <option value="AMBASSADOR" ${member.rankCode === 'AMBASSADOR' ? 'selected' : ''}>Ambassador (100 000 PV Équipe • 3 Diamonds • 7% Leadership)</option>
          </select>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 9px 20px;">
            <i class="fas fa-save"></i> Enregistrer le Grade
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleEditRankSubmit(e, code) {
    e.preventDefault();
    const newRankCode = document.getElementById('editRankSelect').value;
    window.stateManager.updateMemberRank(code, newRankCode);
    window.app.closeModal();
    window.app.showToast(`Grade mis à jour vers : ${newRankCode}`, 'success');
    window.app.renderAllViews();
  }

  showInjectPointsModal(code) {
    const member = window.stateManager.getMemberByCode(code);
    if (!member) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-bolt" style="color: var(--rtn-rose);"></i> Injection PV / SV (Commissions) : ${member.name}`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleInjectPointsSubmit(event, '${member.code}')">
        <div style="background: var(--rtn-rose-light); padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 0.85rem;">
          L'injection manuelle de points est réservée à la Direction pour régularisations de ventes.
          Les PV feront progresser le grade d'équipe, et le SV servira de base de commission !
        </div>
        <div class="form-group">
          <label>Points de Qualification à ajouter (PV) :</label>
          <input type="number" id="injectPV" class="form-control" value="150" min="10" max="50000" required>
        </div>
        <div class="form-group">
          <label>Valeur Vente associée (SV / CV) :</label>
          <input type="number" id="injectSV" class="form-control" value="630" min="10" max="200000" required>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 9px 20px;">
            <i class="fas fa-check"></i> Valider l'attribution
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleInjectPointsSubmit(e, code) {
    e.preventDefault();
    const addedPV = Number(document.getElementById('injectPV').value);
    const addedSV = Number(document.getElementById('injectSV').value);

    window.stateManager.injectPoints(code, addedPV, addedSV);
    window.app.closeModal();
    window.app.showToast(`Points injectés (+${addedPV} PV / +${addedSV} SV) !`, 'success');
    window.app.renderAllViews();
  }

  showAdjustWalletModal(code) {
    const member = window.stateManager.getMemberByCode(code);
    if (!member) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-coins" style="color: #15803d;"></i> Ajuster le Portefeuille : ${member.name}`;

    modalBody.innerHTML = `
      <form onsubmit="window.adminController.handleAdjustWalletSubmit(event, '${member.code}')">
        <p style="font-size: 0.85rem; margin-bottom: 14px;">Solde actuel : <strong>${window.stateManager.formatMoney(member.walletDH || 0)}</strong></p>
        <div class="form-group">
          <label>Montant en DH à ajouter (ou négatif pour déduire) :</label>
          <input type="number" id="adjustWalletAmount" class="form-control" value="500" step="50" required>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 9px 20px;">
            <i class="fas fa-check"></i> Mettre à jour le solde
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleAdjustWalletSubmit(e, code) {
    e.preventDefault();
    const amount = Number(document.getElementById('adjustWalletAmount').value);
    window.stateManager.creditWallet(code, amount);
    window.app.closeModal();
    window.app.showToast(`Solde ajusté (${amount >= 0 ? '+' : ''}${amount} DH).`, 'success');
    window.app.renderAllViews();
  }

  handleMonthlyBonusRun() {
    if (!confirm('Lancer la clôture mensuelle des primes selon le modèle ROUTINE ONE PLAN pour l’ensemble des distributeurs ?')) {
      return;
    }

    let totalDisbursed = 0;
    for (const m of window.stateManager.members) {
      if (m.role !== 'owner') {
        const calc = window.bonusController.calculateMemberBonus(m);
        m.walletDH = (m.walletDH || 0) + calc.totalBonus;
        totalDisbursed += calc.totalBonus;
      }
    }

    window.stateManager.saveState();
    window.app.showToast(`Clôture terminée ! Montant total versé : ${window.stateManager.formatMoney(totalDisbursed)}.`, 'success');
    window.app.renderAllViews();
  }

  exportDataJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.stateManager, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `Routine_ONE_PLAN_Export_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchor.click();
    window.app.showToast('Sauvegarde des données Routini téléchargée.', 'success');
  }

  handleResetSystem() {
    if (confirm('Attention : réinitialiser toutes les données aux valeurs par défaut du ROUTINE ONE PLAN ?')) {
      window.stateManager.resetToDefaults();
      window.app.showToast('Système réinitialisé aux barèmes officiels.', 'warning');
      window.app.renderAllViews();
    }
  }
}

window.adminController = new AdminController();
