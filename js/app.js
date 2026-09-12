/**
 * Routini eWorld MLM - Application Principale & Routage des Vues
 * Modèle : ROUTINE ONE PLAN — Version 4 (Septembre 2026)
 * Document de Référence : 18 Slides Officielles
 */

class App {
  constructor() {
    this.currentView = 'dashboard';
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.bindEvents();
      this.checkInitialSession();
    });
  }

  checkInitialSession() {
    if (window.stateManager.currentUser) {
      document.getElementById('authSection').style.display = 'none';
      document.getElementById('appMainLayout').style.display = 'flex';
      const quickBar = document.getElementById('quickRoleBar');
      if (quickBar) {
        quickBar.style.display = window.stateManager.isOwner() ? 'flex' : 'none';
      }
      this.renderAllViews();
      this.switchView('dashboard');
    } else {
      document.getElementById('authSection').style.display = 'flex';
      document.getElementById('appMainLayout').style.display = 'none';
      const quickBar = document.getElementById('quickRoleBar');
      if (quickBar) quickBar.style.display = 'none';
    }
  }

  bindEvents() {
    // Navigation Sidebar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = item.getAttribute('data-view');
        if (targetView) {
          this.switchView(targetView);
          const sidebar = document.getElementById('appSidebar');
          if (sidebar) sidebar.classList.remove('mobile-open');
        }
      });
    });

    // Toggle Mobile Sidebar
    const btnToggle = document.getElementById('btnToggleSidebar');
    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        document.getElementById('appSidebar').classList.toggle('mobile-open');
      });
    }

    // Sélecteur de Devise (DH / EUR)
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
      currencySelect.value = window.stateManager.currency;
      currencySelect.addEventListener('change', (e) => {
        window.stateManager.setCurrency(e.target.value);
        this.renderAllViews();
        this.showToast(`Devise mise à jour : ${e.target.value}`, 'success');
      });
    }

    // Modal Close
    const btnCloseModal = document.getElementById('btnCloseModal');
    const appModal = document.getElementById('appModal');
    if (btnCloseModal && appModal) {
      btnCloseModal.addEventListener('click', () => this.closeModal());
      appModal.addEventListener('click', (e) => {
        if (e.target === appModal) this.closeModal();
      });
    }

    // Formulaire Nouveau Membre
    const formNewMember = document.getElementById('formRegisterMember');
    if (formNewMember) {
      formNewMember.addEventListener('submit', (e) => this.handleRegisterMemberSubmit(e));
    }

    // Sélection des kits de démarrage / Packs d'adhésion
    const kitCards = document.querySelectorAll('.kit-card');
    kitCards.forEach(card => {
      card.addEventListener('click', () => {
        kitCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const pv = card.getAttribute('data-pv');
        const sv = card.getAttribute('data-sv') || Math.round(Number(pv) * 5.4);
        document.getElementById('selectedKitPV').value = pv;
        if (document.getElementById('selectedKitSV')) {
          document.getElementById('selectedKitSV').value = sv;
        }
      });
    });
  }

  switchView(viewName) {
    const isClient = window.stateManager.isClient();

    // RÈGLE STRICTE DIRECT CLIENT : Aucun accès aux sections MLM (Arbre, Commissions, Parrainage, Admin)
    if (isClient && ['genealogy', 'bonus', 'sponsor', 'admin'].includes(viewName)) {
      this.showToast('Votre compte Client Privilège n\'a pas d\'arbre généalogique ni de réseau MLM. Vous êtes sur votre espace personnel sans parrainage.', 'info');
      this.switchView('dashboard');
      return;
    }

    // Protection d'accès stricte : seul le propriétaire peut accéder à l'administration
    if (viewName === 'admin' && !window.stateManager.isOwner()) {
      this.showToast('Accès restreint : cette section est réservée à la Direction Générale Routini.', 'warning');
      this.switchView('dashboard');
      return;
    }

    this.currentView = viewName;

    const views = document.querySelectorAll('.view-panel');
    views.forEach(v => v.style.display = 'none');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));

    const targetSection = document.getElementById(`view-${viewName}`);
    const targetNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);

    if (targetSection) targetSection.style.display = 'block';
    if (targetNav) targetNav.classList.add('active');

    this.updateHeaderTitle(viewName);

    if (viewName === 'genealogy') {
      window.genealogyController.render();
    } else if (viewName === 'shop') {
      window.shopController.render();
    } else if (viewName === 'bonus') {
      window.bonusController.render();
    } else if (viewName === 'admin') {
      window.adminController.render();
    } else if (viewName === 'sponsor') {
      this.setupSponsorForm();
    } else if (viewName === 'dashboard') {
      this.renderDashboard();
    }
  }

  updateHeaderTitle(viewName) {
    const isClient = window.stateManager.isClient();

    const titles = {
      dashboard: isClient
        ? { title: 'Mon Espace Client Privilège Routini', desc: 'Suivi de vos commandes soins, expéditions Amana Express et solde fidélité' }
        : { title: 'Tableau de Bord ROUTINI ONE PLAN V4', desc: 'Aperçu général de vos performances, ventes et qualifications (Septembre 2026)' },
      genealogy: { title: 'Arbre Généalogique & Réseau', desc: 'Suivi sur 3 niveaux (N1 10%, N2 5%, N3 3%) et bonus Leadership (1% à 7%)' },
      shop: isClient
        ? { title: 'Boutique Soins & Packs Routines', desc: 'Commandez vos rituels au Prix Public avec livraison express et points fidélité' }
        : { title: 'Boutique Cosmétiques & Packs Routines', desc: 'Soins de beauté au Prix Membre (90% PP), points PV (PP/10) et CV (60% PM)' },
      bonus: { title: 'Portefeuille E-Point & Commissions', desc: 'Simulations officielles 3 mois (Slide 11), objectif 10 000 DH (Slide 13) et relevés' },
      sponsor: { title: 'Parrainage & Inscription Partenaire (0 DH)', desc: 'Adhésion gratuite sans achat forcé • Seule la vente de soins déclenche la prime' },
      admin: { title: 'Direction Générale Routini', desc: 'Contrôle central, barème V4 (PM 90%, CV 60%), stress test financier et solidité' }
    };

    const header = titles[viewName] || { title: 'Portail Routini eWorld', desc: '' };
    document.getElementById('headerTitleText').textContent = header.title;
    document.getElementById('headerDescText').textContent = header.desc;
  }

  renderAllViews() {
    this.updateUserProfileDisplay();
    this.renderDashboard();
    this.updateQuickRoleBar();
    this.switchView(this.currentView);
  }

  updateUserProfileDisplay() {
    const user = window.stateManager.currentUser;
    if (!user) return;

    const nameEl = document.getElementById('sidebarUserName');
    const codeEl = document.getElementById('sidebarUserCode');
    const rankEl = document.getElementById('sidebarUserRank');
    const avatarEl = document.getElementById('sidebarUserAvatar');
    const navAdmin = document.getElementById('navItemAdmin');
    const adminHeader = document.getElementById('adminSectionHeader');
    const isOwner = window.stateManager.isOwner();
    const isClient = window.stateManager.isClient();

    if (nameEl) nameEl.textContent = user.name;
    if (codeEl) codeEl.textContent = `ID: ${user.code}`;
    if (rankEl) {
      if (isClient) {
        rankEl.textContent = 'Client Privilège';
        rankEl.className = 'rank-pill rank-client';
        if (avatarEl) {
          avatarEl.className = 'user-avatar-circle';
          avatarEl.innerHTML = '<i class="fas fa-sparkles" style="color: #be185d;"></i>';
          avatarEl.style.background = '#fdf2f8';
          avatarEl.style.border = '2px solid #f472b6';
        }
      } else {
        rankEl.textContent = user.rankName || user.rankCode;
        rankEl.className = `rank-pill rank-${(user.rankCode || 'partner').toLowerCase()}`;
        if (user.role === 'owner') {
          rankEl.classList.add('owner-badge');
          if (avatarEl) {
            avatarEl.className = 'user-avatar-circle is-owner';
            avatarEl.innerHTML = '<i class="fas fa-crown"></i>';
          }
        } else {
          if (avatarEl) {
            avatarEl.className = 'user-avatar-circle';
            avatarEl.textContent = user.name.charAt(0);
            avatarEl.style.background = '';
            avatarEl.style.border = '';
          }
        }
      }
    }

    // Gestion de l'affichage Sidebar selon le statut (Client vs Distributeur vs Admin)
    const mlmItems = document.querySelectorAll('.mlm-nav-item');
    const clientItems = document.querySelectorAll('.client-nav-item');
    const navMainSectionTitle = document.getElementById('navMainSectionTitle');
    const navItemDashboardLabel = document.getElementById('navItemDashboardLabel');
    const navItemShopLabel = document.getElementById('navItemShopLabel');

    if (isClient) {
      mlmItems.forEach(el => el.style.display = 'none');
      clientItems.forEach(el => el.style.display = 'flex');
      if (navMainSectionTitle) navMainSectionTitle.textContent = 'Espace Client';
      if (navItemDashboardLabel) navItemDashboardLabel.textContent = 'Mon Espace Beauté';
      if (navItemShopLabel) navItemShopLabel.textContent = 'Catalogue Soins';
    } else {
      mlmItems.forEach(el => el.style.display = 'flex');
      clientItems.forEach(el => el.style.display = 'none');
      if (navMainSectionTitle) navMainSectionTitle.textContent = 'Navigation Principale';
      if (navItemDashboardLabel) navItemDashboardLabel.textContent = 'Tableau de Bord';
      if (navItemShopLabel) navItemShopLabel.textContent = 'Boutique Cosmétiques';
    }

    // Cloisonnement strict : Masquer le lien Admin et l'en-tête pour les non-propriétaires
    if (navAdmin) {
      navAdmin.style.display = isOwner ? 'flex' : 'none';
    }
    if (adminHeader) {
      adminHeader.style.display = isOwner ? 'block' : 'none';
    }

    // Affichage En-tête : Portefeuille E-Point (Distributeurs) vs Points Fidélité (Client Direct)
    const walletBox = document.getElementById('headerWalletContainer');
    const walletEl = document.getElementById('headerWalletAmount');
    const loyaltyBadge = document.getElementById('headerClientLoyaltyBadge');
    const loyaltyText = document.getElementById('headerClientLoyaltyText');

    if (isClient) {
      if (walletBox) walletBox.style.display = 'none';
      if (loyaltyBadge) loyaltyBadge.style.display = 'flex';
      if (loyaltyText) loyaltyText.textContent = `${user.fidelityPoints || 0} Pts Fidélité`;
    } else {
      if (walletBox) walletBox.style.display = 'flex';
      if (loyaltyBadge) loyaltyBadge.style.display = 'none';
      if (walletEl) walletEl.textContent = window.stateManager.formatMoney(user.walletDH || 0);
    }
  }

  updateQuickRoleBar() {
    const quickBar = document.getElementById('quickRoleBar');
    const isOwner = window.stateManager.isOwner();

    // Règle de confidentialité : La barre de switch rapide n'est visible que pour la Direction
    if (quickBar) {
      quickBar.style.display = isOwner ? 'flex' : 'none';
    }
    if (!isOwner) return;

    const currentUser = window.stateManager.currentUser;
    const currentNameEl = document.getElementById('quickCurrentUserName');
    const currentRoleTag = document.getElementById('quickCurrentRoleTag');

    if (currentUser && currentNameEl) {
      currentNameEl.textContent = `${currentUser.name} (${currentUser.code})`;
      if (currentUser.role === 'owner') {
        currentRoleTag.textContent = 'DIRECTION FONDATRICE';
        currentRoleTag.style.background = '#0f172a';
      } else if (currentUser.role === 'client') {
        currentRoleTag.textContent = 'CLIENT PRIVILÈGE DIRECT';
        currentRoleTag.style.background = '#be185d';
      } else {
        currentRoleTag.textContent = `${currentUser.rankCode} — ONE PLAN V4`;
        currentRoleTag.style.background = '#be185d';
      }
    }

    document.querySelectorAll('.btn-switch-account').forEach(btn => {
      const target = btn.getAttribute('data-target-code');
      if (target && currentUser && target === currentUser.code) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  switchAccount(code) {
    const success = window.stateManager.setCurrentUser(code);
    if (success) {
      this.renderAllViews();
      this.showToast(`Profil activé : ${window.stateManager.currentUser.name} (${window.stateManager.currentUser.rankName || window.stateManager.currentUser.rankCode})`, 'success');
    }
  }

  renderDashboard() {
    const user = window.stateManager.currentUser;
    if (!user) return;

    const isClient = window.stateManager.isClient();
    const dashMLM = document.getElementById('dashMLMSection');
    const dashClient = document.getElementById('dashClientSection');

    if (isClient) {
      if (dashMLM) dashMLM.style.display = 'none';
      if (dashClient) dashClient.style.display = 'block';

      // 1. Statistiques et Points Fidélité
      const fidelityPts = user.fidelityPoints || 0;
      const discountDH = Math.floor(fidelityPts / 20) * 10;

      const ptsEl = document.getElementById('dashClientFidelityPts');
      const discountEl = document.getElementById('dashClientDiscountVal');
      const cardPtsEl = document.getElementById('clientCardPoints');

      if (ptsEl) ptsEl.textContent = `${fidelityPts} pts`;
      if (discountEl) discountEl.textContent = `${discountDH} DH`;
      if (cardPtsEl) cardPtsEl.textContent = `${fidelityPts} Pts`;

      // 2. Filtrer les commandes propres au client direct
      const clientOrders = window.stateManager.orders.filter(o => 
        String(o.memberCode).toLowerCase() === String(user.code).toLowerCase() ||
        String(o.memberCode).toLowerCase() === String(user.id).toLowerCase()
      );

      const countEl = document.getElementById('clientCardOrdersCount');
      if (countEl) countEl.textContent = String(clientOrders.length);

      const latestOrder = clientOrders[0];
      const deliveryStatusEl = document.getElementById('clientCardDeliveryStatus');
      const trackingNumEl = document.getElementById('clientCardTrackingNum');

      if (deliveryStatusEl) {
        deliveryStatusEl.textContent = latestOrder ? (latestOrder.deliveryStatus || latestOrder.status || 'Expédiée') : 'Aucun colis';
      }
      if (trackingNumEl) {
        trackingNumEl.textContent = latestOrder && latestOrder.trackingNumber 
          ? `Amana : ${latestOrder.trackingNumber}` 
          : (latestOrder ? 'Poste Maroc (Amana)' : 'Prêt pour commande');
      }

      // 3. Tableau des commandes client
      const clientTable = document.getElementById('dashClientOrdersBody');
      if (clientTable) {
        if (clientOrders.length === 0) {
          clientTable.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; padding: 28px; color: #64748b;">
                <i class="fas fa-shopping-bag" style="font-size: 2rem; color: #f472b6; display: block; margin-bottom: 8px;"></i>
                Vous n'avez pas encore passé de commande sur votre compte client.
                <div style="margin-top: 12px;">
                  <button class="btn-client-action" onclick="window.app.switchView('shop')">
                    <i class="fas fa-cart-plus"></i> Découvrir les Soins & Rituels
                  </button>
                </div>
              </td>
            </tr>
          `;
        } else {
          clientTable.innerHTML = clientOrders.map(o => {
            const itemsSummary = (o.items && o.items.length > 0)
              ? o.items.map(i => `${i.name} (x${i.qty})`).join(', ')
              : `${o.itemsCount || 1} soin(s) de beauté`;

            const trackingBadge = o.trackingNumber 
              ? `<div style="font-size:0.75rem; color:#0284c7; font-weight:700; margin-top:3px;"><i class="fas fa-barcode"></i> ${o.trackingNumber}</div>` 
              : '';

            return `
              <tr>
                <td><strong style="font-family: monospace; color: var(--rtn-navy);">${o.id}</strong></td>
                <td>${o.date}</td>
                <td style="max-width: 240px; font-size: 0.82rem;">${itemsSummary}</td>
                <td><strong style="color: #15803d; font-size: 0.95rem;">${window.stateManager.formatMoney(o.totalDH)}</strong></td>
                <td><span style="font-size: 0.8rem; color: #475569;">${o.paymentMethod || 'Carte Bancaire'}</span></td>
                <td>
                  <span class="status-badge status-success" style="font-size: 0.76rem;">${o.deliveryStatus || o.status}</span>
                  ${trackingBadge}
                </td>
              </tr>
            `;
          }).join('');
        }
      }
      return;
    }

    // Affichage pour Distributeurs et Direction (MLM)
    if (dashMLM) dashMLM.style.display = 'block';
    if (dashClient) dashClient.style.display = 'none';

    const activity = window.stateManager.getActivityDetails(user);

    document.getElementById('dashPPV').textContent = `${user.ppv || 0} PV`;
    document.getElementById('dashGPV').textContent = `${(user.teamPV || user.gpv || 0).toLocaleString('fr-FR')} PV`;
    document.getElementById('dashSV').textContent = `${user.sv || 0} CV`;
    document.getElementById('dashWallet').textContent = window.stateManager.formatMoney(user.walletDH || 0);

    const directs = window.stateManager.getDirectDownlines(user.code);
    const activeDirects = directs.filter(d => window.stateManager.isMemberActive(d)).length;
    document.getElementById('dashDownlinesCount').textContent = `${directs.length} Filleuls (${activeDirects} actifs)`;

    // Statut sous PPV dans la carte métrique
    const ppvMeta = document.querySelector('.card-ppv .metric-meta');
    if (ppvMeta) {
      ppvMeta.innerHTML = activity.isActive 
        ? `<span class="badge-success">● Actif Qualifié (${activity.ppv}/${activity.requiredPV} PV)</span>`
        : `<span class="badge-danger" style="background:#fee2e2; color:#b91c1c; font-weight:700; padding:2px 6px; border-radius:4px;">⚠ Inactif (${activity.ppv}/${activity.requiredPV} PV requis)</span>`;
    }

    // Progression vers le prochain grade selon ROUTINI ONE PLAN V4 (Slide 7) :
    let nextTarget = 2000;
    let nextRank = 'Builder (≥ 2 000 PV équipe cumulés)';
    let currentProg = 30;

    const teamPV = (user.teamPV || 0) + (user.ppv || 0);

    const countDirectsRank = (rankCode) => {
      const order = { 'PARTNER': 1, 'BUILDER': 2, 'LEADER': 3, 'MANAGER': 4, 'DIAMOND': 5, 'AMBASSADOR': 6 };
      const req = order[rankCode] || 1;
      return directs.filter(d => {
        const dOrder = order[d.rankCode] || 1;
        return dOrder >= req && window.stateManager.isMemberActive(d);
      }).length;
    };

    if (user.rankCode === 'PARTNER') {
      nextTarget = 2000;
      nextRank = 'Builder (≥ 2 000 PV équipe cumulés)';
      currentProg = Math.min(100, Math.round((teamPV / nextTarget) * 100));
    } else if (user.rankCode === 'BUILDER') {
      const qualified = countDirectsRank('BUILDER');
      nextRank = `Leader (2 Builders actifs directs • Actuel: ${qualified}/2)`;
      currentProg = Math.min(100, Math.round((qualified / 2) * 100));
    } else if (user.rankCode === 'LEADER') {
      const qualified = countDirectsRank('LEADER');
      nextRank = `Manager (2 Leaders actifs directs • Actuel: ${qualified}/2)`;
      currentProg = Math.min(100, Math.round((qualified / 2) * 100));
    } else if (user.rankCode === 'MANAGER') {
      const qualified = countDirectsRank('MANAGER');
      nextRank = `Diamond (2 Managers actifs directs • Actuel: ${qualified}/2)`;
      currentProg = Math.min(100, Math.round((qualified / 2) * 100));
    } else if (user.rankCode === 'DIAMOND') {
      const qualified = countDirectsRank('DIAMOND');
      nextRank = `Ambassador (2 Diamonds actifs directs • Actuel: ${qualified}/2)`;
      currentProg = Math.min(100, Math.round((qualified / 2) * 100));
    } else if (user.rankCode === 'AMBASSADOR') {
      nextRank = 'Ambassador (Palier Suprême 7% Leadership)';
      currentProg = 100;
    }

    const fillEl = document.getElementById('dashQualifFill');
    const labelEl = document.getElementById('dashQualifText');
    const rankTargetEl = document.getElementById('dashNextRankName');

    if (fillEl) fillEl.style.width = `${currentProg}%`;
    if (labelEl) labelEl.textContent = `${currentProg}% complété`;
    if (rankTargetEl) rankTargetEl.textContent = nextRank;

    // Tableau des commandes : Cloisonnement strict (Direction voit tout, Distributeur voit les siennes)
    const recentTable = document.getElementById('dashRecentOrdersBody');
    if (recentTable) {
      let recentOrders = [];
      if (window.stateManager.isOwner()) {
        recentOrders = window.stateManager.orders.slice(0, 8);
      } else {
        recentOrders = window.stateManager.orders.filter(o => 
          String(o.memberCode).toLowerCase() === String(user.code).toLowerCase() ||
          String(o.memberCode).toLowerCase() === String(user.id).toLowerCase()
        ).slice(0, 8);
      }

      if (recentOrders.length === 0) {
        recentTable.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 24px; color: #64748b;">
              <i class="fas fa-shopping-bag" style="font-size: 1.6rem; color: #cbd5e1; display: block; margin-bottom: 8px;"></i>
              Aucune commande enregistrée pour votre compte pour l'instant.
              <div style="margin-top: 8px;">
                <button class="btn-switch-account" style="background: var(--rtn-navy); color: #fff;" onclick="window.app.switchView('shop')">
                  <i class="fas fa-cart-plus"></i> Commander des Cosmétiques
                </button>
              </div>
            </td>
          </tr>
        `;
      } else {
        recentTable.innerHTML = recentOrders.map(o => `
          <tr>
            <td><span style="font-family: monospace; font-weight:700;">${o.id}</span></td>
            <td>${o.date}</td>
            <td><strong>${o.memberName}</strong></td>
            <td><strong style="color: var(--rtn-rose);">+${o.totalPV} PV</strong></td>
            <td>${window.stateManager.formatMoney(o.totalDH)}</td>
            <td><span class="status-badge status-success">${o.status}</span></td>
          </tr>
        `).join('');
      }
    }
  }

  showLoyaltyDetails() {
    const user = window.stateManager.currentUser;
    const pts = user ? (user.fidelityPoints || 0) : 0;
    const discount = Math.floor(pts / 20) * 10;

    const content = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 2.8rem; margin-bottom: 8px;">👑</div>
        <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--rtn-navy);">Programme Fidélité Privilège Routini</h4>
        <p style="font-size: 0.85rem; color: #64748b;">Réservé exclusivement aux clients directs des cosmétiques Routini</p>
      </div>

      <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border-radius: 12px; padding: 18px; border: 1.5px solid #f472b6; margin-bottom: 20px; text-align: center;">
        <div style="font-size: 0.8rem; color: #9d174d; font-weight: 700; text-transform: uppercase;">Votre Solde Actuel</div>
        <div style="font-size: 2.2rem; font-weight: 800; color: #be185d; margin: 4px 0;">${pts} Points</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: #15803d;">Soit ${discount} DH de réduction immédiate !</div>
      </div>

      <div style="display: grid; gap: 12px; font-size: 0.85rem; color: #334155;">
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <i class="fas fa-check-circle" style="color: #15803d; margin-top: 3px;"></i>
          <div><strong>10% crédités en points :</strong> À chaque achat au Prix Public, 10% de votre panier est converti en points fidélité.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <i class="fas fa-check-circle" style="color: #15803d; margin-top: 3px;"></i>
          <div><strong>Barème d'échange :</strong> 20 points fidélité = 10 DH de déduction immédiate sur toute commande future.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <i class="fas fa-check-circle" style="color: #15803d; margin-top: 3px;"></i>
          <div><strong>Livraison Offerte :</strong> Dès 500 DH d'achats, expédition sécurisée Amana Express offerte partout au Maroc.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <i class="fas fa-check-circle" style="color: #15803d; margin-top: 3px;"></i>
          <div><strong>Sans Contrainte MLM :</strong> Aucun parrainage, aucun réseau, aucun abonnement. 100% liberté beauté.</div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <button class="btn-client-action" onclick="window.app.closeModal(); window.app.switchView('shop');">
          <i class="fas fa-shopping-bag"></i> Utiliser mes Avantages dans la Boutique
        </button>
      </div>
    `;

    this.showModal('Programme Fidélité Client Privilège', content);
  }

  showDeliveryInfo() {
    const user = window.stateManager.currentUser;
    const address = user ? (user.address || '14 Avenue Mohammed VI, Souissi') : '14 Avenue Mohammed VI, Souissi';
    const city = user ? (user.city || 'Rabat') : 'Rabat';
    const phone = user ? (user.phone || '+212 662 987654') : '+212 662 987654';

    const content = `
      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--rtn-navy); margin-bottom: 6px;">
          <i class="fas fa-truck" style="color: #059669;"></i> Partenariat Officiel Amana Express (Poste Maroc)
        </h4>
        <p style="font-size: 0.85rem; color: #64748b;">
          Toutes les commandes clients sont préparées depuis notre plateforme centrale et acheminées sous pli scellé et sécurisé en 24h à 48h.
        </p>
      </div>

      <div style="background: #f8fafc; border-radius: 8px; padding: 14px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--rtn-navy); margin-bottom: 8px;">Votre Adresse de Livraison Enregistrée :</div>
        <div style="font-size: 0.88rem; color: #1e293b; line-height: 1.5;">
          <strong>Destinataire :</strong> ${user ? user.name : 'Client'}<br>
          <strong>Adresse :</strong> ${address}<br>
          <strong>Ville / Région :</strong> ${city}, Maroc<br>
          <strong>Téléphone de contact :</strong> ${phone}
        </div>
      </div>

      <div style="text-align: center;">
        <button class="btn-client-action-outline" onclick="window.app.closeModal();">
          Fermer
        </button>
      </div>
    `;

    this.showModal('Suivi & Conditions de Livraison', content);
  }

  scrollToClientOrders() {
    this.switchView('dashboard');
    const tableCard = document.getElementById('clientOrdersTableCard');
    if (tableCard) {
      tableCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setupSponsorForm() {
    const user = window.stateManager.currentUser;
    const sponsorInput = document.getElementById('sponsorCodeInput');
    const sponsorNameInput = document.getElementById('sponsorNameDisplay');

    if (sponsorInput && user) {
      sponsorInput.value = user.code;
      if (sponsorNameInput) sponsorNameInput.value = user.name;
    }
  }

  handleRegisterMemberSubmit(e) {
    e.preventDefault();

    const sponsorCode = document.getElementById('sponsorCodeInput').value.trim();
    const fullName = document.getElementById('newMemberFullName').value.trim();
    const email = document.getElementById('newMemberEmail').value.trim();
    const phone = document.getElementById('newMemberPhone').value.trim();
    const city = document.getElementById('newMemberCity').value.trim();
    const kitPV = Number(document.getElementById('selectedKitPV').value || 0);
    const kitSV = Number(document.getElementById('selectedKitSV') ? document.getElementById('selectedKitSV').value : (kitPV * 5.4));

    const res = window.stateManager.registerNewMember({
      sponsorCode,
      fullName,
      email,
      phone,
      city,
      kitPV,
      kitSV
    });

    if (res.success) {
      this.showToast(`Adhésion validée (0 DH) ! Nouveau Code Partenaire : ${res.member.code}`, 'success');
      document.getElementById('formRegisterMember').reset();
      this.setupSponsorForm();
      this.renderAllViews();
      this.switchView('genealogy');
    } else {
      this.showToast(res.message, 'error');
    }
  }

  showModal(title, htmlBody) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    if (modalTitle) modalTitle.innerHTML = title;
    if (modalBody) modalBody.innerHTML = htmlBody;
    if (modalContainer) modalContainer.classList.add('active');
  }

  closeModal() {
    const modal = document.getElementById('appModal');
    if (modal) modal.classList.remove('active');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    else if (type === 'error') icon = 'exclamation-circle';
    else if (type === 'warning') icon = 'exclamation-triangle';

    toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

window.app = new App();
