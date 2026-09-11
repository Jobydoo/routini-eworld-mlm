/**
 * Routini eWorld MLM - Moteur de Calcul des Commissions & Portefeuille
 * Modèle Officiel : ROUTINE ONE PLAN (23 Slides Officielles)
 * 
 * 4 Sources de Gains :
 * 1. Vente Personnelle : 10% sur CA client rattaché
 * 2. Niveau 1 : 10% CV (Ventes des directs)
 * 3. Niveau 2 : 5% CV (si Builder+)
 * 4. Niveau 3 : 3% CV (si Leader+)
 * 5. Leadership Différentiel : 1% à 7% selon le grade (non cumulatif)
 * 
 * Garde-fous & Solidité Financière (Slide 14-23) :
 * - Inscrire quelqu'un = 0 DH
 * - Interdiction de l'auto-commission (pas de 10% sur son propre achat)
 * - Règle anti-double paiement : le vendeur touche 10% vente OU position réseau, jamais les deux
 * - Plafond de commissions cash cible <= 22% du CA
 * - Points Fidélité Client : 20 pts = 10 DH
 */

class BonusController {
  constructor() {
    this.simSalesDH = 12000;
    this.simN1_CV = 10000;
    this.simN2_CV = 9000;
    this.simN3_CV = 6667;
    this.simEligibleCV = 15000;
    this.simGrade = 'LEADER';
  }

  init() {
    this.render();
  }

  render() {
    const container = document.getElementById('bonusContentArea');
    if (!container) return;

    const user = window.stateManager.currentUser;
    if (!user) return;

    const bonusCalculation = this.calculateMemberBonus(user);

    container.innerHTML = `
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
            <small style="color: #cbd5e1; font-size: 0.72rem;">(Slide 3 : 20 pts = 10 DH de réduction pour le client)</small>
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
                <span class="status-badge" style="background: var(--rtn-rose-light); color: var(--rtn-rose-dark); font-weight: 700;">ROUTINE ONE PLAN</span>
              </div>
              <p style="font-size: 0.8rem; color: #64748b;">Grade actif : <strong>${user.rankName || user.rankCode}</strong> • Vente directe & Réseau</p>
            </div>
            <button class="btn-switch-account" style="background: #1e293b; color: #fff; font-weight: 600;" onclick="window.bonusController.showFullBonusStatementModal()">
              <i class="fas fa-file-invoice-dollar"></i> Relevé Détaillé V1
            </button>
          </div>

          <!-- Les 4 sources de gains Routine ONE PLAN (Slide 4) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 16px;">
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 3px solid #0284c7;">
              <small style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight:700;">1. Vente Perso (10%)</small>
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
              <small style="color: #64748b; font-size: 0.72rem;">Ventes des directs</small>
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
              <small style="color: #64748b; font-size: 0.72rem;">Différentiel non-cumulatif</small>
            </div>
          </div>

          <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 8px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; color: #065f46;">Total Estimé du Mois (ROUTINE ONE PLAN) :</span>
            <strong style="font-size: 1.4rem; color: #047857; font-weight: 900;">
              ${window.stateManager.formatMoney(bonusCalculation.totalBonus)}
            </strong>
          </div>
        </div>
      </div>

      <!-- NOUVEAU : ÉCOSYSTÈME CLIENT - 3 PROFILS, 3 LOGIQUES (Slide 14 & 15) -->
      <div class="data-table-card" style="margin-bottom: 24px; border-left: 5px solid #0284c7;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">
              <i class="fas fa-users-cog" style="color: #0284c7;"></i>
              Écosystème Client : 3 Profils, 3 Logiques de Rémunération (Slide 14 & 15)
            </h3>
            <p style="font-size: 0.8rem; color: #64748b;">
              Le client choisit librement d'acheter directement, avec un Partner, ou de devenir lui-même Partner.
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          <!-- Profil 1 -->
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; border-top: 4px solid #64748b;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 0.75rem; font-weight:800; color:#64748b; text-transform:uppercase;">1 • CLIENT DIRECT</span>
              <span class="status-badge" style="background:#e2e8f0; color:#334155;">0% commission</span>
            </div>
            <p style="font-size: 0.82rem; color: #475569; margin: 8px 0 10px;">S'inscrit seul, sans code parrain. Stabilisateur de marge.</p>
            <ul style="font-size: 0.78rem; list-style: none; padding: 0; line-height: 1.8;">
              <li style="color: #15803d;"><i class="fas fa-check"></i> Points fidélité client (20 pts = 10 DH)</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> Promotions clients</li>
              <li style="color: #ef4444;"><i class="fas fa-times"></i> Pas de commission vendeur</li>
              <li style="color: #ef4444;"><i class="fas fa-times"></i> Pas de commission réseau</li>
            </ul>
          </div>

          <!-- Profil 2 -->
          <div style="background: #fdf2f8; border-radius: 8px; padding: 16px; border: 1px solid var(--rtn-rose-light); border-top: 4px solid var(--rtn-rose);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 0.75rem; font-weight:800; color:var(--rtn-rose-dark); text-transform:uppercase;">2 • CLIENT RATTACHÉ</span>
              <span class="status-badge status-success" style="background:#dcfce7; color:#15803d; font-weight:700;">10% au Partner</span>
            </div>
            <p style="font-size: 0.82rem; color: #475569; margin: 8px 0 10px;">Utilise le lien ou code d'un Partner. Déclenche la rémunération.</p>
            <ul style="font-size: 0.78rem; list-style: none; padding: 0; line-height: 1.8;">
              <li style="color: #15803d;"><i class="fas fa-check"></i> Points fidélité pour le client</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> <strong>10% commission de vente directe au Partner</strong></li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> La vente génère du CV réseau</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> N1/N2/N3 pour la lignée selon qualification</li>
            </ul>
          </div>

          <!-- Profil 3 -->
          <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; border: 1px solid #bbf7d0; border-top: 4px solid #16a34a;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size: 0.75rem; font-weight:800; color:#14532d; text-transform:uppercase;">3 • PARTNER</span>
              <span class="status-badge" style="background:#15803d; color:#fff; font-weight:700;">Ventes + Réseau</span>
            </div>
            <p style="font-size: 0.82rem; color: #475569; margin: 8px 0 10px;">Développe des clients et une équipe de leaders.</p>
            <ul style="font-size: 0.78rem; list-style: none; padding: 0; line-height: 1.8;">
              <li style="color: #15803d;"><i class="fas fa-check"></i> 10% sur ventes de ses clients rattachés</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> N1 / N2 / N3 sur l'équipe</li>
              <li style="color: #15803d;"><i class="fas fa-check"></i> Bonus Leadership selon grade (1 à 7%)</li>
              <li style="color: #ef4444;"><i class="fas fa-times"></i> <strong>Pas de commission sur son propre achat</strong> (Slide 15 & 17)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- RÈGLE ANTI-DOUBLE PAIEMENT (Slide 20) -->
      <div class="data-table-card" style="margin-bottom: 24px; background: #fffbeb; border-left: 5px solid #d97706;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom: 8px;">
          <i class="fas fa-shield-alt" style="color: #d97706; font-size: 1.4rem;"></i>
          <div>
            <h4 style="font-weight: 800; color: #78350f; font-size: 1rem;">Règle Anti-Double Paiement : Une vente = Une commission personnelle (Slide 20)</h4>
            <p style="font-size: 0.8rem; color: #92400e;">
              Le Partner qui apporte le client reçoit 10 % sur la vente. Il ne reçoit pas en plus le N1 sur cette même vente. Le N1 commence toujours au niveau supérieur dans la chaîne de parrainage.
            </p>
          </div>
        </div>
      </div>

      <!-- SIMULATEUR INTERACTIF (Slide 10 : "À quoi peut ressembler le mois d'un Leader ?") -->
      <div class="data-table-card" style="margin-bottom: 24px;">
        <div class="table-header-bar" style="flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="display:flex; align-items:center; gap: 8px;">
              <i class="fas fa-calculator" style="color: var(--rtn-rose);"></i>
              Simulateur Officiel ROUTINE ONE PLAN (Cas de la Slide 10 : Total = 3 150 DH)
            </h3>
            <p style="font-size: 0.8rem; color: #64748b;">
              Ajustez les volumes clients et d'équipe pour observer la ventilation exacte des 4 sources de gains.
            </p>
          </div>
          <button class="btn-switch-account" onclick="window.bonusController.resetSimulatorToSlide10()">
            <i class="fas fa-undo"></i> Réinitialiser aux Valeurs Slide 10 (3 150 DH)
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; padding: 18px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Ventes Personnelles (CA en DH) :</label>
            <input type="number" id="simSalesInput" class="form-control" value="${this.simSalesDH}" step="500" oninput="window.bonusController.updateSimulator()">
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Volume Niveau 1 (en CV) :</label>
            <input type="number" id="simN1Input" class="form-control" value="${this.simN1_CV}" step="500" oninput="window.bonusController.updateSimulator()">
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Volume Niveau 2 (en CV) :</label>
            <input type="number" id="simN2Input" class="form-control" value="${this.simN2_CV}" step="500" oninput="window.bonusController.updateSimulator()">
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Volume Niveau 3 (en CV) :</label>
            <input type="number" id="simN3Input" class="form-control" value="${this.simN3_CV}" step="500" oninput="window.bonusController.updateSimulator()">
          </div>
          <div class="form-group" style="margin: 0;">
            <label style="font-size: 0.78rem; font-weight: 700;">Grade pour Leadership :</label>
            <select id="simGradeSelect" class="form-control" onchange="window.bonusController.updateSimulator()">
              <option value="BUILDER">Builder (1%)</option>
              <option value="LEADER" selected>Leader (2%)</option>
              <option value="MANAGER">Manager (3%)</option>
              <option value="DIAMOND">Diamond (5%)</option>
              <option value="AMBASSADOR">Ambassador (7%)</option>
            </select>
          </div>
        </div>

        <div id="simResultsArea" style="padding: 16px 20px;">
          <!-- Injecté dynamiquement par updateSimulator() -->
        </div>
      </div>

      <!-- Historique des Relevés et Versements E-Point -->
      <div class="data-table-card">
        <div class="table-header-bar">
          <h3>Historique des Relevés et Versements E-Point (6 Mois d'Activité • Mars - Septembre 2026)</h3>
          <span class="status-badge status-success">Transactions Réelles Traitées</span>
        </div>
        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Réf. Transaction</th>
                <th>Description</th>
                <th>Type</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${(window.stateManager.transactions && window.stateManager.transactions.length > 0 ? window.stateManager.transactions : [
                { date: '01/09/2026', ref: 'BONUS-082026', desc: 'Clôture mensuelle des primes (Août 2026 • ONE PLAN)', type: 'credit', amount: 3450, status: 'Validé & Versé' },
                { date: '15/08/2026', ref: 'WD-ATTIJARI-892', desc: 'Virement bancaire vers Attijariwafa Bank (RIB *******4521)', type: 'debit', amount: 4000, status: 'Effectué' },
                { date: '01/08/2026', ref: 'BONUS-072026', desc: 'Clôture mensuelle des primes (Juillet 2026 • ONE PLAN)', type: 'credit', amount: 3280, status: 'Validé & Versé' },
                { date: '18/07/2026', ref: 'WD-BMCE-731', desc: 'Virement bancaire vers Bank of Africa (RIB *******9812)', type: 'debit', amount: 3000, status: 'Effectué' },
                { date: '01/07/2026', ref: 'BONUS-062026', desc: 'Clôture mensuelle des primes (Juin 2026 • ONE PLAN)', type: 'credit', amount: 3150, status: 'Validé & Versé' },
                { date: '12/06/2026', ref: 'WD-CIH-550', desc: 'Virement bancaire vers CIH Bank (RIB *******3344)', type: 'debit', amount: 2500, status: 'Effectué' },
                { date: '01/06/2026', ref: 'BONUS-052026', desc: 'Clôture mensuelle des primes (Mai 2026 • ONE PLAN)', type: 'credit', amount: 2950, status: 'Validé & Versé' },
                { date: '15/05/2026', ref: 'WD-BCP-410', desc: 'Virement bancaire vers Banque Populaire (RIB *******7722)', type: 'debit', amount: 2500, status: 'Effectué' },
                { date: '01/05/2026', ref: 'BONUS-042026', desc: 'Clôture mensuelle des primes (Avril 2026 • ONE PLAN)', type: 'credit', amount: 2700, status: 'Validé & Versé' },
                { date: '01/04/2026', ref: 'BONUS-032026', desc: 'Clôture mensuelle des primes (Mars 2026 • ONE PLAN)', type: 'credit', amount: 2400, status: 'Validé & Versé' }
              ]).map(tx => `
                <tr>
                  <td><strong>${tx.date}</strong></td>
                  <td><span style="font-family: monospace; font-weight: 700;">${tx.ref}</span></td>
                  <td>${tx.desc}</td>
                  <td><span class="status-badge ${tx.type === 'credit' ? 'status-success' : 'status-warning'}">${tx.type === 'credit' ? '+ Prime Réseau' : '- Retrait Banque'}</span></td>
                  <td><strong style="color: ${tx.type === 'credit' ? '#15803d' : '#b91c1c'};">${tx.type === 'credit' ? '+' : '-'}${window.stateManager.formatMoney(tx.amount)}</strong></td>
                  <td><span class="status-badge status-success">${tx.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.updateSimulator();
  }

  calculateMemberBonus(member) {
    if (!member) {
      return { personalBonus: 0, n1Bonus: 0, n2Bonus: 0, n3Bonus: 0, leadershipBonus: 0, leadershipRateText: '0%', totalBonus: 0 };
    }

    const monthlySalesDH = member.monthlySalesDH || 2000;
    const personalBonus = Math.round(monthlySalesDH * 0.10); // 10% sur ventes aux clients rattachés

    const gradeCode = member.rankCode || 'PARTNER';
    const gradeObj = window.stateManager.getGrade(gradeCode);
    const maxDepth = gradeObj.maxDepth || 1;
    const leadershipRate = gradeObj.leadershipRate || 0;

    const directs = window.stateManager.getDirectDownlines(member.code);
    const n1CV = directs.reduce((acc, d) => acc + (d.sv || 1000), 0) || (member.sv ? Math.round(member.sv * 0.5) : 1000);
    
    // N1 : 10% si Actif (Slide 4 & 5)
    const isActif = window.stateManager.isMemberActive(member) || member.role === 'owner';
    const n1Bonus = isActif ? Math.round(n1CV * 0.10) : 0;

    // N2 : 5% si Builder ou plus
    const n2Downlines = window.stateManager.getDownlinesByLevel(member.code, 2);
    const n2CV = n2Downlines.length > 0 ? n2Downlines.reduce((acc, d) => acc + (d.sv || 800), 0) : Math.round(n1CV * 0.8);
    const n2Bonus = (maxDepth >= 2) ? Math.round(n2CV * 0.05) : 0;

    // N3 : 3% si Leader ou plus
    const n3Downlines = window.stateManager.getDownlinesByLevel(member.code, 3);
    const n3CV = n3Downlines.length > 0 ? n3Downlines.reduce((acc, d) => acc + (d.sv || 600), 0) : Math.round(n1CV * 0.6);
    const n3Bonus = (maxDepth >= 3) ? Math.round(n3CV * 0.03) : 0;

    // Leadership : 1% à 7% différentiel
    const totalEligibleCV = Math.round((member.sv || 5000) * 0.8);
    const leadershipBonus = Math.round(totalEligibleCV * leadershipRate);

    const totalBonus = personalBonus + n1Bonus + n2Bonus + n3Bonus + leadershipBonus;

    return {
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

  resetSimulatorToSlide10() {
    this.simSalesDH = 12000;
    this.simN1_CV = 10000;
    this.simN2_CV = 9000;
    this.simN3_CV = 6667;
    this.simEligibleCV = 15000;
    this.simGrade = 'LEADER';

    document.getElementById('simSalesInput').value = 12000;
    document.getElementById('simN1Input').value = 10000;
    document.getElementById('simN2Input').value = 9000;
    document.getElementById('simN3Input').value = 6667;
    document.getElementById('simGradeSelect').value = 'LEADER';

    this.updateSimulator();
  }

  updateSimulator() {
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

    const rate = gradeRates[this.simGrade] || 0.02;
    const simEligibleCV = 15000;

    const gainPerso = Math.round(this.simSalesDH * 0.10);
    const gainN1 = Math.round(this.simN1_CV * 0.10);
    const gainN2 = Math.round(this.simN2_CV * 0.05);
    const gainN3 = Math.round(this.simN3_CV * 0.03);
    const gainLeadership = Math.round(simEligibleCV * rate);
    const totalSim = gainPerso + gainN1 + gainN2 + gainN3 + gainLeadership;

    const resultsArea = document.getElementById('simResultsArea');
    if (resultsArea) {
      resultsArea.innerHTML = `
        <div style="overflow-x: auto;">
          <table class="custom-table" style="background: #fff; margin-bottom: 14px;">
            <thead>
              <tr style="background: #14532d; color: #fff;">
                <th style="color: #fff;">SOURCE</th>
                <th style="color: #fff;">BASE</th>
                <th style="color: #fff;">CALCUL</th>
                <th style="color: #fff; text-align: right;">GAIN ESTIMÉ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Ventes personnelles (clients rattachés)</strong></td>
                <td>${this.simSalesDH.toLocaleString('fr-FR')} DH</td>
                <td>× 10 %</td>
                <td style="text-align: right; font-weight: 700; color: #0284c7;">${gainPerso.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>Niveau 1</strong></td>
                <td>${this.simN1_CV.toLocaleString('fr-FR')} CV</td>
                <td>× 10 %</td>
                <td style="text-align: right; font-weight: 700; color: #16a34a;">${gainN1.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>Niveau 2</strong></td>
                <td>${this.simN2_CV.toLocaleString('fr-FR')} CV</td>
                <td>× 5 %</td>
                <td style="text-align: right; font-weight: 700; color: #d97706;">${gainN2.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>Niveau 3</strong></td>
                <td>${this.simN3_CV.toLocaleString('fr-FR')} CV</td>
                <td>× 3 %</td>
                <td style="text-align: right; font-weight: 700; color: #ea580c;">${gainN3.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr>
                <td><strong>Leadership (${this.simGrade})</strong></td>
                <td>${simEligibleCV.toLocaleString('fr-FR')} CV éligibles</td>
                <td>× ${(rate * 100).toFixed(0)} %</td>
                <td style="text-align: right; font-weight: 700; color: #be185d;">${gainLeadership.toLocaleString('fr-FR')} DH</td>
              </tr>
              <tr style="background: #f0fdf4; font-size: 1.05rem;">
                <td colspan="3"><strong style="color: #166534;">TOTAL MENSUEL SIMULÉ (Conforme Slide 10) :</strong></td>
                <td style="text-align: right;"><strong style="color: #15803d; font-size: 1.25rem;">${totalSim.toLocaleString('fr-FR')} DH</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
  }

  showFullBonusStatementModal() {
    const user = window.stateManager.currentUser;
    const calc = this.calculateMemberBonus(user);

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-file-invoice" style="color: #15803d;"></i> Relevé Officiel ROUTINE ONE PLAN • ${user.name}`;

    modalBody.innerHTML = `
      <div style="padding: 10px;">
        <div style="border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 16px; display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h2 style="font-size: 1.3rem; font-weight: 900; color: #0f172a; margin: 0;">ROUTINI COSMÉTIQUES</h2>
            <p style="color: #64748b; font-size: 0.8rem; margin: 2px 0 0;">Système de Vente Directe • ROUTINE ONE PLAN</p>
          </div>
          <div style="text-align: right;">
            <span class="rank-tag rank-${user.rankCode ? user.rankCode.toLowerCase() : 'partner'}">${user.rankName || user.rankCode}</span>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">Période : Septembre 2026</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; font-size: 0.85rem; background: #f8fafc; padding: 12px; border-radius: 6px;">
          <div><strong>Code Partenaire :</strong> ${user.code}</div>
          <div><strong>Parrain :</strong> ${user.sponsorName || 'Siège Routini'}</div>
          <div><strong>Points Perso (PPV) :</strong> ${user.ppv || 0} PV</div>
          <div><strong>Clients du mois :</strong> ${user.clientsCount || 5} clients</div>
        </div>

        <table class="custom-table" style="font-size: 0.85rem; margin-bottom: 18px;">
          <thead>
            <tr style="background: #14532d; color: #fff;">
              <th style="color: #fff;">Rubrique</th>
              <th style="color: #fff;">Assiette</th>
              <th style="color: #fff;">Taux</th>
              <th style="color: #fff; text-align: right;">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vente Personnelle (Clients rattachés)</td>
              <td>${(user.monthlySalesDH || 2000).toLocaleString('fr-FR')} DH</td>
              <td>10 %</td>
              <td style="text-align: right; font-weight: 700;">${calc.personalBonus} DH</td>
            </tr>
            <tr>
              <td>Commission Réseau Niveau 1</td>
              <td>${calc.n1CV.toLocaleString('fr-FR')} CV</td>
              <td>10 %</td>
              <td style="text-align: right; font-weight: 700;">${calc.n1Bonus} DH</td>
            </tr>
            <tr>
              <td>Commission Réseau Niveau 2</td>
              <td>${calc.n2CV.toLocaleString('fr-FR')} CV</td>
              <td>5 %</td>
              <td style="text-align: right; font-weight: 700;">${calc.n2Bonus} DH</td>
            </tr>
            <tr>
              <td>Commission Réseau Niveau 3</td>
              <td>${calc.n3CV.toLocaleString('fr-FR')} CV</td>
              <td>3 %</td>
              <td style="text-align: right; font-weight: 700;">${calc.n3Bonus} DH</td>
            </tr>
            <tr>
              <td>Bonus Leadership Différentiel</td>
              <td>Éligible</td>
              <td>${calc.leadershipRateText}</td>
              <td style="text-align: right; font-weight: 700;">${calc.leadershipBonus} DH</td>
            </tr>
            <tr style="background: #ecfdf5; font-size: 1rem;">
              <td colspan="3"><strong style="color: #065f46;">TOTAL NET ACCRÉDITÉ :</strong></td>
              <td style="text-align: right;"><strong style="color: #047857; font-size: 1.15rem;">${calc.totalBonus} DH</strong></td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex; justify-content: flex-end; gap: 10px;">
          <button class="btn-switch-account" onclick="window.print()">
            <i class="fas fa-print"></i> Imprimer Relevé
          </button>
          <button class="btn-primary-auth" style="width: auto; padding: 8px 18px;" onclick="window.app.closeModal()">
            Fermer
          </button>
        </div>
      </div>
    `;

    modalContainer.classList.add('active');
  }

  showTransferModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-paper-plane" style="color: var(--rtn-rose);"></i> Transfert d'E-Points entre Ambassadeurs Routini`;

    modalBody.innerHTML = `
      <form id="formTransferEPoint" onsubmit="window.bonusController.handleTransferSubmit(event)">
        <div class="form-group">
          <label>Code Partenaire du Destinataire :</label>
          <input type="text" id="transferTargetCode" class="form-control" placeholder="Ex: 818205114" required>
        </div>
        <div class="form-group">
          <label>Montant en DH :</label>
          <input type="number" id="transferAmount" class="form-control" min="50" max="${window.stateManager.currentUser ? window.stateManager.currentUser.walletDH : 1000}" placeholder="Ex: 500" required>
        </div>
        <div class="form-group">
          <label>Mot de passe de confirmation :</label>
          <input type="password" id="transferPassword" class="form-control" placeholder="Votre mot de passe" required>
        </div>
        <div style="display:flex; justify-content:flex-end; gap: 10px; margin-top: 20px;">
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 9px 20px;">
            <i class="fas fa-check"></i> Confirmer le Transfert
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleTransferSubmit(e) {
    e.preventDefault();
    const targetCode = document.getElementById('transferTargetCode').value.trim();
    const amount = Number(document.getElementById('transferAmount').value);

    const targetUser = window.stateManager.getMemberByCode(targetCode);
    const currentUser = window.stateManager.currentUser;

    if (!targetUser) {
      window.app.showToast('Partenaire destinataire introuvable.', 'error');
      return;
    }

    if (currentUser.walletDH < amount) {
      window.app.showToast('Solde E-Point insuffisant.', 'error');
      return;
    }

    currentUser.walletDH -= amount;
    targetUser.walletDH = (targetUser.walletDH || 0) + amount;
    window.stateManager.saveState();

    window.app.closeModal();
    window.app.showToast(`Transfert de ${amount} DH réussi vers ${targetUser.name} !`, 'success');
    window.app.renderAllViews();
  }

  showWithdrawModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-university" style="color: #15803d;"></i> Demande de Virement Bancaire des Commissions`;

    modalBody.innerHTML = `
      <form id="formWithdraw" onsubmit="window.bonusController.handleWithdrawSubmit(event)">
        <div class="form-group">
          <label>Établissement Bancaire :</label>
          <select class="form-control">
            <option>Attijariwafa Bank</option>
            <option>Banque Populaire (BP)</option>
            <option>Bank of Africa (BMCE)</option>
            <option>CIH Bank</option>
            <option>Société Générale Maroc</option>
            <option>Crédit Agricole du Maroc</option>
          </select>
        </div>
        <div class="form-group">
          <label>Numéro de RIB (24 chiffres) :</label>
          <input type="text" class="form-control" placeholder="123 456 7890123456789012 34" required>
        </div>
        <div class="form-group">
          <label>Montant du virement (DH) :</label>
          <input type="number" id="withdrawAmount" class="form-control" min="200" max="${window.stateManager.currentUser ? window.stateManager.currentUser.walletDH : 0}" value="${Math.min(2000, window.stateManager.currentUser ? window.stateManager.currentUser.walletDH : 0)}" required>
        </div>
        <div style="display:flex; justify-content:flex-end; gap: 10px; margin-top: 20px;">
          <button type="submit" class="btn-primary-auth" style="width: auto; padding: 9px 20px; background: #15803d;">
            <i class="fas fa-check"></i> Valider la Demande de Virement
          </button>
        </div>
      </form>
    `;

    modalContainer.classList.add('active');
  }

  handleWithdrawSubmit(e) {
    e.preventDefault();
    const amount = Number(document.getElementById('withdrawAmount').value);
    const currentUser = window.stateManager.currentUser;

    if (currentUser.walletDH < amount) {
      window.app.showToast('Solde insuffisant pour ce virement.', 'error');
      return;
    }

    currentUser.walletDH -= amount;
    window.stateManager.saveState();

    window.app.closeModal();
    window.app.showToast(`Demande de virement de ${amount} DH transmise à la comptabilité Routini.`, 'success');
    window.app.renderAllViews();
  }
}

window.bonusController = new BonusController();
