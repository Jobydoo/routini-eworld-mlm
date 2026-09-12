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

    if (demoSelect) {
      demoSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val) {
          codeInput.value = val;
          passInput.value = (val === 'admin' || val === 'ADMIN001') ? 'admin123' : 'routini123';
        }
      });
    }

    if (tabClient) {
      tabClient.addEventListener('click', () => {
        tabClient.classList.add('active');
        if (tabDistributor) tabDistributor.classList.remove('active');
        if (tabOwner) tabOwner.classList.remove('active');
        authCard.classList.remove('admin-mode');
        authCard.classList.add('client-mode');
        authRoleLabel.textContent = 'Identifiant Client Privilège ou Email :';
        codeInput.placeholder = 'Ex: CLT-818101 ou salma.bennani@...';
        if (demoClientWrapper) demoClientWrapper.style.display = 'none';
        if (clientRegisterPromo) clientRegisterPromo.style.display = 'block';
        codeInput.value = 'CLT-818101';
        passInput.value = 'client123';
        authSubmitBtn.className = 'btn-primary-auth btn-client-auth';
        authSubmitBtn.innerHTML = '<i class="fas fa-shopping-bag"></i> Connexion Espace Client Privilège';
      });
    }

    if (tabDistributor) {
      tabDistributor.addEventListener('click', () => {
        tabDistributor.classList.add('active');
        if (tabClient) tabClient.classList.remove('active');
        if (tabOwner) tabOwner.classList.remove('active');
        authCard.classList.remove('admin-mode');
        authCard.classList.remove('client-mode');
        authRoleLabel.textContent = 'Code Partenaire (9 chiffres) ou Email :';
        codeInput.placeholder = 'Ex: 818204921 ou karim.benali@...';
        if (demoClientWrapper) demoClientWrapper.style.display = 'block';
        if (clientRegisterPromo) clientRegisterPromo.style.display = 'none';
        codeInput.value = '818204921';
        passInput.value = 'routini123';
        authSubmitBtn.className = 'btn-primary-auth';
        authSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Connexion Espace Distributeur';
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
        if (demoClientWrapper) demoClientWrapper.style.display = 'none';
        if (clientRegisterPromo) clientRegisterPromo.style.display = 'none';
        codeInput.value = 'admin';
        passInput.value = 'admin123';
        authSubmitBtn.className = 'btn-primary-auth btn-owner-auth';
        authSubmitBtn.innerHTML = '<i class="fas fa-crown"></i> Connexion Direction Générale (Admin)';
      });
    }

    // Gestion de la modale d'inscription Client Direct Privilège
    const btnOpenClientReg = document.getElementById('btnOpenClientRegister');
    const modalClientReg = document.getElementById('modalRegisterClient');
    const btnCloseClientReg = document.getElementById('btnCloseClientRegisterModal');
    const btnCancelClientReg = document.getElementById('btnCancelClientRegister');
    const formRegisterClient = document.getElementById('formRegisterClient');

    const openModal = () => { if (modalClientReg) modalClientReg.style.display = 'flex'; };
    const closeModal = () => { if (modalClientReg) modalClientReg.style.display = 'none'; };

    if (btnOpenClientReg) btnOpenClientReg.addEventListener('click', openModal);
    if (btnCloseClientReg) btnCloseClientReg.addEventListener('click', closeModal);
    if (btnCancelClientReg) btnCancelClientReg.addEventListener('click', closeModal);
    if (modalClientReg) {
      modalClientReg.addEventListener('click', (e) => {
        if (e.target === modalClientReg) closeModal();
      });
    }

    if (formRegisterClient) {
      formRegisterClient.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('regClientName').value.trim();
        const email = document.getElementById('regClientEmail').value.trim();
        const password = document.getElementById('regClientPassword').value.trim();
        const phone = document.getElementById('regClientPhone').value.trim();
        const city = document.getElementById('regClientCity').value.trim();
        const address = document.getElementById('regClientAddress').value.trim();

        const result = window.stateManager.registerDirectClient({
          fullName,
          email,
          password,
          phone,
          city,
          address
        });

        if (result.success) {
          closeModal();
          formRegisterClient.reset();
          window.app.showToast(result.message, 'success');
          this.handleSuccessfulAuth();
        } else {
          window.app.showToast(result.message, 'error');
        }
      });
    }

    // Soumission du formulaire de connexion
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = codeInput.value.trim();
        const pass = passInput.value.trim();

        if (!code) {
          window.app.showToast('Veuillez renseigner votre identifiant.', 'warning');
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
    let res = window.stateManager.login(code, 'admin123');
    if (!res.success) {
      res = window.stateManager.login(code, 'routini123');
    }
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

    // Règle stricte de confidentialité : Seul le propriétaire peut voir la barre de changement rapide
    const quickBar = document.getElementById('quickRoleBar');
    if (quickBar) {
      quickBar.style.display = window.stateManager.isOwner() ? 'flex' : 'none';
    }

    window.app.renderAllViews();
    // Rediriger vers l'administration pour l'admin, et le dashboard pour les membres
    if (window.stateManager.isOwner()) {
      window.app.switchView('admin');
    } else {
      window.app.switchView('dashboard');
    }
  }

  logout() {
    window.stateManager.currentUser = null;
    window.stateManager.saveState();

    document.getElementById('appMainLayout').style.display = 'none';
    document.getElementById('quickRoleBar').style.display = 'none';
    document.getElementById('authSection').style.display = 'flex';

    window.app.showToast('Vous avez été déconnecté avec succès.', 'warning');
  }
}

window.authController = new AuthController();
