/**
 * Routini eWorld MLM - Arbre Généalogique & Gestion du Réseau (Genealogy Tree)
 * Modèle : ROUTINE ONE PLAN
 * Structure sur 3 Niveaux & Bonus Leadership Différentiel
 */

class GenealogyController {
  constructor() {
    this.currentViewMode = 'tree';
    this.searchQuery = '';
    this.expandedNodes = new Set(['ADMIN001', '818204921', '818205114']);
    this.zoomLevel = 1.0;
  }

  init() {
    this.render();
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    this.render();
  }

  setSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.render();
  }

  toggleNodeExpand(code, e) {
    if (e) e.stopPropagation();
    if (this.expandedNodes.has(code)) {
      this.expandedNodes.delete(code);
    } else {
      this.expandedNodes.add(code);
    }
    this.render();
  }

  measureTreeDimensions() {
    const canvas = document.getElementById('treeCanvas');
    if (!canvas) return { width: 1200, height: 600 };

    const rootNode = canvas.querySelector('.tree-node-wrapper') || canvas;

    const prevPos = canvas.style.position;
    const prevTrans = canvas.style.transform;
    const prevW = canvas.style.width;

    canvas.style.position = 'relative';
    canvas.style.transform = 'none';
    canvas.style.width = 'max-content';

    const width = Math.max(canvas.scrollWidth, canvas.offsetWidth, rootNode.scrollWidth, rootNode.offsetWidth, 800);
    const height = Math.max(canvas.scrollHeight, canvas.offsetHeight, rootNode.scrollHeight, rootNode.offsetHeight, 450);

    canvas.style.position = prevPos;
    canvas.style.transform = prevTrans;
    canvas.style.width = prevW;

    return { width, height };
  }

  setZoom(scale) {
    this.zoomLevel = Math.max(0.10, Math.min(1.8, Number(scale)));
    const wrapper = document.getElementById('treeCanvasWrapper');
    const viewport = document.getElementById('treeViewport');
    const canvas = document.getElementById('treeCanvas');
    const label = document.getElementById('genealogyZoomLabel');
    const slider = document.getElementById('genealogyZoomSlider');

    if (wrapper && canvas) {
      if (!canvas.dataset.natW || canvas.dataset.natW === '0') {
        const dims = this.measureTreeDimensions();
        canvas.dataset.natW = dims.width;
        canvas.dataset.natH = dims.height;
      }

      const natW = parseFloat(canvas.dataset.natW) || 1200;
      const natH = parseFloat(canvas.dataset.natH) || 600;
      const scaledW = Math.round(natW * this.zoomLevel);
      const scaledH = Math.round(natH * this.zoomLevel);

      wrapper.style.width = `${scaledW}px`;
      wrapper.style.height = `${scaledH}px`;
      wrapper.style.margin = '0 auto';
      wrapper.style.position = 'relative';

      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = `${natW}px`;
      canvas.style.transformOrigin = '0 0';
      canvas.style.transform = `scale(${this.zoomLevel})`;

      if (viewport) {
        if (scaledW > viewport.clientWidth) {
          viewport.scrollLeft = Math.max(0, (scaledW - viewport.clientWidth) / 2);
        } else {
          viewport.scrollLeft = 0;
        }
      }
    }

    if (label) {
      label.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
    if (slider) {
      slider.value = Math.round(this.zoomLevel * 100);
    }
  }

  zoomIn() {
    this.setZoom(this.zoomLevel + 0.10);
  }

  zoomOut() {
    this.setZoom(this.zoomLevel - 0.10);
  }

  resetZoom() {
    this.setZoom(1.0);
  }

  fitToScreen() {
    const viewport = document.getElementById('treeViewport');
    const canvas = document.getElementById('treeCanvas');
    const wrapper = document.getElementById('treeCanvasWrapper');
    if (!viewport || !canvas || !wrapper) return;

    delete canvas.dataset.natW;
    delete canvas.dataset.natH;

    requestAnimationFrame(() => {
      const dims = this.measureTreeDimensions();
      const natW = dims.width;
      const natH = dims.height;

      canvas.dataset.natW = natW;
      canvas.dataset.natH = natH;

      const vWidth = Math.max(300, viewport.clientWidth - 60);
      const vHeight = Math.max(300, viewport.clientHeight - 60);

      let scale = 1.0;
      if (natW > 0 && vWidth > 0) {
        const scaleX = vWidth / natW;
        const scaleY = (natH > 0 && vHeight > 0) ? (vHeight / natH) : 1.0;
        scale = Math.min(scaleX, scaleY) * 0.94;
        scale = Math.max(0.10, Math.min(scale, 1.0));
      }

      this.setZoom(Number(scale.toFixed(2)));

      if (viewport) {
        const scaledW = Math.round(natW * this.zoomLevel);
        if (scaledW > viewport.clientWidth) {
          viewport.scrollLeft = Math.max(0, (scaledW - viewport.clientWidth) / 2);
        } else {
          viewport.scrollLeft = 0;
        }
        viewport.scrollTop = 0;
      }

      if (window.app && window.app.showToast) {
        window.app.showToast(`Arbre ajusté à l'écran : ${Math.round(this.zoomLevel * 100)}%`, 'info');
      }
    });
  }

  expandAll() {
    const members = window.stateManager.members;
    members.forEach(m => this.expandedNodes.add(m.code));
    this.render();
  }

  collapseAll() {
    this.expandedNodes.clear();
    const currentUser = window.stateManager.currentUser;
    if (currentUser) this.expandedNodes.add(currentUser.code);
    this.render();
  }

  bindTreeEvents() {
    const viewport = document.getElementById('treeViewport');
    if (!viewport || viewport._panZoomBound) return;
    viewport._panZoomBound = true;

    // Zoom à la molette (Ctrl + Molette ou trackpad pinch)
    viewport.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.08 : -0.08;
        this.setZoom(this.zoomLevel + delta);
      }
    }, { passive: false });

    // Glisser-déposer pour se déplacer (Pan)
    let isDown = false;
    let startX = 0, startY = 0;
    let scrollLeft = 0, scrollTop = 0;

    viewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('.tree-card') || e.target.closest('button')) return;
      isDown = true;
      viewport.style.cursor = 'grabbing';
      startX = e.pageX - viewport.offsetLeft;
      startY = e.pageY - viewport.offsetTop;
      scrollLeft = viewport.scrollLeft;
      scrollTop = viewport.scrollTop;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - viewport.offsetLeft;
      const y = e.pageY - viewport.offsetTop;
      viewport.scrollLeft = scrollLeft - (x - startX);
      viewport.scrollTop = scrollTop - (y - startY);
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        viewport.style.cursor = 'grab';
      }
    });
  }

  render() {
    const container = document.getElementById('genealogyContentArea');
    if (!container) return;

    const currentUser = window.stateManager.currentUser;
    if (!currentUser) return;

    // Déplier automatiquement la racine de l'utilisateur connecté
    this.expandedNodes.add(currentUser.code);

    const rootCode = window.stateManager.isOwner() ? 'ADMIN001' : currentUser.code;
    const treeData = window.stateManager.buildGenealogyTree(rootCode, 5);

    if (this.currentViewMode === 'tree') {
      if (!treeData) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: 40px auto;">
            <div style="font-size: 2.5rem; color: var(--rtn-rose); margin-bottom: 12px;"><i class="fas fa-sitemap"></i></div>
            <h4 style="font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">Votre réseau commence ici</h4>
            <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 16px;">Vous n'avez pas encore parrainé de filleuls directs. Invitez de nouveaux distributeurs pour développer vos 3 niveaux de commissions.</p>
            <button class="btn-primary-auth" style="width: auto; margin: 0 auto; padding: 10px 20px;" onclick="window.app.switchView('sponsor')">
              <i class="fas fa-user-plus"></i> Parrainer un Nouveau Partenaire (0 DH)
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <!-- Barre d'outils Zoom Évoluée & Plein Écran -->
          <div class="tree-zoom-toolbar">
            <div class="tree-zoom-left">
              <button class="btn-tree-fit" onclick="window.genealogyController.fitToScreen()" title="Réduire automatiquement l'arbre pour tout afficher sur l'écran">
                <i class="fas fa-compress-arrows-alt"></i> <span>Vue Globale (Tout voir)</span>
              </button>
              <div class="tree-zoom-stepper">
                <button type="button" class="btn-zoom-step" onclick="window.genealogyController.zoomOut()" title="Réduire (Jusqu'à 10%)">
                  <i class="fas fa-minus"></i>
                </button>
                <input type="range" id="genealogyZoomSlider" class="tree-zoom-slider" min="10" max="180" value="${Math.round(this.zoomLevel * 100)}" oninput="window.genealogyController.setZoom(this.value / 100)" title="Curseur de zoom">
                <button type="button" class="btn-zoom-step" onclick="window.genealogyController.zoomIn()" title="Agrandir (+)">
                  <i class="fas fa-plus"></i>
                </button>
                <span id="genealogyZoomLabel" class="tree-zoom-percent">${Math.round(this.zoomLevel * 100)}%</span>
              </div>
              <div class="tree-zoom-presets">
                <button type="button" class="btn-zoom-preset" onclick="window.genealogyController.setZoom(0.25)">25%</button>
                <button type="button" class="btn-zoom-preset" onclick="window.genealogyController.setZoom(0.50)">50%</button>
                <button type="button" class="btn-zoom-preset" onclick="window.genealogyController.setZoom(0.75)">75%</button>
                <button type="button" class="btn-zoom-preset" onclick="window.genealogyController.resetZoom()">100%</button>
              </div>
            </div>
            <div class="tree-zoom-right">
              <button class="btn-tree-action" onclick="window.genealogyController.expandAll()" title="Déplier toutes les branches et ajuster">
                <i class="fas fa-expand-alt"></i> <span>Tout Déplier</span>
              </button>
              <button class="btn-tree-action" onclick="window.genealogyController.collapseAll()" title="Réduire toutes les branches">
                <i class="fas fa-compress-alt"></i> <span>Tout Réduire</span>
              </button>
            </div>
          </div>

          <!-- Indication interactive -->
          <div class="tree-drag-hint">
            <i class="fas fa-info-circle"></i> <span>Glissez avec la souris pour vous déplacer • Utilisez <strong>Vue Globale</strong> ou le curseur pour afficher tout le réseau</span>
          </div>

          <!-- Fenêtre de visualisation avec support Zoom & Pan étendu -->
          <div class="tree-viewport" id="treeViewport">
            <div id="treeCanvasWrapper" style="position: relative; margin: 0 auto;">
              <div class="tree-canvas" id="treeCanvas">
                ${this.renderTreeNode(treeData)}
              </div>
            </div>
          </div>
        `;
        setTimeout(() => {
          this.bindTreeEvents();
          this.fitToScreen();
        }, 40);
      }
    } else {
      const downlines = window.stateManager.getAllDownlines(rootCode);
      container.innerHTML = this.renderTableView(currentUser, downlines);
    }

    if (window.i18n && window.i18n.currentLang !== 'fr') {
      window.i18n.translateDOM();
    }
  }

  renderTreeNode(node) {
    const isExpanded = this.expandedNodes.has(node.code);
    const hasChildren = node.children && node.children.length > 0;
    const isCurrent = window.stateManager.currentUser && window.stateManager.currentUser.code === node.code;

    const rankClass = `rank-${(node.rankCode || 'partner').toLowerCase()}`;

    const matchesSearch = this.searchQuery && (
      node.name.toLowerCase().includes(this.searchQuery) ||
      node.code.toLowerCase().includes(this.searchQuery)
    );

    const highlightStyle = matchesSearch ? 'style="border-color: #be185d; box-shadow: 0 0 15px rgba(190, 24, 93, 0.4);"' : '';

    return `
      <div class="tree-node-wrapper">
        <div class="tree-card ${isCurrent ? 'is-current-user' : ''}" ${highlightStyle} onclick="window.genealogyController.showMemberDetailsModal('${node.code}')">
          <div class="card-top-row">
            <span class="rank-tag ${rankClass}">${node.rankCode || 'PARTNER'}</span>
            <small style="color: ${window.stateManager.isMemberActive(node) ? '#15803d' : '#f59e0b'}; font-weight:700;">
              ● ${window.stateManager.isMemberActive(node) ? 'Actif' : 'En qualif'}
            </small>
          </div>
          <div class="member-name" title="${node.name}">${node.name}</div>
          <span class="member-code">ID: ${node.code}</span>
          
          <div class="points-bar">
            <div>
              <span>PPV Perso</span>
              <strong style="color: var(--rtn-rose);">${node.ppv || 0}</strong>
            </div>
            <div>
              <span>Équipe (PV)</span>
              <strong style="color: #15803d;">${(node.teamPV || node.gpv || 0).toLocaleString('fr-FR')}</strong>
            </div>
          </div>

          ${hasChildren ? `
            <button class="btn-toggle-branch" title="${isExpanded ? 'Réduire' : 'Déplier les partenaires'}" onclick="window.genealogyController.toggleNodeExpand('${node.code}', event)">
              <i class="fas fa-${isExpanded ? 'minus' : 'plus'}"></i>
            </button>
          ` : ''}
        </div>

        ${hasChildren && isExpanded ? `
          <div class="tree-children">
            <div class="tree-children-container">
              ${node.children.map(child => this.renderTreeNode(child)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderTableView(rootUser, downlines) {
    let list = downlines;
    if (this.searchQuery) {
      list = list.filter(m => 
        m.name.toLowerCase().includes(this.searchQuery) ||
        m.code.toLowerCase().includes(this.searchQuery) ||
        m.city.toLowerCase().includes(this.searchQuery)
      );
    }

    return `
      <div class="data-table-card">
        <div class="table-header-bar">
          <h3>Réseau Descendant Routini ONE PLAN (${list.length} partenaires)</h3>
          <span class="status-badge status-success">${downlines.length} Filleuls Actifs</span>
        </div>
        <div style="overflow-x: auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Niveau Rémunéré</th>
                <th>Code Membre</th>
                <th>Nom & Prénom</th>
                <th>Grade Actuel</th>
                <th>Parrain Direct</th>
                <th>PPV Perso</th>
                <th>Volume Équipe</th>
                <th>Base CV</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${list.length === 0 ? `
                <tr><td colspan="9" style="text-align:center; padding: 24px; color:#94a3b8;">Aucun partenaire ne correspond à votre recherche.</td></tr>
              ` : list.map(m => {
                let niveauText = `N${m.downlineLevel}`;
                if (m.downlineLevel === 1) niveauText += ' (10% CV)';
                else if (m.downlineLevel === 2) niveauText += ' (5% CV)';
                else if (m.downlineLevel === 3) niveauText += ' (3% CV)';
                else niveauText += ' (Leadership)';

                return `
                  <tr>
                    <td><strong>${niveauText}</strong></td>
                    <td><span style="font-family: monospace; font-weight:700; color: #0f172a;">${m.code}</span></td>
                    <td><strong>${m.name}</strong></td>
                    <td><span class="rank-tag rank-${(m.rankCode || 'partner').toLowerCase()}">${m.rankName || m.rankCode}</span></td>
                    <td>${m.sponsorName || m.sponsorCode}</td>
                    <td><strong style="color: var(--rtn-rose);">${m.ppv} PV</strong></td>
                    <td><strong style="color: #15803d;">${(m.teamPV || m.gpv || 0).toLocaleString('fr-FR')} PV</strong></td>
                    <td><strong style="color: #be185d;">${m.sv || 0} CV</strong></td>
                    <td>
                      <button class="btn-switch-account" style="color: #0f172a; border-color: #cbd5e1;" onclick="window.genealogyController.showMemberDetailsModal('${m.code}')">
                        <i class="fas fa-id-card"></i> Fiche
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  showMemberDetailsModal(code) {
    const member = window.stateManager.getMemberByCode(code);
    if (!member) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContainer = document.getElementById('appModal');

    modalTitle.innerHTML = `<i class="fas fa-user-circle" style="color: var(--rtn-rose);"></i> Fiche Partenaire Routini : ${member.name}`;

    const directs = window.stateManager.getDirectDownlines(member.code);

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <small style="color: #64748b; text-transform: uppercase; font-size: 0.7rem; font-weight: 700;">Profil Partenaire</small>
          <p style="margin-top: 6px; font-size: 0.9rem;"><strong>Nom :</strong> ${member.name}</p>
          <p style="font-size: 0.85rem;"><strong>Code Partenaire :</strong> <span style="font-family: monospace; color: var(--rtn-navy); font-weight:700;">${member.code}</span></p>
          <p style="font-size: 0.85rem;"><strong>Grade ONE PLAN :</strong> <span class="rank-tag rank-${(member.rankCode || 'partner').toLowerCase()}">${member.rankName || member.rankCode}</span></p>
          <p style="font-size: 0.85rem;"><strong>Email :</strong> ${member.email}</p>
          <p style="font-size: 0.85rem;"><strong>Localisation :</strong> ${member.city}, ${member.country}</p>
          <p style="font-size: 0.85rem;"><strong>Date d'adhésion :</strong> ${member.joinDate}</p>
          <p style="font-size: 0.85rem;"><strong>Statut Activité Mensuelle :</strong> ${(() => {
            const act = window.stateManager.getActivityDetails(member);
            return act.isActive 
              ? `<span class="status-badge status-success">Actif Qualifié (${act.ppv}/${act.requiredPV} PV)</span>`
              : `<span class="status-badge" style="background:#fee2e2; color:#b91c1c; font-weight:700;">Inactif aux commissions (${act.ppv}/${act.requiredPV} PV requis)</span>`;
          })()}</p>
        </div>

        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <small style="color: #64748b; text-transform: uppercase; font-size: 0.7rem; font-weight: 700;">Volumes & Rémunération</small>
          <p style="margin-top: 6px; font-size: 0.85rem;"><strong>Parrain Direct :</strong> ${member.sponsorName} (${member.sponsorCode || 'Siège'})</p>
          <p style="font-size: 0.85rem;"><strong>Points Perso (PPV) :</strong> <span style="color: var(--rtn-rose); font-weight:700;">${member.ppv} PV</span></p>
          <p style="font-size: 0.85rem;"><strong>Volume Équipe (PV) :</strong> <span style="color: #15803d; font-weight:700;">${(member.teamPV || member.gpv || 0).toLocaleString('fr-FR')} PV</span></p>
          <p style="font-size: 0.85rem;"><strong>Valeur Vente (SV / CV) :</strong> <span style="color: #be185d; font-weight:700;">${member.sv || 0} CV</span></p>
          <p style="font-size: 0.85rem;"><strong>Clients servis ce mois :</strong> ${member.clientsCount || 5} clients</p>
          <p style="font-size: 0.85rem;"><strong>Points Fidélité :</strong> ${member.fidelityPoints || 0} pts</p>
          <p style="font-size: 0.85rem;"><strong>Directs 1ère Génération :</strong> ${directs.length} partenaires</p>
        </div>
      </div>

      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        ${window.stateManager.isOwner() ? `
          <button class="btn-primary-auth" style="width: auto; padding: 8px 16px; font-size: 0.85rem;" onclick="window.app.switchAccount('${member.code}')">
            <i class="fas fa-exchange-alt"></i> Se connecter en tant que ${member.name.split(' ')[0]}
          </button>
        ` : ''}
        <button type="button" class="btn-switch-account" onclick="window.app.closeModal()">Fermer</button>
      </div>
    `;

    modalContainer.classList.add('active');
  }
}

window.genealogyController = new GenealogyController();
