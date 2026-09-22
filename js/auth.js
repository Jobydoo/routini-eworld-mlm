/**
 * Routini eWorld MLM - Gestionnaire d'Authentification et de Rôles
 */

class AuthController {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    // Onglets de connexion (Client Direct vs Distributeur vs Propriétaire / Administrateur)
    const tabClient = document.getElementById('tabClient');
    const tabDistributor = document.getElementById('tabDistributor');
    const tabOwner = document.getElementById('tabOwner');
    const authCard = document.getElementById('authCard');
    const loginForm = document.getElementById('loginForm');
    const codeInput = document.getElementById('authUsername');
    const passInput = document.getElementById('authPassword');
    const authRoleLabel = document.getElementById('authRoleLabel');
    const authSubmitBtn = document.getElementById('btnSubmitAuth');
    const demoClientWrapper = document.getElementById('demoClientSelectWrapper');
    const demoSelect = document.getElementById('demoClientSelect');
    const clientRegisterPromo = document.getElementById('clientRegisterPromo');

    // Assurer que les champs sont toujours vides au chargement
    if (codeInput) codeInput.value = '';
    if (passInput) passInput.value = '';

    if (demoSelect) {
      demoSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val) {
          codeInput.value = val;
          passInput.value = '';
          passInput.focus();
        }
      });
    }

    const enforceNumericOnly = () => {
      const isOwner = tabOwner && tabOwner.classList.contains('active');
      if (!isOwner && codeInput) {
        const cleaned = codeInput.value.replace(/[^0-9]/g, '');
        if (codeInput.value !== cleaned) {
          codeInput.value = cleaned;
          if (window.app && window.app.showToast) {
            window.app.showToast('L\'identifiant de connexion doit comporter des chiffres uniquement (aucune lettre autorisée).', 'warning');
          }
        }
      }
    };

    if (codeInput) {
      codeInput.addEventListener('input', enforceNumericOnly);
      codeInput.addEventListener('paste', () => setTimeout(enforceNumericOnly, 10));
    }

    if (tabClient) {
      tabClient.addEventListener('click', () => {
        tabClient.classList.add('active');
        if (tabDistributor) tabDistributor.classList.remove('active');
        if (tabOwner) tabOwner.classList.remove('active');
        authCard.classList.remove('admin-mode');
        authCard.classList.add('client-mode');
        authRoleLabel.textContent = 'Identifiant Client Numérique (chiffres uniquement) :';
        codeInput.placeholder = 'Ex: 818101 (chiffres uniquement)';
        codeInput.setAttribute('inputmode', 'numeric');
        codeInput.setAttribute('pattern', '[0-9]*');
        if (demoClientWrapper) demoClientWrapper.style.display = 'none';
        if (clientRegisterPromo) clientRegisterPromo.style.display = 'block';
        codeInput.value = '';
        passInput.value = '';
        authSubmitBtn.className = 'btn-primary-auth btn-client-auth';
        authSubmitBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Connexion Espace Client Privilège';
        if (window.i18n && window.i18n.currentLang !== 'fr') window.i18n.translateDOM();
      });
    }

    if (tabDistributor) {
      tabDistributor.addEventListener('click', () => {
        tabDistributor.classList.add('active');
        if (tabClient) tabClient.classList.remove('active');
        if (tabOwner) tabOwner.classList.remove('active');
        authCard.classList.remove('admin-mode');
        authCard.classList.remove('client-mode');
        authRoleLabel.textContent = 'Code Partenaire Numérique (9 chiffres uniquement) :';
        codeInput.placeholder = 'Ex: 818204921 (chiffres uniquement)';
        codeInput.setAttribute('inputmode', 'numeric');
        codeInput.setAttribute('pattern', '[0-9]*');
        if (demoClientWrapper) demoClientWrapper.style.display = 'none';
        if (clientRegisterPromo) clientRegisterPromo.style.display = 'none';
        codeInput.value = '';
        passInput.value = '';
        authSubmitBtn.className = 'btn-primary-auth';
        authSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Connexion Espace Distributeur';
        if (window.i18n && window.i18n.currentLang !== 'fr') window.i18n.translateDOM();
      });
    }

    if (tabOwner) {
      tabOwner.addEventListener('click', () => {
        tabOwner.classList.add('active');
        if (tabClient) tabClient.classList.remove('active');
        if (tabDistributor) tabDistributor.classList.remove('active');
        authCard.classList.remove('client-mode');
        authCard.classList.add('admin-mode');
        authRoleLabel.textContent = 'Identifiant Administrateur (Direction Routini) :';
        codeInput.placeholder = 'Ex: admin ou ADMIN001';
        codeInput.removeAttribute('inputmode');
        codeInput.removeAttribute('pattern');
        if (demoClientWrapper) demoClientWrapper.style.display = 'none';
        if (clientRegisterPromo) clientRegisterPromo.style.display = 'none';
        codeInput.value = '';
        passInput.value = '';
        authSubmitBtn.className = 'btn-primary-auth btn-owner-auth';
        authSubmitBtn.innerHTML = '<i class="fas fa-crown"></i> Connexion Direction Générale (Admin)';
        if (window.i18n && window.i18n.currentLang !== 'fr') window.i18n.translateDOM();
      });
    }

    // Gestion de la modale d'inscription Client Direct Privilège
    const btnOpenClientReg = document.getElementById('btnOpenClientRegister');
    const modalClientReg = document.getElementById('modalRegisterClient');
    const btnCloseClientReg = document.getElementById('btnCloseClientRegisterModal');
    const btnCancelClientReg = document.getElementById('btnCancelClientRegister');
    const formRegisterClient = document.getElementById('formRegisterClient');

    if (btnOpenClientReg) btnOpenClientReg.addEventListener('click', () => this.openClientRegisterModal());
    if (btnCloseClientReg) btnCloseClientReg.addEventListener('click', () => this.closeClientRegisterModal());
    if (btnCancelClientReg) btnCancelClientReg.addEventListener('click', () => this.closeClientRegisterModal());
    if (modalClientReg) {
      modalClientReg.addEventListener('click', (e) => {
        if (e.target === modalClientReg) this.closeClientRegisterModal();
      });
    }

    if (formRegisterClient) {
      formRegisterClient.addEventListener('submit', (e) => this.handleClientRegisterSubmit(e));
    }

    // Soumission du formulaire de connexion
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = codeInput.value.trim();
        const pass = passInput.value.trim();

        if (!code) {
          window.app.showToast('Veuillez renseigner votre identifiant.', 'warning');
          codeInput.focus();
          return;
        }

        if (!pass) {
          window.app.showToast('Veuillez renseigner votre mot de passe.', 'warning');
          passInput.focus();
          return;
        }

        const res = window.stateManager.login(code, pass);
        if (res.success) {
          window.app.showToast(`Bienvenue, ${res.user.name} !`, 'success');
          this.handleSuccessfulAuth();
        } else {
          window.app.showToast(res.message, 'error');
        }
      });
    }

    // Bouton de déconnexion
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        this.logout();
      });
    }
  }

  quickLogin(code) {
    if (code === 'ADMIN001' || code === 'admin') {
      window.app.showToast('Accès Direction protégé : veuillez saisir votre mot de passe confidentiel.', 'warning');
      this.logout();
      const tabOwner = document.getElementById('tabOwner');
      if (tabOwner) tabOwner.click();
      return;
    }
    let res = window.stateManager.login(code, 'routini123');
    if (!res.success) {
      res = window.stateManager.login(code, 'client123');
    }
    if (res.success) {
      this.handleSuccessfulAuth();
      window.app.showToast(`Session active : ${window.stateManager.currentUser.name} (${window.stateManager.currentUser.rankName || window.stateManager.currentUser.rankCode})`, 'success');
    } else {
      window.app.showToast(res.message, 'error');
    }
  }

  handleSuccessfulAuth() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('appMainLayout').style.display = 'flex';

    const quickBar = document.getElementById('quickRoleBar');
    if (quickBar) {
      quickBar.style.display = 'flex';
    }

    window.app.renderAllViews();
    // Rediriger vers l'administration pour l'admin, et le dashboard pour les membres
    if (window.stateManager.isOwner()) {
      window.app.switchView('admin');
    } else {
      window.app.switchView('dashboard');
    }
  }

  openClientRegisterModal() {
    const modal = document.getElementById('modalRegisterClient');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
      if (window.i18n && window.i18n.currentLang !== 'fr') {
        window.i18n.translateDOM();
      }
    }
  }

  closeClientRegisterModal() {
    const modal = document.getElementById('modalRegisterClient');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        if (!modal.classList.contains('active')) {
          modal.style.display = 'none';
        }
      }, 200);
    }
  }

  handleClientRegisterSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const fullName = document.getElementById('regClientName').value.trim();
    const cinEl = document.getElementById('regClientCin');
    const cin = cinEl ? cinEl.value.trim() : '';
    const email = document.getElementById('regClientEmail').value.trim();
    const password = document.getElementById('regClientPassword').value.trim();
    const phone = document.getElementById('regClientPhone').value.trim();
    const city = document.getElementById('regClientCity').value.trim();
    const address = document.getElementById('regClientAddress').value.trim();
    const refEl = document.getElementById('regClientReferral');
    const referredBy = refEl ? refEl.value.trim() : '';

    if (!cin) {
      window.app.showToast('Le numéro de CIN ou pièce d\'identité est obligatoire pour l\'inscription.', 'warning');
      return;
    }

    const result = window.stateManager.registerDirectClient({
      fullName,
      cin,
      email,
      password,
      phone,
      city,
      address,
      referredBy
    });

    if (result.success) {
      this.closeClientRegisterModal();
      const form = document.getElementById('formRegisterClient');
      if (form) form.reset();
      window.app.showToast(result.message, 'success');
      this.handleSuccessfulAuth();
    } else {
      window.app.showToast(result.message, 'error');
    }
  }

  logout() {
    window.stateManager.currentUser = null;
    window.stateManager.saveState();
    try {
      localStorage.removeItem('ROUTINI_ONE_PLAN_STATE_V4_2026');
      sessionStorage.removeItem('routini_active_user');
      sessionStorage.clear();
    } catch (e) {}

    const codeInput = document.getElementById('authUsername');
    const passInput = document.getElementById('authPassword');
    if (codeInput) codeInput.value = '';
    if (passInput) passInput.value = '';

    document.getElementById('appMainLayout').style.display = 'none';
    const quickBar = document.getElementById('quickRoleBar');
    if (quickBar) quickBar.style.display = 'none';
    document.body.classList.remove('has-quick-bar');
    document.documentElement.style.setProperty('--quick-bar-height', '0px');
    document.getElementById('authSection').style.display = 'flex';

    if (window.i18n) {
      window.i18n.translateDOM();
    }

    window.app.showToast('Vous avez été déconnecté avec succès.', 'warning');
  }
}

window.authController = new AuthController();
