/**
 * Routini eWorld MLM - Boutique en Ligne Cosmétiques & Gestion des Commandes
 * Modèle Officiel : ROUTINE ONE PLAN (23 Slides)
 * 
 * Règles Fondamentales :
 * 1. Double compteur : Points Qualification (PV) & Base Commissions (SV / CV)
 * 2. 3 Profils de Commande (Slide 14 & 15) :
 *    - Vente Client Rattaché : 10% direct au Partner vendeur + CV réseau
 *    - Achat Personnel Partner : Pas de 10% auto-commission (Slide 15 & 17)
 *    - Client Direct : 0% commission, points fidélité
 * 3. Points Fidélité Client : 20 pts = 10 DH (Slide 3)
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

    grid.innerHTML = products.map(p => `
      <div class="product-card ${p.isPack ? 'product-card-pack' : ''}">
        <div class="product-image-box" style="${p.isPack ? 'background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);' : ''}">
          <span class="product-badge-pv" title="Points Valeur de Qualification">${p.pv} PV</span>
          <span class="product-badge-sv" title="Valeur de Commission (Base N1/N2/N3/Leadership)">${p.sv} SV/CV</span>
          <div class="product-icon-art">${p.icon || '✨'}</div>
        </div>
        <div class="product-info">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="product-category">${p.category}</span>
            ${p.badge ? `<span style="font-size: 0.7rem; background: #be185d; color: #fff; padding: 2px 7px; border-radius: 4px; font-weight: 700;">${p.badge}</span>` : ''}
          </div>
          <h4 class="product-title">${p.name}</h4>
          <p class="product-desc">${p.desc}</p>
          
          <div class="product-pricing">
            <div class="price-dp">
              ${window.stateManager.formatMoney(p.priceDP_DH)}
              <small>Prix Partenaire (DP)</small>
            </div>
            <div class="price-retail" title="Prix Vente Public Recommandé (RP)">
              ${window.stateManager.formatMoney(p.priceRP_DH)}
              <small style="display: block; font-size: 0.65rem; color: #64748b;">Prix Public</small>
            </div>
          </div>

          <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b;">
            <span><i class="fas fa-gift" style="color: var(--rtn-gold);"></i> Fidélité : +${Math.floor(p.priceDP_DH * 0.1)} pts</span>
            <span>Stock : <strong>${p.stock}</strong></span>
          </div>

          <button class="btn-add-cart" style="${p.isPack ? 'background: #14532d;' : ''}" onclick="window.shopController.handleAddToCart('${p.id}')">
            <i class="fas fa-cart-plus"></i> ${p.isPack ? 'Ajouter ce Pack' : 'Ajouter au Panier'}
          </button>
        </div>
      </div>
    `).join('');

    this.renderCart();
  }

  renderCart() {
    const cartBox = document.getElementById('shopCartContainer');
    if (!cartBox) return;

    const cart = window.stateManager.cart;
    const totals = window.stateManager.getCartTotals();
    const currentUser = window.stateManager.currentUser;

    const commEstimate = this.currentOrderChannel === 'attached_client' 
      ? Math.round(totals.totalDH * 0.10) 
      : 0;

    cartBox.innerHTML = `
      <div class="cart-summary-box">
        <h3>
          <span><i class="fas fa-shopping-basket" style="color: var(--rtn-rose);"></i> Votre Panier Routini</span>
          <span class="status-badge status-success" style="font-size: 0.75rem;">${totals.totalItems} article(s)</span>
        </h3>

        <!-- Sélecteur de Profil de Commande (Slide 14 & 15) -->
        <div style="margin-bottom: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
          <label style="font-size: 0.78rem; font-weight: 800; display: block; margin-bottom: 6px; color: var(--rtn-navy);">
            <i class="fas fa-user-tag" style="color: #0284c7;"></i> Profil Commande (Slide 14/15) :
          </label>
          <select id="selectOrderChannel" class="form-control" style="font-size: 0.82rem; padding: 6px 8px;" onchange="window.shopController.setOrderChannel(this.value)">
            <option value="attached_client" ${this.currentOrderChannel === 'attached_client' ? 'selected' : ''}>
              🟢 Client Rattaché (10% Vendeur + CV Réseau)
            </option>
            <option value="partner_personal" ${this.currentOrderChannel === 'partner_personal' ? 'selected' : ''}>
              🟡 Achat Perso Partner (0% auto-commission, PV/CV)
            </option>
            <option value="direct_client" ${this.currentOrderChannel === 'direct_client' ? 'selected' : ''}>
              ⚪ Client Direct Routini (Fidélité, 0% MLM)
            </option>
          </select>
          <small style="display:block; font-size: 0.7rem; color: #64748b; margin-top: 4px;">
            ${this.currentOrderChannel === 'attached_client' ? 'Le Partner vendeur reçoit immédiatement 10% sur la commande.' : ''}
            ${this.currentOrderChannel === 'partner_personal' ? 'Slide 15 : L\'avantage vient de la vente à un client réel, pas de l\'auto-achat.' : ''}
            ${this.currentOrderChannel === 'direct_client' ? 'Client autonome acquis par la marque, stabilise la marge.' : ''}
          </small>
        </div>

        ${cart.length === 0 ? `
          <div style="text-align: center; padding: 30px 10px; color: #94a3b8;">
            <i class="fas fa-spa" style="font-size: 2.5rem; margin-bottom: 10px; opacity: 0.4; color: var(--rtn-rose);"></i>
            <p style="font-size: 0.85rem;">Votre panier est vide.<br>Sélectionnez vos soins ou packs pour accumuler vos PV et SV/CV.</p>
          </div>
        ` : `
          <div class="cart-items-list">
            ${cart.map(item => `
              <div class="cart-item-row">
                <div style="flex: 1; padding-right: 8px;">
                  <div class="cart-item-name">${item.product.name}</div>
                  <div class="cart-item-meta">
                    ${window.stateManager.formatMoney(item.product.priceDP_DH)} • 
                    <strong style="color: var(--rtn-rose);">+${item.product.pv * item.quantity} PV</strong> • 
                    <span style="color: #be185d; font-weight: 700;">${item.product.sv * item.quantity} SV</span>
                  </div>
                </div>
                <div class="cart-qty-ctrl">
                  <button class="btn-qty" onclick="window.shopController.updateQty('${item.product.id}', ${item.quantity - 1})">-</button>
                  <span style="font-weight: 700; font-size: 0.85rem; min-width: 18px; text-align: center;">${item.quantity}</span>
                  <button class="btn-qty" onclick="window.shopController.updateQty('${item.product.id}', ${item.quantity + 1})">+</button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="cart-totals-breakdown">
            <div class="total-row">
              <span>Points Qualification (PPV) :</span>
              <strong style="color: var(--rtn-rose); font-size: 0.95rem;">+${totals.totalPV} PV</strong>
            </div>
            <div class="total-row">
              <span>Base Commissions (SV / CV) :</span>
              <strong style="color: #be185d; font-size: 0.95rem;">+${totals.totalSV} SV</strong>
            </div>
            <div class="total-row">
              <span>Points Fidélité Client (Slide 3) :</span>
              <strong style="color: #b45309;">+${totals.fidelityPoints} pts</strong>
            </div>
            ${this.currentOrderChannel === 'attached_client' ? `
              <div class="total-row" style="background: #f0fdf4; padding: 6px 8px; border-radius: 4px;">
                <span style="color: #15803d; font-weight: 700;">Gain Direct Vendeur (10%) :</span>
                <strong style="color: #15803d;">+${window.stateManager.formatMoney(commEstimate)}</strong>
              </div>
            ` : ''}
            <div class="total-row grand-total">
              <span>Total Commande Partenaire :</span>
              <span style="color: #15803d; font-size: 1.15rem;">${window.stateManager.formatMoney(totals.totalDH)}</span>
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 6px;">Mode de Règlement :</label>
            <select id="checkoutPaymentMethod" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1.5px solid #cbd5e1; font-size: 0.85rem; font-family: inherit;">
              <option value="E-Point">Portefeuille E-Point (Solde: ${window.stateManager.formatMoney(currentUser ? currentUser.walletDH : 0)})</option>
              <option value="Carte Bancaire">Carte Bancaire / CMI Maroc</option>
              <option value="Institut Routini">Paiement en Institut Routini</option>
            </select>
          </div>

          <button class="btn-checkout" onclick="window.shopController.handleCheckout()">
            <i class="fas fa-check-circle"></i> Valider la Commande (${window.stateManager.formatMoney(totals.totalDH)})
          </button>
        `}
      </div>
    `;
  }

  handleAddToCart(productId) {
    window.stateManager.addToCart(productId, 1);
    const prod = window.stateManager.getProductById(productId);
    window.app.showToast(`${prod.isPack ? 'Pack' : 'Soin'} ajouté au panier (+${prod.pv} PV / +${prod.sv} SV) !`, 'success');
    this.renderCart();
  }

  updateQty(productId, newQty) {
    window.stateManager.updateCartQuantity(productId, newQty);
    this.renderCart();
  }

  handleCheckout() {
    const paymentMethod = document.getElementById('checkoutPaymentMethod').value;
    const channel = this.currentOrderChannel;
    const result = window.stateManager.checkoutCart(paymentMethod, channel);

    if (result.success) {
      const msg = channel === 'attached_client' 
        ? `Commande ${result.order.id} validée ! 10% commission créditée au vendeur et +${result.order.totalSV} CV transmis au réseau.`
        : `Commande ${result.order.id} validée ! +${result.order.totalPV} PV de qualification crédités.`;
      
      window.app.showToast(msg, 'success');
      window.app.renderAllViews();
    } else {
      window.app.showToast(result.message, 'error');
    }
  }
}

window.shopController = new ShopController();
