/**
 * Routini eWorld MLM - Moteur de Calcul des Commissions & Portefeuille
 * Modèle Officiel : ROUTINE ONE PLAN — Version 4 (Septembre 2026)
 * Document de Référence : Document Officiel 18 Slides
 * 
 * 4 Sources de Gains Réseau :
 * 1. Vente Personnelle (Client Rattaché) : 10% sur CA payé (en DH)
 * 2. Niveau 1 (Filleuls directs) : 10% sur CV
 * 3. Niveau 2 (Filleuls N2) : 5% sur CV (si Builder ou plus)
 * 4. Niveau 3 (Filleuls N3) : 3% sur CV (si Leader ou plus)
 * 5. Leadership Différentiel : 1% à 7% par branche (Taux membre - Taux plus haut qualifié de la branche)
 * 
 * Garde-fous & Solidité Financière (Slide 8, 9, 15, 16, 17) :
 * - Inscription Partenaire = 0 DH
 * - Interdiction de l'auto-commission (pas de commission N1 sur son propre réassort perso - Slide 5)
 * - Règle anti-double paiement : le vendeur touche 10% vente OU position réseau, jamais les deux
 * - Si le minimum personnel du grade n'est pas atteint, AUCUNE commission n'est versée ce mois-là (Slide 8)
 * - Formule étalon : 500 DH PP ➔ 450 DH PM ➔ 50 PV ➔ 270 DH CV
 */

class BonusController {
  constructor() {
    this.activeSimTab = 'tab-3months'; // 'tab-3months', 'tab-10k', 'tab-custom'
    this.simSalesDH = 12000;
    this.simN1_CV = 10000;
    this.simN2_CV = 9000;
    this.simN3_CV = 6667;
    this.simGrade = 'LEADER';

    // Paramètres Simulateur Objectif 10 000 DH (Slide 13)
    this.objBasketPP = 500;
    this.objN1Members = 30;
    this.objN2Members = 180;
    this.objN3Members = 840;
  }

  init() {
    this.render();
  }

  setSimTab(tabId) {
    this.activeSimTab = tabId;
    this.render();
  }

  render() {
    const container = document.getElementById('bonusContentArea');
    if (!container) return;

    const user = window.stateManager.currentUser;
    if (!user) return;

    const bonusCalculation = this.calculateMemberBonus(user);
    const activity = bonusCalculation.activity;

    container.innerHTML = `
      <!-- Alerte Statut d'Activité Personnelle Mensuelle (Slide 8 & 15) -->
      ${activity.isActive ? `
        <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #22c55e; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="fas fa-check"></i>
            </div>
            <div>
              <div style="font-weight: 800; color: #166534; font-size: 0.95rem;">
                Activité Personnelle Validée pour ${activity.rankName}
              </div>
              <p style="font-size: 0.8rem; color: #15803d; margin-top: 2px;">
                Volume perso réalisé : <strong>${activity.ppv} PV</strong> (Minimum requis pour ce grade : <strong>${activity.requiredPV} PV</strong> soit ${activity.equivDH_PM} DH PM). Commissions actives ce mois-ci.
              </p>
            </div>
          </div>
          <span class="status-badge" style="background: #15803d; color: #fff; font-weight: 700;">Éligible aux Commissions V4</span>
        </div>
      ` : `
        <div style="background: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #ef4444; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div>
              <div style="font-weight: 800; color: #991b1b; font-size: 0.95rem;">
                Activité Personnelle Mensuelle Non Atteinte (Règle Slide 8 & 15)
              </div>
              <p style="font-size: 0.8rem; color: #b91c1c; margin-top: 2px;">
                Volume actuel : <strong>${activity.ppv} PV</strong> • Seuil requis pour votre grade : <strong>${activity.requiredPV} PV</strong> (Manquant : <strong>${activity.shortfall} PV</strong>).<br>
                <em>Règle officielle V4 : si le minimum personnel du grade n'est pas atteint, aucune commission n'est versée ce mois-là. Votre grade et réseau sont conservés.</em>
              </p>
            </div>
          </div>
          <button class="btn-switch-account" style="background: #ef4444; color: #fff; font-weight: 700;" onclick="window.app.switchView('shop')">
            <i class="fas fa-cart-plus"></i> Commander pour Activer (+${activity.shortfall} PV)
          </button>
        </div>
      `}

      <!-- En-tête Portefeuille E-Point & Résumé Commissions -->
      <div class="bonus-summary-grid">
        <div class="wallet-master-card" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
          <div class="wallet-balance-title">Solde Portefeuille E-Point</div>
          <div class="wallet-balance-amount">${window.stateManager.formatMoney(user.walletDH || 0)}</div>
          
          <div style="margin: 12px 0 16px; background: rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px; font-size: 0.8rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
              <span>Points Fidélité Cumulés :</span>
              <strong style="color: var(--rtn-gold);">${user.fidelityPoints || 0} pts</strong>
            </div>
            <small style="color: #cbd5e1; font-size: 0.72rem;">(Remise fidélité client : 20 pts = 10 DH de réduction)</small>
          </div>

          <div class="wallet-quick-actions">
            <button class="btn-wallet-action" onclick="window.bonusController.showTransferModal()">
              <i class="fas fa-paper-plane"></i> Transférer
            </button>
            <button class="btn-wallet-action" onclick="window.bonusController.showWithdrawModal()">
              <i class="fas fa-university"></i> Virement Bancaire
            </button>
          </div>
        </div>

        <div class="metric-card" style="background: var(--bg-surface);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3 style="font-size: 1.1rem; font-weight: 800;">Estimation Commissions Mensuelles</h3>
                <span class="status-badge" style="background: var(--rtn-rose-light); color: var(--rtn-rose-dark); font-weight: 700;">ROUTINI ONE PLAN V4</span>
              </div>
              <p style="font-size: 0.8rem; color: #64748b;">
                Grade : <strong>${user.rankName || user.rankCode}</strong> • Prix Membre 90% • Base CV 60%
              </p>
            </div>
            <button class="btn-switch-account" style="background: #1e293b; color: #fff; font-weight: 600;" onclick="window.bonusController.showFullBonusStatementModal()">
              <i class="fas fa-file-invoice-dollar"></i> Relevé Détaillé V4
            </button>
          </div>

          <!-- Les 4 sources de gains Routine ONE PLAN V4 (Slide 2, 5, 6, 8, 9) -->
          <div class="bonus-tier-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 16px;">
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 3px solid #0284c7;">
              <small style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight:700;">1. Vente Perso (10% DH)</small>
              <div style="font-size: 1.15rem; font-weight: 800; color: #0369a1; margin-top: 4px;">
                ${window.stateManager.formatMoney(bonusCalculation.personalBonus)}
              </div>
              <small style="color: #64748b; font-size: 0.72rem;">Clients rattachés</small>
            </div>

            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 3px solid #16a34a;">
              <small style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight:700;">2. Niveau 1 (10% CV)</small>
              <div style="font-size: 1.15rem; font-weight: 800; color: #15803d; margin-top: 4px;">
                ${window.stateManager.formatMoney(bonusCalculation.n1Bonus)}
              </div>
              <small style="color: #64748b; font-size: 0.72rem;">Filleuls directs (N1)</small>
            </div>

            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 3px solid #d97706;">
              <small style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight:700;">3. Niveaux 2 & 3 (5% • 3%)</small>
              <div style="font-size: 1.15rem; font-weight: 800; color: #b45309; margin-top: 4px;">
                ${window.stateManager.formatMoney(bonusCalculation.n2Bonus + bonusCalculation.n3Bonus)}
              </div>
              <small style="color: #64748b; font-size: 0.72rem;">N2 (${bonusCalculation.n2Bonus} DH) + N3 (${bonusCalculation.n3Bonus} DH)</small>
            </div>

            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 3px solid #be185d;">
              <small style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight:700;">4. Leadership (${bonusCalculation.leadershipRateText})</small>
              <div style="font-size: 1.15rem; font-weight: 800; color: #be185d; margin-top: 4px;">
                ${window.stateManager.formatMoney(bonusCalculation.leadershipBonus)}
              </div>
              <small style="color: #64748b; font-size: 0.72rem;">Différentiel branches</small>
            </div>
          </div>

          <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; color: #065f46;">Total Mensuel Estimé (ROUTINI ONE PLAN V4) :</span>
            <strong style="font-size: 1.4rem; color: #047857; font-weight: 900;">
              ${window.stateManager.formatMoney(bonusCalculation.totalBonus)}
            </strong>
          </div>
        </div>
      </div>

      <!-- SECTION DES 3 PARCOURS COMMERCIAUX (Slide 10) -->
      <div class="data-table-card" style="margin-bottom: 24px; border-left: 5px solid #0284c7;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">
              <i class="fas fa-users-cog" style="color: #0284c7;"></i>
              Les 3 Parcours Commerciaux Officiels (Slide 10)
            </h3>
            <p style="font-size: 0.8rem; color: #64748b;">
              Séparation claire entre client direct, client rattaché et membre partenaire réseau.
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; border-top: 4px solid #64748b;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 0.75rem; font-weight:800; color:#64748b; text-transform:uppercase;">1 • CLIENT DIRECT ROUTINI</span>
              <span class="status-badge" style="background:#e2e8f0; color:#334155;">0% réseau</span>
            </div>
            <p style="font-size: 0.82rem; color: #475569; margin: 8px 0 10px;">Achète directement auprès de Routini sans intermédiaire.</p>
            <ul style="font-size: 0.78rem; list-style: none; padding: 0; line-height: 1.8;">
              <li style="color: #15803d;"><i class="fas fa-check"></i> Pas de sponsor obligatoire</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> Fidélité client possible</li>
              <li style="color: #ef4444;"><i class="fas fa-times"></i> Pas de commission réseau attribuée</li>
            </ul>
          </div>

          <div style="background: #fdf2f8; border-radius: 8px; padding: 16px; border: 1px solid var(--rtn-rose-light); border-top: 4px solid var(--rtn-rose);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 0.75rem; font-weight:800; color:var(--rtn-rose-dark); text-transform:uppercase;">2 • CLIENT RATTACHÉ</span>
              <span class="status-badge" style="background:#dcfce7; color:#15803d; font-weight:700;">10% au Partner</span>
            </div>
            <p style="font-size: 0.82rem; color: #475569; margin: 8px 0 10px;">Achète via le code ou le lien de recommandation d'un Partner.</p>
            <ul style="font-size: 0.78rem; list-style: none; padding: 0; line-height: 1.8;">
              <li style="color: #15803d;"><i class="fas fa-check"></i> 10% commission de vente directe au Partner</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> Contribue au volume commercial du Partner</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> Reste client, pas membre réseau</li>
            </ul>
          </div>

          <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; border: 1px solid #bbf7d0; border-top: 4px solid #16a34a;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 0.75rem; font-weight:800; color:#14532d; text-transform:uppercase;">3 • PARTNER RÉSEAU</span>
              <span class="status-badge" style="background:#15803d; color:#fff; font-weight:700;">Prix Membre 90%</span>
            </div>
            <p style="font-size: 0.82rem; color: #475569; margin: 8px 0 10px;">Achète, recommande et développe son équipe.</p>
            <ul style="font-size: 0.78rem; list-style: none; padding: 0; line-height: 1.8;">
              <li style="color: #15803d;"><i class="fas fa-check"></i> Prix membre : 90% du prix public</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> Génère PV (qualification) et CV (commissions)</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> Commissions N1/N2/N3 + Leadership selon activité</li>
              <li style="color: #ef4444;"><i class="fas fa-times"></i> Pas de commission sur son propre achat (Slide 5)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- SECTION DES SIMULATEURS INTERACTIFS OFFICIELS V4 (Slides 11, 12, 13) -->
      <div class="data-table-card" style="margin-bottom: 24px;">
        <div class="table-header-bar" style="flex-wrap: wrap; gap: 10px; border-bottom: none; padding-bottom: 0;">
          <div>
            <h3 style="display:flex; align-items:center; gap: 8px;">
              <i class="fas fa-calculator" style="color: var(--rtn-rose);"></i>
              Simulateurs Officiels ROUTINI ONE PLAN — Version 4
            </h3>
            <p style="font-size: 0.8rem; color: #64748b;">
              Visualisez les projections réelles issues directement des slides officielles 11, 12 et 13.
            </p>
          </div>
        </div>

        <!-- Onglets du simulateur -->
        <div style="display: flex; gap: 8px; border-bottom: 2px solid #e2e8f0; padding: 0 20px 12px; margin-top: 14px; flex-wrap: wrap;">
          <button class="filter-pill ${this.activeSimTab === 'tab-3months' ? 'active' : ''}" onclick="window.bonusController.setSimTab('tab-3months')">
            <i class="fas fa-chart-line"></i> 1. Simulation Réelle 3 Mois (Slide 11 & 12)
          </button>
          <button class="filter-pill ${this.activeSimTab === 'tab-10k' ? 'active' : ''}" onclick="window.bonusController.setSimTab('tab-10k')">
            <i class="fas fa-bullseye"></i> 2. Objectif 10 000 DH/mois (Slide 13)
          </button>
          <button class="filter-pill ${this.activeSimTab === 'tab-custom' ? 'active' : ''}" onclick="window.bonusController.setSimTab('tab-custom')">
            <i class="fas fa-sliders-h"></i> 3. Simulateur Personnalisé en Direct
          </button>
        </div>

        <!-- Corps du simulateur actif -->
        <div style="padding: 20px;">
          ${this.renderActiveSimContent()}
        </div>
      </div>

      <!-- Historique des Relevés et Versements E-Point -->
      <div class="data-table-card">
        <div class="table-header-bar">
          <h3>${window.stateManager.isOwner() ? 'Journal Central des Transactions & Versements E-Point' : 'Mes Relevés & Versements E-Point'}</h3>
          <span class="status-badge status-success">${window.stateManager.isOwner() ? 'Direction Générale (Tous les Comptes)' : `Compte : ${user.name}`}</span>
        </div>
        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Réf. Transaction</th>
                ${window.stateManager.isOwner() ? '<th>Partenaire</th>' : ''}
                <th>Description</th>
                <th>Type</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                const isOwner = window.stateManager.isOwner();
                const txList = isOwner 
                  ? (window.stateManager.transactions || [])
                  : (window.stateManager.transactions || []).filter(tx => String(tx.memberCode).toLowerCase() === String(user.code).toLowerCase() || String(tx.memberCode).toLowerCase() === String(user.id).toLowerCase());

                if (txList.length === 0) {
                  return `
                    <tr>
                      <td colspan="${isOwner ? 7 : 6}" style="text-align: center; padding: 24px; color: #64748b;">
                        <i class="fas fa-receipt" style="font-size: 1.5rem; color: #cbd5e1; display: block; margin-bottom: 6px;"></i>
                        Aucune transaction enregistrée sur ce compte pour l'instant. Vos primes de réseau apparaîtront ici.
                      </td>
                    </tr>
                  `;
                }

                return txList.map(tx => {
                  const m = isOwner ? window.stateManager.getMemberByCode(tx.memberCode) : null;
                  const memberBadge = isOwner ? `<td><span style="font-size:0.75rem; font-weight:700; background:#f1f5f9; padding:2px 6px; border-radius:4px;">${m ? m.name.split(' ')[0] : tx.memberCode || 'Direction'}</span></td>` : '';
                  return `
                    <tr>
                      <td><strong>${tx.date}</strong></td>
                      <td><span style="font-family: monospace; font-weight: 700;">${tx.ref}</span></td>
                      ${memberBadge}
                      <td>${tx.desc}</td>
                      <td><span class="status-badge ${tx.type === 'credit' ? 'status-success' : 'status-warning'}">${tx.type === 'credit' ? '+ Prime Réseau' : '- Débit E-Point'}</span></td>
                      <td><strong style="color: ${tx.type === 'credit' ? '#15803d' : '#b91c1c'};">${tx.type === 'credit' ? '+' : '-'}${window.stateManager.formatMoney(tx.amount)}</strong></td>
                      <td><span class="status-badge status-success">${tx.status}</span></td>
                    </tr>
                  `;
                }).join('');
              })()}
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (this.activeSimTab === 'tab-custom') {
      this.updateCustomSimulator();
    }
  }

  renderActiveSimContent() {
    if (this.activeSimTab === 'tab-3months') {
      return this.render3MonthsSimulation();
    } else if (this.activeSimTab === 'tab-10k') {
      return this.render10kObjectiveSimulation();
    } else {
      return this.renderCustomSimulation();
    }
  }

  // --- 1. SIMULATION RÉELLE DE DÉPART : 3 MOIS (Slides 11 & 12) ---
  render3MonthsSimulation() {
    return `
      <div>
        <div style="background: #f8fafc; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; border-left: 4px solid #10b981;">
          <h4 style="font-weight: 800; color: #065f46; font-size: 1rem;">
            Hypothèse Officielle Slide 11 : Toi + 2 fils (N1) + 4 petits-fils (N2)
          </h4>
          <p style="font-size: 0.85rem; color: #334155; margin-top: 4px;">
            Chaque personne réalise un panier de <strong>500 DH Prix Public / mois</strong> (payé 450 DH PM = 50 PV = 270 DH CV).<br>
            <em>Formule Slide 5 : Chaque fils direct à 500 DH PP génère 270 CV × 10% = <strong>27 DH</strong> de commission N1. Donc 2 fils = <strong>54 DH / mois</strong>.</em>
          </p>
        </div>

        <div style="overflow-x: auto; margin-bottom: 24px;">
          <table class="custom-table" style="background: #fff;">
            <thead>
              <tr style="background: #0f172a; color: #fff;">
                <th style="color: #fff;">Mois</th>
                <th style="color: #fff;">Personne</th>
                <th style="color: #fff;">Position</th>
                <th style="color: #fff; text-align: center;">PV Perso</th>
                <th style="color: #fff; text-align: center;">PV Équipe Mois</th>
                <th style="color: #fff; text-align: center;">PV Équipe Cumulés</th>
                <th style="color: #fff; text-align: right;">Commission Perçue</th>
              </tr>
            </thead>
            <tbody>
              <!-- Mois 1 -->
              <tr style="background: #f8fafc;">
                <td><strong style="color: #0284c7;">M1</strong></td>
                <td><strong>Toi</strong></td>
                <td><span class="status-badge" style="background:#e0f2fe; color:#0369a1;">Racine</span></td>
                <td style="text-align: center;">50</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: right; font-weight: 700; color: #64748b;">0 DH</td>
              </tr>
              <!-- Mois 2 -->
              <tr>
                <td><strong style="color: #10b981;">M2</strong></td>
                <td><strong>Toi</strong></td>
                <td><span class="status-badge" style="background:#e0f2fe; color:#0369a1;">Racine</span></td>
                <td style="text-align: center;">50</td>
                <td style="text-align: center;">100</td>
                <td style="text-align: center;">100</td>
                <td style="text-align: right; font-weight: 800; color: #15803d;">54 DH *</td>
              </tr>
              <tr>
                <td><strong style="color: #10b981;">M2</strong></td>
                <td>Fils 1 / Fils 2</td>
                <td><span class="status-badge" style="background:#f0fdf4; color:#166534;">N1</span></td>
                <td style="text-align: center;">50 chacun</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: right; font-weight: 700; color: #64748b;">0 DH</td>
              </tr>
              <!-- Mois 3 -->
              <tr style="background: #fdf2f8;">
                <td><strong style="color: #d946ef;">M3</strong></td>
                <td><strong>Toi</strong></td>
                <td><span class="status-badge" style="background:#e0f2fe; color:#0369a1;">Racine</span></td>
                <td style="text-align: center;">50</td>
                <td style="text-align: center;">300</td>
                <td style="text-align: center;">400</td>
                <td style="text-align: right; font-weight: 800; color: #15803d;">54 DH *</td>
              </tr>
              <tr style="background: #fdf2f8;">
                <td><strong style="color: #d946ef;">M3</strong></td>
                <td>Fils 1</td>
                <td><span class="status-badge" style="background:#f0fdf4; color:#166534;">N1</span></td>
                <td style="text-align: center;">50</td>
                <td style="text-align: center;">100</td>
                <td style="text-align: center;">100</td>
                <td style="text-align: right; font-weight: 800; color: #15803d;">54 DH</td>
              </tr>
              <tr style="background: #fdf2f8;">
                <td><strong style="color: #d946ef;">M3</strong></td>
                <td>Fils 2</td>
                <td><span class="status-badge" style="background:#f0fdf4; color:#166534;">N1</span></td>
                <td style="text-align: center;">50</td>
                <td style="text-align: center;">100</td>
                <td style="text-align: center;">100</td>
                <td style="text-align: right; font-weight: 800; color: #15803d;">54 DH</td>
              </tr>
              <tr style="background: #fdf2f8;">
                <td><strong style="color: #d946ef;">M3</strong></td>
                <td>4 petits-fils</td>
                <td><span class="status-badge" style="background:#fef3c7; color:#b45309;">N2</span></td>
                <td style="text-align: center;">50 chacun</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: right; font-weight: 700; color: #64748b;">0 DH</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="font-size: 0.78rem; color: #64748b; font-style: italic; margin-bottom: 24px;">
          * Note Slide 11 : Avec CV à 60%, chaque fils direct à 500 DH PP génère 27 DH de N1. À M3, Toi cumule 400 PV équipe (< 2 000 PV requis pour Builder), donc Toi n'a pas encore accès au N2 : la commission reste 54 DH.
        </p>

        <!-- Slide 12 : Chiffre d'Affaires Société -->
        <h4 style="font-weight: 800; color: #0f172a; margin-bottom: 12px; font-size: 1.05rem;">
          <i class="fas fa-building" style="color: var(--rtn-rose);"></i> Chiffre d'Affaires de la Société dans cette simulation (Slide 12)
        </h4>
        <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px;">
          Le CA encaissé est calculé au prix membre réellement payé (450 DH par personne) :
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 18px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #0ea5e9; border-radius: 8px; padding: 16px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Mois 1</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #0369a1; margin: 6px 0;">450 DH</div>
            <small style="color: #64748b;">1 membre × 450 DH</small>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #10b981; border-radius: 8px; padding: 16px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Mois 2</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #15803d; margin: 6px 0;">1 350 DH</div>
            <small style="color: #64748b;">3 membres × 450 DH</small>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #8b5cf6; border-radius: 8px; padding: 16px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Mois 3</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #6d28d9; margin: 6px 0;">3 150 DH</div>
            <small style="color: #64748b;">7 membres × 450 DH</small>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff; padding: 16px 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-size: 0.85rem; color: #cbd5e1; text-transform: uppercase; font-weight: 700;">CA Cumulé Encaissé sur les 3 Premiers Mois :</div>
            <small style="color: #94a3b8;">Chiffre d'affaires brut avant coûts de fabrication, logistique, TVA et commissions.</small>
          </div>
          <div style="font-size: 1.8rem; font-weight: 900; color: #38bdf8;">4 950 DH</div>
        </div>
      </div>
    `;
  }

  // --- 2. OBJECTIF 10 000 DH DE COMMISSION MENSUELLE (Slide 13) ---
  render10kObjectiveSimulation() {
    const pp = this.objBasketPP;
    const pm = Math.round(pp * 0.90);
    const cv = Math.round(pm * 0.60);

    const commN1Unit = Number((cv * 0.10).toFixed(2));
    const commN2Unit = Number((cv * 0.05).toFixed(2));
    const commN3Unit = Number((cv * 0.03).toFixed(2));

    const totalN1 = Math.round(this.objN1Members * commN1Unit);
    const totalN2 = Math.round(this.objN2Members * commN2Unit);
    const totalN3 = Math.round(this.objN3Members * commN3Unit);
    const totalMembers = this.objN1Members + this.objN2Members + this.objN3Members;
    const grandTotalCom = totalN1 + totalN2 + totalN3;

    return `
      <div>
        <div style="background: #fdf2f8; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; border-left: 4px solid var(--rtn-rose);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <h4 style="font-weight: 800; color: var(--rtn-rose-dark); font-size: 1.05rem;">
                Modèle Mathématique de la Slide 13 : Atteindre 10 000 DH/mois
              </h4>
              <p style="font-size: 0.85rem; color: #475569; margin-top: 4px;">
                Illustration hors Leadership, avec panier moyen de référence de <strong>${pp} DH Prix Public</strong> (CV = ${cv} DH).
              </p>
            </div>
            <button class="btn-switch-account" onclick="window.bonusController.reset10kToSlide13()">
              <i class="fas fa-undo"></i> Réinitialiser Slide 13 (1 050 membres = 10 044 DH)
            </button>
          </div>
        </div>

        <!-- Contrôles interactifs pour tester des variations -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <div class="form-group" style="margin:0;">
            <label style="font-size: 0.78rem; font-weight:700;">Panier Moyen PP :</label>
            <input type="number" class="form-control" value="${this.objBasketPP}" step="50" oninput="window.bonusController.set10kBasket(this.value)">
            <small style="color: #64748b; font-size: 0.7rem;">(PM: ${pm} DH • CV: ${cv} DH)</small>
          </div>
          <div class="form-group" style="margin:0;">
            <label style="font-size: 0.78rem; font-weight:700;">Membres N1 (10% CV) :</label>
            <input type="number" class="form-control" value="${this.objN1Members}" step="5" oninput="window.bonusController.set10kN1(this.value)">
          </div>
          <div class="form-group" style="margin:0;">
            <label style="font-size: 0.78rem; font-weight:700;">Membres N2 (5% CV) :</label>
            <input type="number" class="form-control" value="${this.objN2Members}" step="10" oninput="window.bonusController.set10kN2(this.value)">
          </div>
          <div class="form-group" style="margin:0;">
            <label style="font-size: 0.78rem; font-weight:700;">Membres N3 (3% CV) :</label>
            <input type="number" class="form-control" value="${this.objN3Members}" step="20" oninput="window.bonusController.set10kN3(this.value)">
          </div>
        </div>

        <div style="overflow-x: auto; margin-bottom: 20px;">
          <table class="custom-table" style="background: #fff;">
            <thead>
              <tr style="background: #0f172a; color: #fff;">
                <th style="color: #fff;">Niveau</th>
                <th style="color: #fff; text-align: center;">Membres Actifs</th>
                <th style="color: #fff; text-align: center;">Taux sur CV</th>
                <th style="color: #fff; text-align: center;">Commission / Membre</th>
                <th style="color: #fff; text-align: right;">Total Gagné</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>N1 (Filleuls directs)</strong></td>
                <td style="text-align: center; font-weight: 700;">${this.objN1Members}</td>
                <td style="text-align: center;"><span class="status-badge" style="background:#dcfce7; color:#15803d;">10% CV</span></td>
                <td style="text-align: center; font-weight: 700; color: #0284c7;">${commN1Unit.toFixed(2)} DH</td>
                <td style="text-align: right; font-weight: 800; color: #0284c7;">${totalN1.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>N2 (Filleuls de tes N1)</strong></td>
                <td style="text-align: center; font-weight: 700;">${this.objN2Members}</td>
                <td style="text-align: center;"><span class="status-badge" style="background:#fef3c7; color:#b45309;">5% CV</span></td>
                <td style="text-align: center; font-weight: 700; color: #d97706;">${commN2Unit.toFixed(2)} DH</td>
                <td style="text-align: right; font-weight: 800; color: #d97706;">${totalN2.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>N3 (Filleuls de tes N2)</strong></td>
                <td style="text-align: center; font-weight: 700;">${this.objN3Members}</td>
                <td style="text-align: center;"><span class="status-badge" style="background:#fee2e2; color:#b91c1c;">3% CV</span></td>
                <td style="text-align: center; font-weight: 700; color: #dc2626;">${commN3Unit.toFixed(2)} DH</td>
                <td style="text-align: right; font-weight: 800; color: #dc2626;">${totalN3.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr style="background: #f0fdf4; font-size: 1.1rem;">
                <td><strong style="color: #166534;">TOTAL RÉSEAU (N1 + N2 + N3)</strong></td>
                <td style="text-align: center;"><strong style="color: #166534;">${totalMembers}</strong></td>
                <td style="text-align: center;">—</td>
                <td style="text-align: center;">—</td>
                <td style="text-align: right;"><strong style="color: #15803d; font-size: 1.3rem;">${grandTotalCom.toLocaleString('fr-FR')} DH</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 14px; font-size: 0.82rem; color: #475569; border-left: 3px solid #64748b;">
          <strong>Enseignement de la Slide 13 :</strong> Le même objectif peut être atteint avec moins de membres si le panier moyen augmente. Le différentiel Leadership (1% à 7%) s'ajoute également à ce total selon le grade, offrant un levier de rentabilité supplémentaire.
        </div>
      </div>
    `;

    if (window.i18n && window.i18n.currentLang !== 'fr') {
      window.i18n.translateDOM();
    }
  }

  set10kBasket(val) {
    this.objBasketPP = Number(val) || 500;
    this.render();
  }

  set10kN1(val) {
    this.objN1Members = Number(val) || 0;
    this.render();
  }

  set10kN2(val) {
    this.objN2Members = Number(val) || 0;
    this.render();
  }

  set10kN3(val) {
    this.objN3Members = Number(val) || 0;
    this.render();
  }

  reset10kToSlide13() {
    this.objBasketPP = 500;
    this.objN1Members = 30;
    this.objN2Members = 180;
    this.objN3Members = 840;
    this.render();
  }

  // --- 3. SIMULATEUR PERSONNALISÉ EN DIRECT ---
  renderCustomSimulation() {
    return `
      <div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 18px 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Ventes Personnelles (CA en DH) :</label>
            <input type="number" id="simSalesInput" class="form-control" value="${this.simSalesDH}" step="500" oninput="window.bonusController.updateCustomSimulator()">
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Volume Niveau 1 (en CV) :</label>
            <input type="number" id="simN1Input" class="form-control" value="${this.simN1_CV}" step="500" oninput="window.bonusController.updateCustomSimulator()">
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Volume Niveau 2 (en CV) :</label>
            <input type="number" id="simN2Input" class="form-control" value="${this.simN2_CV}" step="500" oninput="window.bonusController.updateCustomSimulator()">
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Volume Niveau 3 (en CV) :</label>
            <input type="number" id="simN3Input" class="form-control" value="${this.simN3_CV}" step="500" oninput="window.bonusController.updateCustomSimulator()">
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Grade pour Leadership :</label>
            <select id="simGradeSelect" class="form-control" onchange="window.bonusController.updateCustomSimulator()">
              <option value="PARTNER">Partner (0%)</option>
              <option value="BUILDER">Builder (1%)</option>
              <option value="LEADER" selected>Leader (2%)</option>
              <option value="MANAGER">Manager (3%)</option>
              <option value="DIAMOND">Diamond (5%)</option>
              <option value="AMBASSADOR">Ambassador (7%)</option>
            </select>
          </div>
        </div>

        <div id="simCustomResultsArea">
          <!-- Injecté dynamiquement par updateCustomSimulator() -->
        </div>
      </div>
    `;
  }

  updateCustomSimulator() {
    const simSalesInput = document.getElementById('simSalesInput');
    if (!simSalesInput) return;

    this.simSalesDH = Number(simSalesInput.value) || 0;
    this.simN1_CV = Number(document.getElementById('simN1Input').value) || 0;
    this.simN2_CV = Number(document.getElementById('simN2Input').value) || 0;
    this.simN3_CV = Number(document.getElementById('simN3Input').value) || 0;
    this.simGrade = document.getElementById('simGradeSelect').value;

    const gradeRates = {
      'PARTNER': 0,
      'BUILDER': 0.01,
      'LEADER': 0.02,
      'MANAGER': 0.03,
      'DIAMOND': 0.05,
      'AMBASSADOR': 0.07
    };

    const maxDepths = {
      'PARTNER': 1,
      'BUILDER': 2,
      'LEADER': 3,
      'MANAGER': 3,
      'DIAMOND': 3,
      'AMBASSADOR': 3
    };

    const rate = gradeRates[this.simGrade] || 0.02;
    const depth = maxDepths[this.simGrade] || 3;
    const simEligibleCV = 15000;

    const gainPerso = Math.round(this.simSalesDH * 0.10);
    const gainN1 = Math.round(this.simN1_CV * 0.10);
    const gainN2 = (depth >= 2) ? Math.round(this.simN2_CV * 0.05) : 0;
    const gainN3 = (depth >= 3) ? Math.round(this.simN3_CV * 0.03) : 0;
    const gainLeadership = Math.round(simEligibleCV * rate);
    const totalSim = gainPerso + gainN1 + gainN2 + gainN3 + gainLeadership;

    const resultsArea = document.getElementById('simCustomResultsArea');
    if (resultsArea) {
      resultsArea.innerHTML = `
        <div style="overflow-x: auto;">
          <table class="custom-table" style="background: #fff; margin-bottom: 14px;">
            <thead>
              <tr style="background: #0f172a; color: #fff;">
                <th style="color: #fff;">SOURCE DE GAIN</th>
                <th style="color: #fff;">BASE CALCUL</th>
                <th style="color: #fff;">TAUX V4</th>
                <th style="color: #fff; text-align: right;">GAIN ESTIMÉ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Ventes personnelles (clients rattachés)</strong></td>
                <td>${this.simSalesDH.toLocaleString('fr-FR')} DH</td>
                <td>× 10 % DH</td>
                <td style="text-align: right; font-weight: 700; color: #0284c7;">${gainPerso.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>Niveau 1 (Filleuls directs)</strong></td>
                <td>${this.simN1_CV.toLocaleString('fr-FR')} CV</td>
                <td>× 10 % CV</td>
                <td style="text-align: right; font-weight: 700; color: #16a34a;">${gainN1.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>Niveau 2 (si Builder ou plus)</strong></td>
                <td>${this.simN2_CV.toLocaleString('fr-FR')} CV</td>
                <td>${depth >= 2 ? '× 5 % CV' : '<span style="color:#ef4444;">Non qualifié (Requis: Builder)</span>'}</td>
                <td style="text-align: right; font-weight: 700; color: #d97706;">${gainN2.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>Niveau 3 (si Leader ou plus)</strong></td>
                <td>${this.simN3_CV.toLocaleString('fr-FR')} CV</td>
                <td>${depth >= 3 ? '× 3 % CV' : '<span style="color:#ef4444;">Non qualifié (Requis: Leader)</span>'}</td>
                <td style="text-align: right; font-weight: 700; color: #ea580c;">${gainN3.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>Leadership Différentiel (${this.simGrade})</strong></td>
                <td>${simEligibleCV.toLocaleString('fr-FR')} CV éligibles</td>
                <td>× ${(rate * 100).toFixed(0)} %</td>
                <td style="text-align: right; font-weight: 700; color: #be185d;">${gainLeadership.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr style="background: #f0fdf4; font-size: 1.05rem;">
                <td colspan="3"><strong style="color: #166534;">TOTAL MENSUEL SIMULÉ (Conforme ONE PLAN V4) :</strong></td>
                <td style="text-align: right;"><strong style="color: #15803d; font-size: 1.25rem;">${totalSim.toLocaleString('fr-FR')} DH</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
  }

  calculateMemberBonus(member) {
    if (!member) {
      return {
        isActive: false,
        personalBonus: 0,
        n1Bonus: 0,
        n2Bonus: 0,
        n3Bonus: 0,
        leadershipBonus: 0,
        leadershipRateText: '0%',
        totalBonus: 0
      };
    }

    const activity = window.stateManager.getActivityDetails(member);
    const gradeCode = member.rankCode || 'PARTNER';
    const gradeObj = window.stateManager.getGrade(gradeCode);
    const maxDepth = gradeObj.maxDepth || 1;
    const leadershipRate = gradeObj.leadershipRate || 0;

    // Règle d'inactivité officielle V4 (Slide 8 & 15) :
    // Si le minimum personnel du grade n'est pas atteint, aucune commission n'est versée ce mois-là.
    if (!activity.isActive) {
      return {
        isActive: false,
        activity,
        personalBonus: 0,
        n1CV: 0,
        n1Bonus: 0,
        n2CV: 0,
        n2Bonus: 0,
        n3CV: 0,
        n3Bonus: 0,
        leadershipRate,
        leadershipRateText: `${Math.round(leadershipRate * 100)}%`,
        leadershipBonus: 0,
        totalBonus: 0
      };
    }

    const monthlySalesDH = member.monthlySalesDH || 0;
    const personalBonus = Math.round(monthlySalesDH * 0.10); // 10% sur ventes directes clients rattachés

    const directs = window.stateManager.getDirectDownlines(member.code);
    const n1CV = directs.reduce((acc, d) => acc + (d.sv || 1000), 0) || (member.sv ? Math.round(member.sv * 0.5) : 1000);
    const n1Bonus = Math.round(n1CV * 0.10);

    const n2Downlines = window.stateManager.getDownlinesByLevel(member.code, 2);
    const n2CV = n2Downlines.length > 0 ? n2Downlines.reduce((acc, d) => acc + (d.sv || 800), 0) : Math.round(n1CV * 0.8);
    const n2Bonus = (maxDepth >= 2) ? Math.round(n2CV * 0.05) : 0;

    const n3Downlines = window.stateManager.getDownlinesByLevel(member.code, 3);
    const n3CV = n3Downlines.length > 0 ? n3Downlines.reduce((acc, d) => acc + (d.sv || 600), 0) : Math.round(n1CV * 0.6);
    const n3Bonus = (maxDepth >= 3) ? Math.round(n3CV * 0.03) : 0;

    // Calcul du différentiel Leadership par branche (Slide 9)
    let leadershipBonus = 0;
    if (leadershipRate > 0) {
      for (const d of directs) {
        const branchMembers = [d, ...window.stateManager.getAllDownlines(d.code)];
        const branchTotalCV = branchMembers.reduce((sum, m) => sum + (m.sv || 500), 0);
        
        let branchMaxRate = 0;
        for (const m of branchMembers) {
          const mGrade = window.stateManager.getGrade(m.rankCode);
          if (mGrade && mGrade.leadershipRate > branchMaxRate && window.stateManager.isMemberActive(m)) {
            branchMaxRate = mGrade.leadershipRate;
          }
        }

        const diffRate = Math.max(0, leadershipRate - branchMaxRate);
        leadershipBonus += Math.round(branchTotalCV * diffRate);
      }

      // Si pas encore de descendance développée, calcul sur CV éligible global
      if (directs.length === 0 && member.sv) {
        leadershipBonus = Math.round((member.sv * 0.5) * leadershipRate);
      }
    }

    const totalBonus = personalBonus + n1Bonus + n2Bonus + n3Bonus + leadershipBonus;

    return {
      isActive: true,
      activity,
      personalBonus,
      n1CV,
      n1Bonus,
      n2CV,
      n2Bonus,
      n3CV,
      n3Bonus,
      leadershipRate,
      leadershipRateText: `${Math.round(leadershipRate * 100)}%`,
      leadershipBonus,
      totalBonus
    };
  }

  showFullBonusStatementModal() {
    const user = window.stateManager.currentUser;
    const calc = this.calculateMemberBonus(user);

    window.app.showModal(
      `Relevé Détaillé des Commissions — ROUTINI ONE PLAN V4`,
      `
        <div style="font-size: 0.85rem;">
          <div style="background: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
              <span>Distributeur : <strong>${user.name}</strong> (${user.code})</span>
              <span class="status-badge" style="background: var(--rtn-rose); color: #fff;">${user.rankName || user.rankCode}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size: 0.8rem; color: #64748b;">
              <span>Activité personnelle : <strong>${user.ppv || 0} PV</strong> (Requis : ${calc.activity.requiredPV} PV)</span>
              <span>Statut : <strong style="color: ${calc.isActive ? '#15803d' : '#b91c1c'};">${calc.isActive ? 'Actif & Qualifié' : 'Inactif ce mois-ci'}</strong></span>
            </div>
          </div>

          <table class="custom-table" style="margin-bottom: 16px;">
            <thead>
              <tr>
                <th>Poste de Commission</th>
                <th>Base Monétaire</th>
                <th>Taux Appliqué</th>
                <th style="text-align: right;">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1. Vente Directe (Clients Rattachés)</td>
                <td>${user.monthlySalesDH || 0} DH (CA PP)</td>
                <td>10 %</td>
                <td style="text-align: right; font-weight:700; color:#0284c7;">${window.stateManager.formatMoney(calc.personalBonus)}</td>
              </tr>
              <tr>
                <td>2. Niveau 1 (Filleuls Directs)</td>
                <td>${calc.n1CV} CV</td>
                <td>10 % sur CV</td>
                <td style="text-align: right; font-weight:700; color:#16a34a;">${window.stateManager.formatMoney(calc.n1Bonus)}</td>
              </tr>
              <tr>
                <td>3. Niveau 2 (Filleuls de rang 2)</td>
                <td>${calc.n2CV} CV</td>
                <td>5 % sur CV</td>
                <td style="text-align: right; font-weight:700; color:#d97706;">${window.stateManager.formatMoney(calc.n2Bonus)}</td>
              </tr>
              <tr>
                <td>4. Niveau 3 (Filleuls de rang 3)</td>
                <td>${calc.n3CV} CV</td>
                <td>3 % sur CV</td>
                <td style="text-align: right; font-weight:700; color:#ea580c;">${window.stateManager.formatMoney(calc.n3Bonus)}</td>
              </tr>
              <tr>
                <td>5. Leadership Différentiel</td>
                <td>Branches éligibles</td>
                <td>${calc.leadershipRateText}</td>
                <td style="text-align: right; font-weight:700; color:#be185d;">${window.stateManager.formatMoney(calc.leadershipBonus)}</td>
              </tr>
              <tr style="background: #ecfdf5; font-size: 1rem;">
                <td colspan="3"><strong style="color: #065f46;">TOTAL NET ACCRÉDITÉ AU PORTEFEUILLE :</strong></td>
                <td style="text-align: right;"><strong style="color: #047857; font-size: 1.15rem;">${window.stateManager.formatMoney(calc.totalBonus)}</strong></td>
              </tr>
            </tbody>
          </table>

          <div style="font-size: 0.75rem; color: #64748b; line-height: 1.6;">
            <strong>Mentions Légales ONE PLAN V4 :</strong> Conformément aux règles Routini, les commissions sont calculées sur la base monétaire de Commission Value (CV = 60% du prix membre). Aucune commission n'est versée sur le réassort personnel (règle anti-auto-commission).
          </div>
        </div>
      `
    );
  }

  showTransferModal() {
    window.app.showModal(
      `Transfert de Points E-Point entre Membres`,
      `
        <form id="formTransferEPoint" onsubmit="window.bonusController.handleTransferSubmit(event)">
          <div class="form-group">
            <label>Code Membre Destinataire :</label>
            <input type="text" id="transferTargetCode" class="form-control" placeholder="Ex: 818205114" required>
          </div>
          <div class="form-group">
            <label>Montant en DH :</label>
            <input type="number" id="transferAmount" class="form-control" placeholder="Ex: 500" min="50" max="${window.stateManager.currentUser.walletDH || 0}" required>
          </div>
          <div style="display:flex; justify-content:flex-end; gap: 10px; margin-top: 20px;">
            <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
            <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 20px;">
              <i class="fas fa-paper-plane"></i> Confirmer le Virement
            </button>
          </div>
        </form>
      `
    );
  }

  handleTransferSubmit(e) {
    e.preventDefault();
    const targetCode = document.getElementById('transferTargetCode').value.trim();
    const amount = Number(document.getElementById('transferAmount').value) || 0;
    const current = window.stateManager.currentUser;

    if (amount <= 0 || amount > current.walletDH) {
      window.app.showToast('Montant invalide ou solde insuffisant.', 'error');
      return;
    }

    const target = window.stateManager.getMemberByCode(targetCode);
    if (!target) {
      window.app.showToast('Code destinataire introuvable dans le réseau.', 'error');
      return;
    }

    current.walletDH -= amount;
    target.walletDH = (target.walletDH || 0) + amount;

    const trfRef = 'TRF-' + Math.floor(1000 + Math.random() * 9000);

    // Débit sur compte expéditeur
    window.stateManager.transactions.unshift({
      memberCode: current.code,
      date: new Date().toLocaleDateString('fr-FR'),
      ref: trfRef,
      desc: `Transfert E-Point envoyé à ${target.name} (${target.code})`,
      type: 'debit',
      amount: amount,
      status: 'Effectué'
    });

    // Crédit sur compte destinataire
    window.stateManager.transactions.unshift({
      memberCode: target.code,
      date: new Date().toLocaleDateString('fr-FR'),
      ref: trfRef + '-RCV',
      desc: `Transfert E-Point reçu de ${current.name} (${current.code})`,
      type: 'credit',
      amount: amount,
      status: 'Effectué'
    });

    window.stateManager.saveState();
    window.app.closeModal();
    window.app.showToast(`Transfert de ${amount} DH effectué avec succès vers ${target.name}.`, 'success');
    this.render();
  }

  showWithdrawModal() {
    window.app.showModal(
      `Demande de Virement Bancaire (Réseau Maroc)`,
      `
        <form id="formWithdraw" onsubmit="window.bonusController.handleWithdrawSubmit(event)">
          <div class="form-group">
            <label>Banque Partenaire :</label>
            <select id="withdrawBank" class="form-control" required>
              <option value="Attijariwafa Bank">Attijariwafa Bank</option>
              <option value="CIH Bank">CIH Bank</option>
              <option value="Bank of Africa (BMCE)">Bank of Africa (BMCE)</option>
              <option value="Banque Populaire (BCP)">Banque Populaire (BCP)</option>
              <option value="Crédit Agricole du Maroc">Crédit Agricole du Maroc</option>
              <option value="CFG Bank">CFG Bank</option>
            </select>
          </div>
          <div class="form-group">
            <label>Numéro de Compte (RIB 24 chiffres) :</label>
            <input type="text" id="withdrawRIB" class="form-control" placeholder="123456789012345678901234" maxlength="24" required>
          </div>
          <div class="form-group">
            <label>Montant du Virement (en DH) :</label>
            <input type="number" id="withdrawAmount" class="form-control" placeholder="Ex: 2000" min="200" max="${window.stateManager.currentUser.walletDH || 0}" required>
            <small style="color: #64748b;">Solde actuel disponible : ${window.stateManager.formatMoney(window.stateManager.currentUser.walletDH || 0)}</small>
          </div>
          <div style="display:flex; justify-content:flex-end; gap: 10px; margin-top: 20px;">
            <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Annuler</button>
            <button type="submit" class="btn-primary-auth" style="width: auto; padding: 10px 20px;">
              <i class="fas fa-university"></i> Confirmer la Demande
            </button>
          </div>
        </form>
      `
    );
  }

  handleWithdrawSubmit(e) {
    e.preventDefault();
    const bank = document.getElementById('withdrawBank').value;
    const rib = document.getElementById('withdrawRIB').value.trim();
    const amount = Number(document.getElementById('withdrawAmount').value) || 0;
    const current = window.stateManager.currentUser;

    if (amount <= 0 || amount > current.walletDH) {
      window.app.showToast('Montant invalide ou solde insuffisant.', 'error');
      return;
    }

    current.walletDH -= amount;

    window.stateManager.transactions.unshift({
      memberCode: current.code,
      date: new Date().toLocaleDateString('fr-FR'),
      ref: 'WD-' + Math.floor(1000 + Math.random() * 9000),
      desc: `Virement bancaire vers ${bank} (RIB ...${rib.slice(-4)})`,
      type: 'debit',
      amount: amount,
      status: 'Transmis à la Banque'
    });

    window.stateManager.saveState();
    window.app.closeModal();
    window.app.showToast(`Demande de virement de ${amount} DH transmise à ${bank}.`, 'success');
    this.render();
  }
}

window.bonusController = new BonusController();
