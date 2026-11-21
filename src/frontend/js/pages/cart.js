const CartPage = {
    render() {
        const main = document.getElementById('main-content');
        const items = Cart.getItems();

        if (items.length === 0) {
            main.innerHTML = `
                <div class="container section">
                    <div class="empty-state" style="padding-top:60px">
                        <div class="empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                        </div>
                        <h2 style="font-family:var(--font-serif);font-size:1.6rem;font-weight:600;margin-bottom:8px">Your order is empty</h2>
                        <p class="empty-text">Explore our collection of local kitchens and add your favorite dishes.</p>
                        <button class="btn btn-primary btn-lg" onclick="App.navigate('restaurants')">Browse Kitchens</button>
                    </div>
                </div>
            `;
            return;
        }

        const subtotal = Cart.getTotal();

        main.innerHTML = `
            <div class="container section">
                <div style="margin-bottom:28px">
                    <div class="section-eyebrow">Checkout Process</div>
                    <h1 class="section-heading-editorial">Review Your Order</h1>
                    <p class="section-desc-editorial" style="margin-bottom:0">${items.length} item${items.length === 1 ? '' : 's'} prepared for delivery</p>
                </div>

                <div class="two-col-layout">
                    <div>
                        <div class="card" style="padding:16px 24px">
                            ${items.map(item => `
                                <div class="cart-item">
                                    <div class="cart-item-info">
                                        <div class="cart-item-name">${item.menuItemName}</div>
                                        <div class="cart-item-price">৳${item.unitPrice} per portion</div>
                                    </div>
                                    <div class="quantity-controls">
                                        <button class="quantity-btn" onclick="CartPage.updateQty('${item.menuItemId}', ${item.quantity - 1})">−</button>
                                        <span class="quantity-value">${item.quantity}</span>
                                        <button class="quantity-btn" onclick="CartPage.updateQty('${item.menuItemId}', ${item.quantity + 1})">+</button>
                                    </div>
                                    <span style="font-weight:700;min-width:70px;text-align:right">৳${item.totalPrice.toFixed(0)}</span>
                                    <button class="btn-icon" title="Remove item" onclick="CartPage.removeItem('${item.menuItemId}')">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-outline btn-sm" style="margin-top:16px" onclick="if(confirm('Clear all items from your order?')){Cart.clear();CartPage.render();}">
                            Clear Order
                        </button>
                    </div>
                    <div>
                        <div class="order-summary" id="cart-summary">
                            <h3>Summary</h3>
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span>৳${subtotal.toFixed(0)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Estimated Courier Fee</span>
                                <span>৳50</span>
                            </div>
                            <div class="coupon-input">
                                <input type="text" class="form-input" placeholder="Promotional voucher code" id="coupon-code">
                                <button class="btn btn-secondary btn-sm" onclick="CartPage.applyCoupon()">Apply</button>
                            </div>
                            <div id="coupon-result"></div>
                            <div class="summary-row total">
                                <span>Total</span>
                                <span id="cart-total">৳${(subtotal + 50).toFixed(0)}</span>
                            </div>
                            <button class="btn btn-primary btn-block btn-lg" style="margin-top:18px" onclick="App.navigate('checkout')">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    updateQty(itemId, qty) {
        Cart.updateQuantity(itemId, qty);
        this.render();
        Navbar.render();
    },

    removeItem(itemId) {
        Cart.removeItem(itemId);
        this.render();
        Navbar.render();
    },

    async applyCoupon() {
        const code = document.getElementById('coupon-code').value.trim();
        if (!code) return;

        try {
            const subtotal = Cart.getTotal();
            const result = await API.validateCoupon(code, subtotal);
            
            document.getElementById('coupon-result').innerHTML = `
                <div style="padding:8px 12px;border-radius:6px;background:var(--forest-light);color:var(--forest);font-size:0.84rem;margin-bottom:10px;border:1px solid var(--forest-border)">
                    Voucher applied: <strong>${result.coupon.code}</strong> (৳${result.discount.toFixed(0)} savings)
                </div>
            `;

            localStorage.setItem('elysian_coupon', JSON.stringify({
                code: result.coupon.code,
                discount: result.discount
            }));

            const total = subtotal - result.discount + 50;
            document.getElementById('cart-total').textContent = `৳${total.toFixed(0)}`;
            showToast(`Voucher ${result.coupon.code} applied`, 'success');
        } catch (err) {
            document.getElementById('coupon-result').innerHTML = `
                <div style="padding:8px 12px;border-radius:6px;background:var(--crimson-light);color:var(--crimson);font-size:0.84rem;margin-bottom:10px">
                    ${err.message}
                </div>
            `;
            localStorage.removeItem('elysian_coupon');
        }
    }
};
