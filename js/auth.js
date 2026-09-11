/**
 * Routini eWorld MLM - Gestionnaire d'Authentification et de Rôles
 */

class AuthController {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    // Onglets de connexion (Distributeur vs Propriétaire / Administrateur)
    const tabDistributor = document.getElementById('tabDistributor');
    const tabOwner = document.getElementById('tabOwner');
    const authCard = document.getElementById('authCard');
    const loginForm = document.getElementById('loginForm');
    const codeInput = document.getElementById('authUsername');
    const passInput = document.getElementById('authPassword');
    const authRoleLabel = document.getElementById('authRoleLabel');
    const authSubmitBtn = document.getElementById('btnSubmitAuth');

    if (tabDistributor && tabOwner) {
      tabDistributor.addEventListener('click', () => {
        tabDistributor.classList.add('active');
        tabOwner.classList.remove('active');
        authCard.classList.remove('admin-mode');
        authRoleLabel.textContent = 'Code Distributeur Routini (9 chiffres) :';
        codeInput.placeholder = 'Ex: 818204921';
        codeInput.value = '818204921';
        passInput.value = 'routini123';
        authSubmitBtn.className = 'btn-primary-auth';
        authSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Connexion Espace Distributeur';
      });

      tabOwner.addEventListener('click', () => {
        tabOwner.classList.add('active');
        tabDistributor.classList.remove('active');
        authCard.classList.add('admin-mode');
        authRoleLabel.textContent = 'Identifiant Administrateur (Direction Routini) :';
        codeInput.placeholder = 'Ex: admin ou ADMIN001';
        codeInput.value = 'admin';
        passInput.value = 'admin123';
        authSubmitBtn.className = 'btn-primary-auth btn-owner-auth';
        authSubmitBtn.innerHTML = '<i class="fas fa-crown"></i> Connexion Direction Générale (Admin)';
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
    const res = window.stateManager.login(code, 'admin123');
    if (!res.success) {
      // tenter mot de passe distributeur
      window.stateManager.login(code, 'routini123');
    }
    this.handleSuccessfulAuth();
    window.app.showToast(`Session active : ${window.stateManager.currentUser.name}`, 'success');
  }

  handleSuccessfulAuth() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('appMainLayout').style.display = 'flex';
    document.getElementById('quickRoleBar').style.display = 'flex';

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
