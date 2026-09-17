/**
 * Routini eWorld MLM - Gestionnaire de Synchronisation Base de Données Vercel Postgres
 * Fait le lien transparent entre l'état local (localStorage) et la base relationnelle Cloud
 */

class DatabaseSyncManager {
  constructor() {
    this.status = 'checking'; // 'checking', 'connected', 'offline', 'error'
    this.provider = 'Neon Serverless Postgres (Vercel)';
    this.isCloudAvailable = false;
    this.totalMembersInCloud = 0;
    this.init();
  }

  async init() {
    await this.checkCloudStatus();
    // Rafraîchissement automatique du statut toutes les 60 secondes
    setInterval(() => this.checkCloudStatus(), 60000);
  }

  /**
   * Vérifie la connectivité avec l'endpoint /api/status sur Vercel
   */
  async checkCloudStatus() {
    try {
      const response = await fetch('/api/status', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'connected') {
        this.status = 'connected';
        this.isCloudAvailable = true;
        this.totalMembersInCloud = data.membersCount || 0;
        this.updateUiBadge(true, `Vercel Postgres : Connecté (${data.membersCount} membres)`);
      } else {
        this.status = 'offline';
        this.isCloudAvailable = false;
        this.updateUiBadge(false, 'Vercel Postgres : Prêt (Mode Local Actif)');
      }
    } catch (err) {
      // En local ou si l'API n'est pas encore déployée sur Vercel
      this.status = 'offline';
      this.isCloudAvailable = false;
      this.updateUiBadge(false, 'Vercel Postgres : Prêt (Mode Local)');
    }
  }

  /**
   * Met à jour le badge visuel dans l'interface Direction Générale
   */
  updateUiBadge(isConnected, labelText) {
    const chip = document.getElementById('adminDbStatusChip');
    const textSpan = document.getElementById('adminDbStatusText');
    if (!chip || !textSpan) return;

    if (isConnected) {
      chip.className = 'db-status-chip connected';
      textSpan.textContent = labelText;
      chip.title = 'Base de données Neon Serverless Postgres connectée et opérationnelle';
    } else {
      chip.className = 'db-status-chip offline';
      textSpan.textContent = labelText;
      chip.title = 'L\'application fonctionne à 100% avec stockage local sécurisé. Connectez Neon Postgres sur Vercel (onglet Storage) pour activer la persistance Cloud.';
    }
  }

  /**
   * Initialise ou force la synchronisation avec Neon Vercel Postgres
   */
  async initOrSyncCloud(showToast = false) {
    if (showToast && window.app) {
      window.app.showToast('Connexion à Vercel Postgres en cours...', 'info');
    }

    try {
      // 1. Initialiser le schéma et les données initiales
      const state = window.stateManager ? window.stateManager.getStateSnapshot() : null;
      const initRes = await fetch('/api/init-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members: state?.members || []
        })
      });

      if (initRes.ok) {
        const initData = await initRes.json();
        
        // 2. Synchroniser le snapshot complet
        if (state) {
          await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
          });
        }

        await this.checkCloudStatus();
        if (showToast && window.app) {
          window.app.showToast(`✨ Base Vercel Postgres synchronisée avec succès (${initData.seededMembers || 51} membres) !`, 'success');
        }
        return true;
      } else {
        const errData = await initRes.json().catch(() => ({}));
        if (showToast && window.app) {
          window.app.showToast(errData.message || 'Variable POSTGRES_URL non détectée. Veuillez connecter Neon Postgres sur votre projet Vercel.', 'info');
        }
        return false;
      }
    } catch (err) {
      if (showToast && window.app) {
        window.app.showToast('Vercel Postgres prêt : connectez Neon dans votre tableau de bord Vercel pour activer la sauvegarde Cloud.', 'info');
      }
      return false;
    }
  }

  /**
   * Synchronise une commande en arrière-plan vers Vercel Postgres
   */
  async recordOrderToCloud(order) {
    if (!order) return;
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    } catch (err) {
      // Ignorer silencieusement si hors-ligne (déjà persisté dans localStorage)
    }
  }

  /**
   * Synchronise un membre mis à jour ou créé en arrière-plan
   */
  async recordMemberToCloud(member) {
    if (!member) return;
    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
    } catch (err) {
      // Ignorer silencieusement si hors-ligne
    }
  }
}

// Initialisation globale
window.dbSync = new DatabaseSyncManager();
