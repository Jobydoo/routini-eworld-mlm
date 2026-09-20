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
        quickBar.style.display = 'flex';
      }
      this.renderAllViews();
      if (window.stateManager.isOwner()) {
        this.switchView('admin');
      } else {
        this.switchView('dashboard');
      }
    } else {
      document.getElementById('authSection').style.display = 'flex';
      document.getElementById('appMainLayout').style.display = 'none';
      const quickBar = document.getElementById('quickRoleBar');
      if (quickBar) quickBar.style.display = 'none';
      document.body.classList.remove('has-quick-bar');
      document.documentElement.style.setProperty('--quick-bar-height', '0px');
      const u = document.getElementById('authUsername');
      const p = document.getElementById('authPassword');
      if (u) u.value = '';
      if (p) p.value = '';
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
        this.toggleMobileSidebar();
      });
    }

    // Fermeture automatique du menu déroulant des membres au clic extérieur
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('quickMembersDropdownWrapper');
      if (dropdown && !dropdown.contains(e.target)) {
        this.closeMembersDropdown();
      }
    });

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

    // Sélecteur de Langue (4 Langues & Drapeaux Multi-pays - Délégation Globale)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-lang-flag, [data-lang]');
      if (btn) {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        if (lang && window.i18n) {
          window.i18n.setLanguage(lang);
        }
      }
    });

    // Fermeture du menu déroulant des membres en cas de clic à l'extérieur
    document.addEventListener('click', (e) => {
      const wrapper = document.getElementById('quickMembersDropdownWrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        this.closeMembersDropdown();
      }
    });

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
    this.closeMobileSidebar();
    this.closeMembersDropdown();

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

    // Mise à jour de la barre de navigation mobile basse
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(l => {
      const linkView = l.getAttribute('data-view');
      if (linkView === viewName) {
        l.classList.add('active');
      } else if (linkView) {
        l.classList.remove('active');
      }
    });

    // Masquer les onglets MLM sur mobile pour les clients
    document.querySelectorAll('.mlm-mobile-link').forEach(link => {
      link.style.display = isClient ? 'none' : 'flex';
    });

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

    if (window.i18n) {
      window.i18n.translateDOM();
    }
  }

  updateHeaderTitle(viewName) {
    const isClient = window.stateManager.isClient();
    const lang = (window.i18n && window.i18n.currentLang) || 'fr';

    const titles = {
      fr: {
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
      },
      en: {
        dashboard: isClient
          ? { title: 'My Routini Privilege Customer Space', desc: 'Track your skincare orders, Amana Express shipments, and loyalty points' }
          : { title: 'ROUTINI ONE PLAN V4 Dashboard', desc: 'Overview of your performances, sales and qualifications (September 2026)' },
        genealogy: { title: 'Genealogy Tree & Network', desc: '3-tier network tracking (N1 10%, N2 5%, N3 3%) and Leadership Bonus (1% to 7%)' },
        shop: isClient
          ? { title: 'Skincare & Routine Packs Store', desc: 'Order beauty rituals at Retail Price with express delivery & loyalty points' }
          : { title: 'Cosmetics Store & Routine Packs', desc: 'Beauty rituals at Member Price (90% RP), PV points (RP/10) and CV (60% MP)' },
        bonus: { title: 'E-Point Wallet & Commissions', desc: 'Official 3-month simulations, 10,000 MAD goal and detailed statements' },
        sponsor: { title: 'Partner Sponsorship & Registration (0 MAD)', desc: 'Free registration without forced purchase • Skincare sales only trigger bonus' },
        admin: { title: 'Routini General Management', desc: 'Central governance, V4 rules (MP 90%, CV 60%), financial stress testing' }
      },
      ar: {
        dashboard: isClient
          ? { title: 'مساحة العميل المميز روتيني', desc: 'تتبع طلبات العناية، شحنات أمانة إكسبريس ورصيد نقاط الولاء' }
          : { title: 'لوحة تحكم روتيني ون بلان V4', desc: 'نظرة عامة على أدائك ومبيعاتك ومؤهلاتك (سبتمبر 2026)' },
        genealogy: { title: 'شجرة الشبكة والأعضاء', desc: 'تتبع 3 مستويات (N1 10%, N2 5%, N3 3%) ومكافأة القيادة (1% إلى 7%)' },
        shop: isClient
          ? { title: 'متجر العناية ومجموعات الطقوس', desc: 'اطلب طقوس الجمال بسعر الجمهور مع توصيل سريع ونقاط ولاء' }
          : { title: 'متجر مستحضرات التجميل والطقوس', desc: 'مستحضرات بسعر العضو (90% PP)، ونقاط PV ونقاط CV (60% PM)' },
        bonus: { title: 'محفظة النقاط الإلكترونية والعمولات', desc: 'محاكاة 3 أشهر الرسمية، هدف 10,000 درهم وكشوفات الحساب' },
        sponsor: { title: 'رعاية وتسجيل الشركاء (0 درهم)', desc: 'تسجيل مجاني بدون شراء إجباري • مبيعات المستحضرات تفعل المكافأة' },
        admin: { title: 'الإدارة العامة روتيني', desc: 'التحكم المركزي، جدول V4 واختبارات القوة والمتانة المالية' }
      },
      es: {
        dashboard: isClient
          ? { title: 'Mi Espacio Cliente Privilegiado Routini', desc: 'Seguimiento de pedidos, envíos Amana Express y saldo de fidelidad' }
          : { title: 'Panel de Control ROUTINI ONE PLAN V4', desc: 'Resumen de su rendimiento, ventas y calificaciones (Septiembre 2026)' },
        genealogy: { title: 'Árbol Genealógico y Red', desc: 'Seguimiento en 3 niveles (N1 10%, N2 5%, N3 3%) y Bono de Liderazgo (1% al 7%)' },
        shop: isClient
          ? { title: 'Tienda de Cuidados y Packs de Rutinas', desc: 'Pida sus rituales al Precio Público con envío exprés y puntos de fidelidad' }
          : { title: 'Tienda de Cosméticos y Packs de Rutinas', desc: 'Cosméticos al Precio Miembro (90% PP), puntos PV (PP/10) y CV (60% PM)' },
        bonus: { title: 'Billetera E-Point y Comisiones', desc: 'Simulaciones oficiales de 3 meses, meta de 10.000 DH y extractos' },
        sponsor: { title: 'Patrocinio e Inscripción de Socio (0 DH)', desc: 'Inscripción gratuita sin compra obligatoria • Solo las ventas activan el bono' },
        admin: { title: 'Dirección General Routini', desc: 'Control central, baremo V4 (PM 90%, CV 60%), test de solidez financiera' }
      }
    };

    const langTitles = titles[lang] || titles.fr;
    const header = langTitles[viewName] || { title: 'Portail Routini eWorld', desc: '' };
    const titleEl = document.getElementById('headerTitleText');
    const descEl = document.getElementById('headerDescText');
    if (titleEl) titleEl.textContent = header.title;
    if (descEl) descEl.textContent = header.desc;
  }

  renderAllViews() {
    this.updateUserProfileDisplay();
    this.renderDashboard();
    this.updateQuickRoleBar();
    this.switchView(this.currentView);
    if (window.i18n) {
      window.i18n.translateDOM();
    }
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

  toggleMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle('mobile-open');
    if (backdrop) {
      if (isOpen) {
        backdrop.classList.add('active');
      } else {
        backdrop.classList.remove('active');
      }
    }
  }

  closeMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
  }

  toggleMembersDropdown(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const panel = document.getElementById('quickMembersDropdownPanel');
    const wrapper = document.getElementById('quickMembersDropdownWrapper');
    if (!panel || !wrapper) return;

    const isVisible = panel.style.display === 'flex';
    if (isVisible) {
      this.closeMembersDropdown();
    } else {
      panel.style.display = 'flex';
      wrapper.classList.add('open');
      this.renderQuickMembersDropdown(this._currentMemberQuery || '', this._currentMemberCategory || 'all');
      const searchInput = document.getElementById('inputSearchQuickMember');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 60);
      }
    }
  }

  closeMembersDropdown() {
    const panel = document.getElementById('quickMembersDropdownPanel');
    const wrapper = document.getElementById('quickMembersDropdownWrapper');
    if (panel) panel.style.display = 'none';
    if (wrapper) wrapper.classList.remove('open');
  }

  renderQuickMembersDropdown(query = '', category = 'all') {
    const container = document.getElementById('quickMembersListContainer');
    if (!container) return;

    const members = (window.stateManager && window.stateManager.members) || [];
    const currentUser = window.stateManager ? window.stateManager.currentUser : null;
    const q = (query || '').toLowerCase().trim();

    // Tous les comptes SAUF ADMIN001 qui a son bouton dédié distinct pour la Direction
    let list = members.filter(m => m.code !== 'ADMIN001');

    if (category && category !== 'all') {
      if (category === 'client') {
        list = list.filter(m => m.role === 'client' || m.rankCode === 'CLIENT');
      } else {
        list = list.filter(m => m.rankCode === category);
      }
    }

    if (q) {
      list = list.filter(m => 
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.code && m.code.toLowerCase().includes(q)) ||
        (m.rankName && m.rankName.toLowerCase().includes(q)) ||
        (m.rankCode && m.rankCode.toLowerCase().includes(q)) ||
        (m.city && m.city.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #64748b; font-size: 0.85rem;">
          <i class="fas fa-search" style="font-size: 1.4rem; color: var(--rtn-rose); margin-bottom: 8px; display: block;"></i>
          Aucun membre trouvé pour "${query}"
        </div>
      `;
      return;
    }

    const rankColors = {
      AMBASSADOR: { bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8', label: '💎 Ambassador 7%' },
      DIAMOND: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: '🔷 Diamond 5%' },
      MANAGER: { bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: '⭐ Manager 3%' },
      LEADER: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', label: '🎖️ Leader 2%' },
      BUILDER: { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd', label: '📦 Builder 1%' },
      PARTNER: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0', label: '👤 Partner Actif' },
      CLIENT: { bg: '#fff1f2', color: '#be123c', border: '#fecdd3', label: '🛍️ Client Direct' }
    };

    container.innerHTML = list.map(m => {
      const isCurrent = currentUser && (currentUser.code === m.code || currentUser.id === m.id);
      const initial = (m.name || 'M').charAt(0).toUpperCase();
      const rCode = m.role === 'client' ? 'CLIENT' : (m.rankCode || 'PARTNER');
      const rMeta = rankColors[rCode] || { bg: '#f8fafc', color: '#334155', border: '#cbd5e1', label: m.rankName || rCode };
      const pvDisplay = m.role === 'client' ? `${m.fidelityPoints || 0} Pts Fidélité` : `${m.ppv || 0} PPV • ${m.city || 'Maroc'}`;

      return `
        <div class="dropdown-member-item ${isCurrent ? 'active' : ''}" onclick="window.app.handleSelectQuickMember('${m.code}')">
          <div class="m-info-left">
            <div class="m-avatar" style="${isCurrent ? 'background: #fff; color: var(--rtn-rose); border: 2px solid var(--rtn-rose);' : ''}">${initial}</div>
            <div class="m-text">
              <div class="m-name">${m.name}</div>
              <div class="m-meta">${m.code} • ${pvDisplay}</div>
            </div>
          </div>
          <span class="m-rank-tag" style="background: ${rMeta.bg}; color: ${rMeta.color}; border: 1px solid ${rMeta.border || 'transparent'};">
            ${rMeta.label}
          </span>
        </div>
      `;
    }).join('');
  }

  handleSelectQuickMember(code) {
    this.closeMembersDropdown();
    this.switchAccount(code);
  }

  filterQuickMembers(query) {
    this._currentMemberQuery = query;
    this.renderQuickMembersDropdown(this._currentMemberQuery, this._currentMemberCategory || 'all');
  }

  filterMembersByCategory(category, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      event.currentTarget.classList.add('active');
    }
    this._currentMemberCategory = category;
    this.renderQuickMembersDropdown(this._currentMemberQuery || '', this._currentMemberCategory);
  }

  updateQuickRoleBar() {
    const quickBar = document.getElementById('quickRoleBar');
    if (!quickBar) return;

    quickBar.style.display = 'flex';

    // Synchronisation dynamique de la hauteur pour garantir que le logo et l'en-tête ne soient JAMAIS tronqués ni cachés
    const syncHeight = () => {
      const h = quickBar.offsetHeight || 48;
      document.documentElement.style.setProperty('--quick-bar-height', `${h}px`);
      document.body.classList.add('has-quick-bar');
    };
    syncHeight();
    if (!this._quickBarResizeBound) {
      window.addEventListener('resize', syncHeight);
      if (window.ResizeObserver) {
        new ResizeObserver(syncHeight).observe(quickBar);
      }
      this._quickBarResizeBound = true;
    }

    const currentUser = window.stateManager.currentUser;
    const currentNameEl = document.getElementById('quickCurrentUserName');
    const currentRoleTag = document.getElementById('quickCurrentRoleTag');
    const selectedMemberLabel = document.getElementById('quickSelectedMemberLabel');

    if (currentUser && currentNameEl) {
      currentNameEl.textContent = `${currentUser.name} (${currentUser.code})`;
      if (currentUser.role === 'owner') {
        currentRoleTag.textContent = 'DIRECTION FONDATRICE';
        currentRoleTag.style.background = 'var(--rtn-gold-gradient)';
        if (selectedMemberLabel) {
          selectedMemberLabel.textContent = 'Changer de profil (51 membres)';
        }
      } else if (currentUser.role === 'client') {
        currentRoleTag.textContent = 'CLIENT PRIVILÈGE (SANS ARBRE)';
        currentRoleTag.style.background = 'var(--rtn-rose-gradient)';
        if (selectedMemberLabel) {
          selectedMemberLabel.textContent = `${currentUser.name} (Client Direct)`;
        }
      } else {
        const rate = currentUser.rankCode === 'AMBASSADOR' ? '7%' :
                     currentUser.rankCode === 'DIAMOND' ? '5%' :
                     currentUser.rankCode === 'MANAGER' ? '3%' :
                     currentUser.rankCode === 'LEADER' ? '2%' :
                     currentUser.rankCode === 'BUILDER' ? '1%' : 'N1 (10% CV)';
        currentRoleTag.textContent = `${currentUser.rankCode} (${rate}) — V4`;
        currentRoleTag.style.background = 'var(--rtn-rose-gradient)';
        if (selectedMemberLabel) {
          selectedMemberLabel.textContent = `${currentUser.name} (${currentUser.rankCode})`;
        }
      }
    }

    // Gestion de l'état actif sur les boutons de la barre rapide
    const btnAdmin = document.getElementById('quickBtnAdmin');
    if (btnAdmin) {
      if (currentUser && currentUser.code === 'ADMIN001') {
        btnAdmin.classList.add('active');
      } else {
        btnAdmin.classList.remove('active');
      }
    }

    const btnDropdown = document.getElementById('btnToggleMembersDropdown');
    if (btnDropdown) {
      if (currentUser && currentUser.code !== 'ADMIN001') {
        btnDropdown.classList.add('active');
      } else {
        btnDropdown.classList.remove('active');
      }
    }

    document.querySelectorAll('.btn-switch-account').forEach(btn => {
      const target = btn.getAttribute('data-target-code');
      if (target && currentUser && (target === currentUser.code || target === currentUser.id)) {
        btn.classList.add('active');
      } else if (target) {
        btn.classList.remove('active');
      }
    });
  }

  switchAccount(code) {
    const success = window.stateManager.setCurrentUser(code);
    if (success) {
      const user = window.stateManager.currentUser;
      
      // Redirection intelligente selon les autorisations du profil sélectionné
      if (window.stateManager.isClient()) {
        this.switchView('dashboard');
      } else if (window.stateManager.isOwner()) {
        if (this.currentView === 'admin' || !this.currentView) {
          this.switchView('admin');
        } else {
          this.renderAllViews();
        }
      } else {
        // Si un distributeur était sur l'écran admin, le basculer sur le dashboard
        if (this.currentView === 'admin') {
          this.switchView('dashboard');
        } else {
          this.renderAllViews();
        }
      }

      this.updateQuickRoleBar();
      this.showToast(`Profil activé : ${user.name} (${user.rankName || user.rankCode})`, 'success');
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

      // 3. Rendu du Système de Parrainage Client Privilège (12 Mois de Validité)
      const refCode = user.referralCode || (user.code ? user.code.replace('CLT-', '') : '818101');
      const refLink = `${window.location.origin}${window.location.pathname}?ref=${refCode}`;
      const refExpiry = user.referralExpiryDate || '10/05/2027';
      const refFriends = user.referredFriends || [];

      const refCodeEl = document.getElementById('clientReferralCodeDisplay');
      const refLinkEl = document.getElementById('clientReferralLinkInput');
      const refExpiryEl = document.getElementById('clientReferralExpiryDisplay');
      const refCountEl = document.getElementById('clientReferralFriendsCount');
      const refTableEl = document.getElementById('clientReferralFriendsBody');

      if (refCodeEl) refCodeEl.textContent = refCode;
      if (refLinkEl) refLinkEl.value = refLink;
      if (refExpiryEl) refExpiryEl.textContent = refExpiry;
      if (refCountEl) refCountEl.textContent = `${refFriends.length} ami(s) parrainé(s)`;

      if (refTableEl) {
        if (refFriends.length === 0) {
          refTableEl.innerHTML = `
            <tr>
              <td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">
                <i class="fas fa-user-friends" style="font-size: 1.6rem; color: #f472b6; margin-bottom: 6px; display: block;"></i>
                Partagez votre code ou lien ci-dessus. Tout ami inscrit bénéficie de réductions et vous rapporte +50 pts pendant 12 mois !
              </td>
            </tr>
          `;
        } else {
          refTableEl.innerHTML = refFriends.map(f => `
            <tr>
              <td><strong>${f.name}</strong></td>
              <td><span style="font-family: monospace; font-weight: 700; color: #475569;">${f.cin || 'BK******'}</span></td>
              <td>${f.date || 'Récemment'}</td>
              <td><strong style="color: #15803d;">+${f.pointsEarned || 50} pts</strong></td>
              <td><span class="status-badge status-success" style="font-size: 0.72rem;">Validé (12 mois)</span></td>
            </tr>
          `).join('');
        }
      }

      // 4. Tableau des commandes client avec bouton Facture
      const clientTable = document.getElementById('dashClientOrdersBody');
      if (clientTable) {
        if (clientOrders.length === 0) {
          clientTable.innerHTML = `
            <tr>
              <td colspan="7" style="text-align: center; padding: 28px; color: #64748b;">
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
                <td style="max-width: 220px; font-size: 0.82rem;">${itemsSummary}</td>
                <td><strong style="color: #15803d; font-size: 0.95rem;">${window.stateManager.formatMoney(o.totalDH)}</strong></td>
                <td><span style="font-size: 0.8rem; color: #475569;">${o.paymentMethod || 'Carte Bancaire'}</span></td>
                <td>
                  <span class="status-badge status-success" style="font-size: 0.76rem;">${o.deliveryStatus || o.status}</span>
                  ${trackingBadge}
                </td>
                <td>
                  <button class="btn-action-invoice" onclick="window.app.showInvoiceById('${o.id}')" title="Afficher et Imprimer la Facture">
                    <i class="fas fa-file-invoice"></i> Facture
                  </button>
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
            <td>
              <button class="btn-action-invoice" onclick="window.app.showInvoiceById('${o.id}')" title="Afficher et Imprimer la Facture">
                <i class="fas fa-file-invoice"></i> Facture
              </button>
            </td>
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
          <div><strong>10% de réduction directe :</strong> Tous vos soins sont commandés avec 10% de remise immédiate.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <i class="fas fa-check-circle" style="color: #15803d; margin-top: 3px;"></i>
          <div><strong>1 pt fidélité = 10 DH PP :</strong> Même rapport avantageux que les points d'activité d'une personne parrainée !</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <i class="fas fa-check-circle" style="color: #15803d; margin-top: 3px;"></i>
          <div><strong>Programme Parrainage 12 Mois :</strong> Partagez votre code et gagnez +50 points par ami inscrit valable 12 mois.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-start;">
          <i class="fas fa-check-circle" style="color: #15803d; margin-top: 3px;"></i>
          <div><strong>Livraison Sécurisée Amana :</strong> Envoi sous 24-48h partout au Maroc avec suivi de colis en direct.</div>
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
          <strong>CIN :</strong> ${user && user.cin ? user.cin : 'BK720194'}<br>
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
    const cinInput = document.getElementById('newMemberCin');
    const cin = cinInput ? cinInput.value.trim().toUpperCase() : '';
    const email = document.getElementById('newMemberEmail').value.trim();
    const phone = document.getElementById('newMemberPhone').value.trim();
    const city = document.getElementById('newMemberCity').value.trim();
    const kitPV = Number(document.getElementById('selectedKitPV').value || 0);
    const kitSV = Number(document.getElementById('selectedKitSV') ? document.getElementById('selectedKitSV').value : (kitPV * 5.4));

    if (!cin) {
      this.showToast('Le numéro de CIN / Passeport est obligatoire pour toute adhésion.', 'error');
      if (cinInput) cinInput.focus();
      return;
    }

    const res = window.stateManager.registerNewMember({
      sponsorCode,
      fullName,
      cin,
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

  copyReferralCode() {
    const user = window.stateManager.currentUser;
    const code = user ? (user.referralCode || (user.code ? user.code.replace('CLT-', '') : '818101')) : '818101';
    navigator.clipboard.writeText(code).then(() => {
      this.showToast(`Code de parrainage copié : ${code}`, 'success');
    }).catch(() => {
      this.showToast(`Code de parrainage : ${code}`, 'info');
    });
  }

  copyReferralLink() {
    const user = window.stateManager.currentUser;
    const code = user ? (user.referralCode || (user.code ? user.code.replace('CLT-', '') : '818101')) : '818101';
    const link = `${window.location.origin}${window.location.pathname}?ref=${code}`;
    navigator.clipboard.writeText(link).then(() => {
      this.showToast('Lien de parrainage copié avec succès ! Valable 12 mois.', 'success');
    }).catch(() => {
      this.showToast(`Lien : ${link}`, 'info');
    });
  }

  showInvoiceById(orderId) {
    const order = window.stateManager.orders.find(o => o.id === orderId);
    if (order) {
      this.showInvoiceModal(order);
    } else {
      this.showToast('Commande introuvable : ' + orderId, 'error');
    }
  }

  showInvoiceModal(order) {
    if (!order) return;

    const items = order.items && order.items.length > 0 ? order.items : [
      { name: 'Soin Cosmétique Routini', qty: order.itemsCount || 1, unitPrice: Math.round((order.totalPP || order.totalDH) / (order.itemsCount || 1)), totalPrice: order.totalPP || order.totalDH, pv: order.totalPV || 0 }
    ];

    const invoiceNum = order.invoiceNumber || ('FAC-' + order.id.replace('CMD-', ''));
    const isDirectClient = (order.orderType === 'direct_client' || String(order.memberCode).startsWith('CLT') || order.clientDiscountDH > 0);
    const shippingFee = order.shippingFee !== undefined ? order.shippingFee : 35;
    const clientDiscount = order.clientDiscountDH || 0;
    const totalPP = order.totalPP || (order.totalDH - shippingFee + clientDiscount);
    const fidelityEarned = order.fidelityPoints || Math.floor(totalPP / 10);

    const invoiceHtml = `
      <div class="official-invoice-document" id="printableInvoice">
        <!-- En-tête officiel Routini Cosmétiques -->
        <div class="invoice-header">
          <div class="invoice-brand">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              <img src="assets/images/routini-brand.jpg" alt="Routini Cosmetics" style="height: 48px; border-radius: 4px; box-shadow: 0 2px 6px rgba(178, 93, 84, 0.15);">
              <div>
                <div style="font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; color: #b25d54;">Routini Cosmetics</div>
                <div style="font-size: 0.72rem; color: #8c423a; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">By Lys Horizon</div>
              </div>
            </div>
            <div class="invoice-legal-company">
              <strong>ROUTINI BEAUTY COSMETICS S.A.R.L.</strong><br>
              Capital : 1 000 000 MAD • R.C. Casablanca : 489214<br>
              Patente : 37492011 • I.F. : 52849102 • ICE : 002938475000032<br>
              Siège : Boulevard d'Anfa, Quartier Racine, Casablanca, Maroc
            </div>
          </div>
          <div class="invoice-badge-box">
            <div class="invoice-badge-title">FACTURE OFFICIELLE</div>
            <div class="invoice-badge-number">${invoiceNum}</div>
            <div class="invoice-badge-date">Date : ${order.date}</div>
            <div class="invoice-status-paid"><i class="fas fa-check-circle"></i> PAYÉE / ACQUITTÉE</div>
          </div>
        </div>

        <hr class="invoice-divider">

        <!-- Informations Destinataire & Commande -->
        <div class="invoice-parties-grid">
          <div class="invoice-party-box">
            <div class="party-label">Facturé à (Client / Partenaire) :</div>
            <div class="party-name">${order.memberName}</div>
            <div class="party-detail"><strong>Identifiant :</strong> ${order.memberCode}</div>
            <div class="party-detail"><strong>CIN / Passeport :</strong> <span class="badge-cin">${order.customerCin || 'BK720194'}</span></div>
            <div class="party-detail"><strong>Téléphone :</strong> ${order.customerPhone || '+212 661 000000'}</div>
            <div class="party-detail"><strong>Adresse :</strong> ${order.shippingAddress || 'Maroc'}</div>
          </div>
          <div class="invoice-party-box">
            <div class="party-label">Détails de Livraison & Règlement :</div>
            <div class="party-detail"><strong>Mode de règlement :</strong> ${order.paymentMethod || 'Carte Bancaire CMI'}</div>
            <div class="party-detail"><strong>Transporteur :</strong> ${order.deliveryCarrier || 'Amana Express (Poste Maroc)'}</div>
            <div class="party-detail"><strong>Suivi colis :</strong> ${order.trackingNumber || 'En préparation'}</div>
            <div class="party-detail"><strong>Statut :</strong> Expédition sous 24-48h ouvrées</div>
            <div class="party-detail"><strong>Type de compte :</strong> ${isDirectClient ? 'Client Direct Privilège' : 'Partenaire Distributeur V4'}</div>
          </div>
        </div>

        <!-- Table des Produits -->
        <table class="invoice-items-table">
          <thead>
            <tr>
              <th style="text-align: left;">Désignation du Produit / Pack</th>
              <th style="text-align: center; width: 60px;">Qté</th>
              <th style="text-align: right; width: 110px;">Prix Unitaire</th>
              <th style="text-align: center; width: 90px;">Fidélité</th>
              <th style="text-align: right; width: 120px;">Total Ligne</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>
                  <strong>${item.name}</strong>
                  ${item.pv ? `<br><small style="color: #64748b;">Valeur d'activité : ${item.pv} PV</small>` : ''}
                </td>
                <td style="text-align: center;">${item.qty}</td>
                <td style="text-align: right;">${item.unitPrice ? item.unitPrice.toFixed(2) : '—'} DH</td>
                <td style="text-align: center; color: #ca8a04; font-weight: 700;">+${Math.floor((item.totalPrice || item.unitPrice * item.qty) / 10)} pts</td>
                <td style="text-align: right; font-weight: 700;">${item.totalPrice ? item.totalPrice.toFixed(2) : (item.unitPrice * item.qty).toFixed(2)} DH</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totaux et Déductions -->
        <div class="invoice-totals-wrapper">
          <div class="invoice-notes">
            <div class="points-earned-box">
              <i class="fas fa-gift" style="color: #ca8a04; font-size: 1.2rem;"></i>
              <div>
                <strong>Points Fidélité Crédités sur cet Achat : +${fidelityEarned} points</strong><br>
                <small>Rapport officiel : 1 pt fidélité = 10 DH Prix Public (identique au barème PV parrainé)</small>
              </div>
            </div>
            ${order.totalPV ? `
              <div style="font-size: 0.78rem; color: #475569; margin-top: 6px;">
                ● Points Réseau Partenaire : <strong>+${order.totalPV} PV</strong> | Base commissions : <strong>+${order.totalSV} CV</strong>
              </div>
            ` : ''}
          </div>

          <div class="invoice-amounts-card">
            <div class="invoice-amount-row">
              <span>Sous-total Prix Public :</span>
              <span>${totalPP.toFixed(2)} DH</span>
            </div>
            ${clientDiscount > 0 ? `
              <div class="invoice-amount-row discount">
                <span>Remise Client Privilège (-10%) :</span>
                <span>-${clientDiscount.toFixed(2)} DH</span>
              </div>
            ` : ''}
            <div class="invoice-amount-row">
              <span>Frais de Livraison (Amana Express) :</span>
              <span>+${shippingFee.toFixed(2)} DH</span>
            </div>
            <div class="invoice-amount-row total-net">
              <span>Total Net TTC Réglé :</span>
              <span style="color: #15803d;">${order.totalDH.toFixed(2)} DH</span>
            </div>
            <div style="font-size: 0.74rem; color: #64748b; text-align: right; margin-top: 4px;">
              Équivalent : ~${(order.totalDH * 0.092).toFixed(2)} EUR
            </div>
          </div>
        </div>

        <!-- Pied de page légal -->
        <div class="invoice-footer-legal">
          <p>Facture électronique acquittée générée par le système officiel Routini eWorld — Conforme aux exigences du commerce et de la vente directe au Maroc.</p>
          <p>Les réclamations ou demandes d'échange sont recevables sous 14 jours ouvrés suivant réception du colis scellé.</p>
        </div>

        <!-- Actions de la facture -->
        <div class="invoice-actions no-print">
          <button type="button" class="btn-invoice-print" onclick="window.print()">
            <i class="fas fa-print"></i> Imprimer la Facture (PDF)
          </button>
          <button type="button" class="btn-client-action-outline" onclick="window.app.closeModal()">
            Fermer
          </button>
        </div>
      </div>
    `;

    this.showModal(`Facture d'Achat Officielle — ${invoiceNum}`, invoiceHtml);
  }

  showModal(title, htmlBody) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    if (modalTitle) modalTitle.innerHTML = title;
    if (modalBody) modalBody.innerHTML = htmlBody;
    if (modalContainer) modalContainer.classList.add('active');

    if (window.i18n && window.i18n.currentLang !== 'fr') {
      window.i18n.translateDOM();
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
