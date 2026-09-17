/**
 * Routini eWorld MLM - Boutique en Ligne Cosmétiques & Gestion des Commandes
 * Modèle Officiel : ROUTINE ONE PLAN — Version 4 (Septembre 2026)
 * Document de Référence : Document Officiel 18 Slides
 * 
 * Règles Fondamentales du Catalogue (Slide 2 & 3) :
 * 1. Prix Membre (PM) : 90% du Prix Public (PP) pour TOUS les grades.
 * 2. Points PV : 1 PV = 10 DH Prix Public (PV = PP ÷ 10).
 * 3. Commission Value (CV) : 60% du Prix Membre payé (CV = 60% × PM).
 * 4. 3 Parcours Commerciaux (Slide 10) :
 *    - Client Rattaché : paye le Prix Public, le distributeur vendeur reçoit 10% cash + CV réseau.
 *    - Achat Perso Partenaire : paye le Prix Membre (90% PP), crédite PV personnels, 0% auto-commission (Slide 5).
 *    - Client Direct Routini : paye le Prix Public, 0% MLM, points fidélité.
 */

class ShopController {
  constructor() {
    this.selectedCategory = 'Tous';
    this.currentOrderChannel = 'attached_client'; // 'attached_client', 'partner_personal', 'direct_client'
  }

  init() {
    this.render();
  }

  setCategory(cat) {
    this.selectedCategory = cat;
    this.render();
  }

  setOrderChannel(channel) {
    this.currentOrderChannel = channel;
    window.stateManager.orderChannel = channel;
    this.renderCart();
  }

  render() {
    const grid = document.getElementById('shopProductsGrid');
    const cartBox = document.getElementById('shopCartContainer');
    if (!grid || !cartBox) return;

    let products = window.stateManager.products;
    if (this.selectedCategory !== 'Tous') {
      if (this.selectedCategory === 'Packs & Rituels') {
        products = products.filter(p => p.isPack || p.category === 'Packs & Rituels');
      } else {
        products = products.filter(p => p.category === this.selectedCategory);
      }
    }

    grid.innerHTML = products.map(p => {
      const pp = p.priceRP_DH || 500;
      const pm = p.pricePM_DH || p.priceDP_DH || Math.round(pp * 0.90);
      const pv = p.pv || Math.round(pp / 10);
      const cv = p.sv || Math.round(pm * 0.60);
      const isPromo = Boolean(p.isPromo);
      const origPP = p.originalPriceRP || (isPromo ? Math.round(pp * 1.25) : null);
      const savingDH = (origPP && origPP > pp) ? (origPP - pp) : 0;

      return `
        <div class="product-card ${p.isPack ? 'product-card-pack' : ''}" style="${isPromo ? 'border: 2px solid #f43f5e; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.15);' : ''}">
          <div class="product-image-box" style="${p.isPack ? 'background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);' : ''}">
            <span class="product-badge-pv" title="1 PV = 10 DH Prix Public">${pv} PV</span>
            <span class="product-badge-sv" title="Commission Value = 60% du Prix Membre">${cv} CV</span>
            ${isPromo ? `<span style="position: absolute; bottom: 8px; left: 8px; background: #dc2626; color: #fff; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="fas fa-fire"></i> ${p.promoBadge || 'PROMO'}</span>` : ''}
            <div class="product-icon-art">${p.icon || (p.isPack ? '🎁' : '✨')}</div>
          </div>
          <div class="product-info">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; flex-wrap: wrap; gap: 4px;">
              <span class="product-category">${p.category}</span>
              <div style="display: flex; gap: 4px;">
                ${isPromo ? `<span style="font-size: 0.68rem; background: #dc2626; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 800;">${p.promoBadge || 'PROMO'}</span>` : ''}
                ${p.badge && !isPromo ? `<span style="font-size: 0.7rem; background: #be185d; color: #fff; padding: 2px 7px; border-radius: 4px; font-weight: 700;">${p.badge}</span>` : ''}
              </div>
            </div>
            <h4 class="product-title">${p.name}</h4>
            <p class="product-desc">${p.desc}</p>
            
            <div class="product-pricing">
              <div class="price-dp">
                ${window.stateManager.formatMoney(pm)}
                <small>Prix Membre (90% PP)</small>
              </div>
              <div class="price-retail" title="Prix Vente Public Recommandé (PP)">
                ${window.stateManager.formatMoney(pp)}
                ${savingDH > 0 ? `<small style="display: block; text-decoration: line-through; color: #94a3b8; font-size: 0.7rem;">${origPP} DH</small>` : '<small style="display: block; font-size: 0.65rem; color: #64748b;">Prix Public</small>'}
              </div>
            </div>

            ${savingDH > 0 ? `
              <div style="background: #fff1f2; border: 1px dashed #f43f5e; border-radius: 6px; padding: 4px 8px; margin: 6px 0; font-size: 0.72rem; color: #9f1239; font-weight: 700; display: flex; justify-content: space-between; align-items: center;">
                <span><i class="fas fa-tags"></i> Économie immédiate :</span>
                <span>-${savingDH} DH (${Math.round((savingDH / origPP) * 100)}%)</span>
              </div>
            ` : ''}

            <!-- Formules en direct sous le produit -->
            <div style="margin: 8px 0; padding: 6px 8px; background: #f8fafc; border-radius: 6px; font-size: 0.72rem; color: #475569; display: flex; justify-content: space-between;">
              <span><i class="fas fa-tag" style="color:#10b981;"></i> Remise : <strong>-10%</strong></span>
              <span><i class="fas fa-coins" style="color:#be185d;"></i> Base com. : <strong>${cv} CV</strong></span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b; margin-bottom: 10px;">
              <span><i class="fas fa-gift" style="color: var(--rtn-gold);"></i> Fidélité : +${Math.floor(pp / 10)} pts</span>
              <span>Stock : <strong>${p.stock}</strong></span>
            </div>

            <button class="btn-add-cart" style="${isPromo ? 'background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);' : (p.isPack ? 'background: #14532d;' : '')}" onclick="window.shopController.handleAddToCart('${p.id}')">
              <i class="fas fa-cart-plus"></i> ${p.isPack ? (isPromo ? 'Profiter de ce Pack Promo' : 'Ajouter ce Pack') : 'Ajouter au Panier'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.renderCart();
  }

  renderCart() {
    const cartBox = document.getElementById('shopCartContainer');
    if (!cartBox) return;

    const isClient = window.stateManager.isClient();
    if (isClient) {
      this.currentOrderChannel = 'direct_client';
    }

    const cart = window.stateManager.cart;
    window.stateManager.orderChannel = this.currentOrderChannel;
    const totals = window.stateManager.getCartTotals();
    const currentUser = window.stateManager.currentUser;

    const commEstimate = this.currentOrderChannel === 'attached_client' 
      ? Math.round(totals.totalPP * 0.10) 
      : 0;

    cartBox.innerHTML = `
      <div class="cart-summary-box">
        <h3>
          <span><i class="fas fa-shopping-basket" style="color: var(--rtn-rose);"></i> Votre Panier Routini</span>
          <span class="status-badge status-success" style="font-size: 0.75rem;">${totals.totalItems} article(s)</span>
        </h3>

        ${isClient ? `
          <!-- Notice Client Direct Privilège -->
          <div style="margin-bottom: 14px; background: #fdf2f8; border: 1.5px solid #fbcfe8; border-radius: 8px; padding: 10px;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.82rem; color: #9d174d;">
              <i class="fas fa-gem"></i> Parcours : Client Privilège Routini Direct
            </div>
            <small style="display:block; font-size: 0.72rem; color: #64748b; margin-top: 4px; line-height: 1.4;">
              Commandes au Prix Public officiel avec <strong>10% reversés en points fidélité</strong>. Expédition sous 24-48h par Amana Express partout au Maroc.
            </small>
          </div>
        ` : `
          <!-- Sélecteur des 3 Parcours Commerciaux (Slide 10) -->
          <div style="margin-bottom: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
            <label style="font-size: 0.78rem; font-weight: 800; display: block; margin-bottom: 6px; color: var(--rtn-navy);">
              <i class="fas fa-user-tag" style="color: #0284c7;"></i> Parcours Commercial (Slide 10) :
            </label>
            <select id="selectOrderChannel" class="form-control" style="font-size: 0.82rem; padding: 6px 8px;" onchange="window.shopController.setOrderChannel(this.value)">
              <option value="attached_client" ${this.currentOrderChannel === 'attached_client' ? 'selected' : ''}>
                🟢 Client Rattaché (10% Direct Vendeur + CV Réseau)
              </option>
              <option value="partner_personal" ${this.currentOrderChannel === 'partner_personal' ? 'selected' : ''}>
                🟡 Achat Perso Partenaire (Prix Membre 90%, 0% auto-com)
              </option>
              <option value="direct_client" ${this.currentOrderChannel === 'direct_client' ? 'selected' : ''}>
                ⚪ Client Direct Routini (Prix Public 100%, 0% Réseau)
              </option>
            </select>
            <small style="display:block; font-size: 0.7rem; color: #64748b; margin-top: 5px; line-height: 1.4;">
              ${this.currentOrderChannel === 'attached_client' ? 'Vente au Prix Public : Le distributeur touche 10% direct en cash (+${window.stateManager.formatMoney(commEstimate)}) et la vente génère du CV réseau pour la lignée.' : ''}
              ${this.currentOrderChannel === 'partner_personal' ? 'Achat au Prix Membre (90% du Prix Public) : crédite vos PV personnels pour l\'activité du mois. Pas de commission personnelle (Slide 5).' : ''}
              ${this.currentOrderChannel === 'direct_client' ? 'Vente sans parrain direct gérée par la marque Routini : stabilise la rentabilité globale de l\'entreprise.' : ''}
            </small>
          </div>
        `}

        ${cart.length === 0 ? `
          <div style="text-align: center; padding: 30px 10px; color: #94a3b8;">
            <i class="fas fa-spa" style="font-size: 2.5rem; margin-bottom: 10px; opacity: 0.4; color: var(--rtn-rose);"></i>
            <p style="font-size: 0.85rem;">Votre panier est vide.<br>Sélectionnez vos soins ou packs rituels pour commander.</p>
          </div>
        ` : `
          <div class="cart-items-list">
            ${cart.map(item => {
              const pp = item.product.priceRP_DH || 500;
              const pm = item.product.pricePM_DH || Math.round(pp * 0.90);
              const pv = item.product.pv || Math.round(pp / 10);
              const cv = item.product.sv || Math.round(pm * 0.60);
              return `
                <div class="cart-item-row">
                  <div style="flex: 1; padding-right: 8px;">
                    <div class="cart-item-name">${item.product.name}</div>
                    <div class="cart-item-meta">
                      ${this.currentOrderChannel === 'partner_personal' ? window.stateManager.formatMoney(pm) : window.stateManager.formatMoney(pp)} • 
                      ${isClient ? `<strong style="color: #b45309;">+${Math.floor(pp * 0.1 * item.quantity)} pts fidélité</strong>` : `<strong style="color: var(--rtn-rose);">+${pv * item.quantity} PV</strong> • <span style="color: #be185d; font-weight: 700;">+${cv * item.quantity} CV</span>`}
                    </div>
                  </div>
                  <div class="cart-qty-ctrl">
                    <button class="btn-qty" onclick="window.shopController.updateQty('${item.product.id}', ${item.quantity - 1})">-</button>
                    <span style="font-weight: 700; font-size: 0.85rem; min-width: 18px; text-align: center;">${item.quantity}</span>
                    <button class="btn-qty" onclick="window.shopController.updateQty('${item.product.id}', ${item.quantity + 1})">+</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="cart-totals-breakdown">
            <div class="total-row">
              <span>Sous-total articles :</span>
              <strong>${window.stateManager.formatMoney(totals.totalPP)}</strong>
            </div>

            ${totals.clientDiscountDH > 0 ? `
              <div class="total-row" style="background: #fdf2f8; padding: 6px 8px; border-radius: 4px; border: 1px dashed #f472b6;">
                <span style="color: #be185d; font-weight: 700;"><i class="fas fa-tag"></i> Remise Client Direct (-10%) :</span>
                <strong style="color: #be185d; font-size: 0.95rem;">-${window.stateManager.formatMoney(totals.clientDiscountDH)}</strong>
              </div>
            ` : ''}

            <div class="total-row" style="background: #f8fafc; padding: 6px 8px; border-radius: 4px;">
              <span style="color: #475569;"><i class="fas fa-truck" style="color: #0284c7;"></i> Frais de Livraison (Amana Express) :</span>
              <strong style="color: #0284c7;">+${window.stateManager.formatMoney(totals.shippingFee)}</strong>
            </div>

            ${!isClient ? `
              <div class="total-row">
                <span>Points Activité (PV = PP ÷ 10) :</span>
                <strong style="color: var(--rtn-rose); font-size: 0.95rem;">+${totals.totalPV} PV</strong>
              </div>
              <div class="total-row">
                <span>Base Commissions (CV = 60% PM) :</span>
                <strong style="color: #be185d; font-size: 0.95rem;">+${totals.totalSV} CV</strong>
              </div>
            ` : ''}

            <div class="total-row" style="${isClient ? 'background: #fefce8; padding: 6px 8px; border-radius: 4px; border: 1px solid #fef08a;' : ''}">
              <span style="${isClient ? 'color: #854d0e; font-weight: 700;' : ''}"><i class="fas fa-gift" style="color: #ca8a04;"></i> Points Fidélité Gagnés (1 pt = 10 DH PP) :</span>
              <strong style="color: #ca8a04; font-size: 0.95rem;">+${totals.fidelityPoints} pts</strong>
            </div>

            ${this.currentOrderChannel === 'attached_client' ? `
              <div class="total-row" style="background: #f0fdf4; padding: 6px 8px; border-radius: 4px;">
                <span style="color: #15803d; font-weight: 700;">Gain Direct Vendeur (10% PP) :</span>
                <strong style="color: #15803d;">+${window.stateManager.formatMoney(commEstimate)}</strong>
              </div>
            ` : ''}

            <div class="total-row grand-total">
              <span>Montant Total Net TTC à Payer :</span>
              <span style="color: #15803d; font-size: 1.15rem;">${window.stateManager.formatMoney(totals.totalDH)}</span>
            </div>
          </div>

          ${!isClient ? `
            <!-- Diagnostic de Rentabilité & Solidité Financière (Slide 15/16) -->
            <div style="background: #f8fafc; border-radius: 6px; padding: 8px 10px; margin: 12px 0; font-size: 0.72rem; color: #475569; border: 1px solid #e2e8f0;">
              <div style="display:flex; justify-content:space-between;">
                <span>Payout Réseau Max Théorique :</span>
                <strong>${totals.maxTheoreticalPayoutDH.toFixed(2)} DH (${totals.payoutRatioPercent}%)</strong>
              </div>
              <div style="color: #15803d; font-weight: 600; margin-top: 2px;">
                ✓ Marge entreprise préservée (Sorties réseau ≤ 15% du CA)
              </div>
            </div>
          ` : ''}

          <!-- Choix du mode de règlement -->
          <div style="margin-bottom: 12px;">
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--rtn-navy); display:block; margin-bottom: 4px;">Mode de Règlement :</label>
            <select id="selectPaymentMethod" class="form-control" style="font-size: 0.8rem; padding: 6px 8px;">
              ${!isClient ? `<option value="E-Point">Portefeuille E-Point (Solde : ${window.stateManager.formatMoney(currentUser ? currentUser.walletDH : 0)})</option>` : ''}
              <option value="Carte Bancaire CMI" selected>Carte Bancaire CMI (Maroc - Sécurisé)</option>
              <option value="Paiement à la Livraison">Paiement à la Livraison (Cash / TPE)</option>
              <option value="Virement Bancaire">Virement Bancaire (CIH / Attijariwafa / BCP)</option>
            </select>
          </div>

          <button class="btn-checkout ${isClient ? 'btn-client-auth' : ''}" onclick="window.shopController.handleCheckout()">
            <i class="fas fa-lock"></i> Valider et Confirmer la Commande
          </button>
        `}
      </div>
    `;
  }

  handleAddToCart(productId) {
    window.stateManager.addToCart(productId, 1);
    const prod = window.stateManager.getProductById(productId);
    window.app.showToast(`« ${prod ? prod.name : 'Article'} » ajouté au panier.`, 'success');
    this.renderCart();
  }

  updateQty(productId, newQty) {
    window.stateManager.updateCartQuantity(productId, newQty);
    this.renderCart();
  }

  handleCheckout() {
    const paymentSelect = document.getElementById('selectPaymentMethod');
    const paymentMethod = paymentSelect ? paymentSelect.value : (window.stateManager.isClient() ? 'Carte Bancaire CMI' : 'E-Point');
    
    const result = window.stateManager.checkoutCart(paymentMethod, this.currentOrderChannel);
    if (!result.success) {
      window.app.showToast(result.message, 'error');
      return;
    }

    if (window.stateManager.isClient()) {
      window.app.showToast(`Commande ${result.order.id} confirmée ! Facture générée avec succès (+${result.order.fidelityPoints} pts fidélité gagnés).`, 'success');
    } else {
      window.app.showToast(`Commande ${result.order.id} validée avec succès ! Facture disponible, points PV/CV comptabilisés.`, 'success');
    }

    this.render();
    window.app.renderAllViews();

    // Affichage immédiat de la Facture officielle (Demande Marketing Good)
    if (window.app && typeof window.app.showInvoiceModal === 'function') {
      window.app.showInvoiceModal(result.order);
    }
  }
}

window.shopController = new ShopController();
