/**
 * Routini eWorld MLM - Application Principale & Routage des Vues
 * Modèle : ROUTINE ONE PLAN
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
      document.getElementById('quickRoleBar').style.display = 'flex';
      this.renderAllViews();
      this.switchView('dashboard');
    } else {
      document.getElementById('authSection').style.display = 'flex';
      document.getElementById('appMainLayout').style.display = 'none';
      document.getElementById('quickRoleBar').style.display = 'none';
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
        const sv = card.getAttribute('data-sv') || Math.round(Number(pv) * 4.2);
        document.getElementById('selectedKitPV').value = pv;
        if (document.getElementById('selectedKitSV')) {
          document.getElementById('selectedKitSV').value = sv;
        }
      });
    });
  }

  switchView(viewName) {
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
    const titles = {
      dashboard: { title: 'Tableau de Bord ROUTINE ONE PLAN', desc: 'Aperçu général de vos performances, ventes et qualifications' },
      genealogy: { title: 'Arbre Généalogique & Réseau', desc: 'Suivi sur 3 niveaux (10% - 5% - 3%) et bonus Leadership' },
      shop: { title: 'Boutique Cosmétiques & Packs Routines', desc: 'Soins de beauté, rituels complets et accumulation directe de PV / SV' },
      bonus: { title: 'Portefeuille E-Point & Commissions', desc: 'Détail certifié des 4 sources de gains et simulateur en direct' },
      sponsor: { title: 'Parrainage & Inscription Partenaire (0 DH)', desc: 'Adhésion gratuite sans achat forcé • Seule la vente déclenche la prime' },
      admin: { title: 'Direction Générale Routini', desc: 'Contrôle suprême, modification des SV/CV, PV, produits & packs' }
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

    if (nameEl) nameEl.textContent = user.name;
    if (codeEl) codeEl.textContent = `ID: ${user.code}`;
    if (rankEl) {
      rankEl.textContent = user.rankName || user.rankCode;
      rankEl.className = `rank-pill rank-${(user.rankCode || 'partner').toLowerCase()}`;
      if (user.role === 'owner') {
        rankEl.classList.add('owner-badge');
        avatarEl.classList.add('is-owner');
        avatarEl.innerHTML = '<i class="fas fa-crown"></i>';
      } else {
        avatarEl.classList.remove('is-owner');
        avatarEl.textContent = user.name.charAt(0);
      }
    }

    if (navAdmin) {
      if (window.stateManager.isOwner()) {
        navAdmin.style.display = 'flex';
      } else {
        navAdmin.style.display = 'none';
      }
    }

    const walletEl = document.getElementById('headerWalletAmount');
    if (walletEl) {
      walletEl.textContent = window.stateManager.formatMoney(user.walletDH || 0);
    }
  }

  updateQuickRoleBar() {
    const currentUser = window.stateManager.currentUser;
    const currentNameEl = document.getElementById('quickCurrentUserName');
    const currentRoleTag = document.getElementById('quickCurrentRoleTag');

    if (currentUser && currentNameEl) {
      currentNameEl.textContent = `${currentUser.name} (${currentUser.code})`;
      if (currentUser.role === 'owner') {
        currentRoleTag.textContent = 'DIRECTION FONDATRICE';
        currentRoleTag.style.background = '#0f172a';
      } else {
        currentRoleTag.textContent = `${currentUser.rankCode} — ONE PLAN`;
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
    const success = window.stateManager.switchUser(code);
    if (success) {
      this.renderAllViews();
      this.showToast(`Profil activé : ${window.stateManager.currentUser.name} (${window.stateManager.currentUser.rankCode})`, 'success');
    }
  }

  renderDashboard() {
    const user = window.stateManager.currentUser;
    if (!user) return;

    document.getElementById('dashPPV').textContent = `${user.ppv || 0} PV`;
    document.getElementById('dashGPV').textContent = `${(user.teamPV || user.gpv || 0).toLocaleString('fr-FR')} PV`;
    document.getElementById('dashSV').textContent = `${user.sv || 0} SV/CV`;
    document.getElementById('dashWallet').textContent = window.stateManager.formatMoney(user.walletDH || 0);

    const directs = window.stateManager.getDirectDownlines(user.code);
    const activeDirects = directs.filter(d => window.stateManager.isMemberActive(d)).length;
    document.getElementById('dashDownlinesCount').textContent = `${directs.length} Filleuls (${activeDirects} actifs)`;

    // Progression vers le prochain grade selon Slide 6
    let nextTarget = 500;
    let nextRank = 'Builder (500 PV • 2 actifs)';
    let currentProg = 30;

    const teamPV = user.teamPV || user.gpv || 0;

    if (user.rankCode === 'PARTNER') {
      nextTarget = 500;
      nextRank = 'Builder (500 PV • 2 actifs)';
      currentProg = Math.min(100, Math.round((teamPV / nextTarget) * 100));
    } else if (user.rankCode === 'BUILDER') {
      nextTarget = 2500;
      nextRank = 'Leader (2 500 PV • 3 Builders)';
      currentProg = Math.min(100, Math.round((teamPV / nextTarget) * 100));
    } else if (user.rankCode === 'LEADER') {
      nextTarget = 10000;
      nextRank = 'Manager (10 000 PV • 3 Leaders)';
      currentProg = Math.min(100, Math.round((teamPV / nextTarget) * 100));
    } else if (user.rankCode === 'MANAGER') {
      nextTarget = 30000;
      nextRank = 'Diamond (30 000 PV • 3 Managers)';
      currentProg = Math.min(100, Math.round((teamPV / nextTarget) * 100));
    } else if (user.rankCode === 'DIAMOND') {
      nextTarget = 100000;
      nextRank = 'Ambassador (100 000 PV • 3 Diamonds)';
      currentProg = Math.min(100, Math.round((teamPV / nextTarget) * 100));
    } else if (user.rankCode === 'AMBASSADOR') {
      nextRank = 'Ambassador (Palier Suprême 7%)';
      currentProg = 100;
    }

    const fillEl = document.getElementById('dashQualifFill');
    const labelEl = document.getElementById('dashQualifText');
    const rankTargetEl = document.getElementById('dashNextRankName');

    if (fillEl) fillEl.style.width = `${currentProg}%`;
    if (labelEl) labelEl.textContent = `${currentProg}% vers l'objectif`;
    if (rankTargetEl) rankTargetEl.textContent = nextRank;

    const recentTable = document.getElementById('dashRecentOrdersBody');
    if (recentTable) {
      const recentOrders = window.stateManager.orders.slice(0, 5);
      recentTable.innerHTML = recentOrders.map(o => `
        <tr>
          <td><span style="font-family: monospace; font-weight:700;">${o.id}</span></td>
          <td>${o.date}</td>
          <td><strong>${o.memberName}</strong></td>
          <td><strong style="color: var(--rtn-rose);">+${o.totalPV} PV</strong></td>
          <td><span style="color: #be185d; font-weight:700;">${o.totalSV} SV</span></td>
          <td>${window.stateManager.formatMoney(o.totalDH)}</td>
          <td><span class="status-badge status-success">${o.status}</span></td>
        </tr>
      `).join('');
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
    const kitSV = Number(document.getElementById('selectedKitSV') ? document.getElementById('selectedKitSV').value : (kitPV * 4.2));

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
