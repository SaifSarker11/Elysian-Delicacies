const CartPage = {
    render() {
        const main = document.getElementById('main-content');
        const items = Cart.getItems();

        if (items.length === 0) {
            main.innerHTML = `
                <div class="container section fade-in">
                    <div class="empty-state" style="padding-top:80px">
                        <div class="empty-icon">🛒</div>
                        <p class="empty-text">Your cart is empty</p>
                        <button class="btn btn-primary btn-lg" onclick="App.navigate('restaurants')">Browse Restaurants</button>
                    </div>
                </div>
            `;
            return;
        }

        const subtotal = Cart.getTotal();

        main.innerHTML = `
            <div class="container section fade-in">
                <div class="dashboard-header">
                    <h1>🛒 Your Cart</h1>
                    <p>${items.length} item(s) from your order</p>
                </div>

                <div class="two-col-layout">
                    <div>
                        <div class="card">
                            ${items.map(item => `
                                <div class="cart-item">
                                    <div class="cart-item-info">
                                        <div class="cart-item-name">${item.menuItemName}</div>
                                        <div class="cart-item-price">৳${item.unitPrice} each</div>
                                    </div>
                                    <div class="quantity-controls">
                                        <button class="quantity-btn" onclick="CartPage.updateQty('${item.menuItemId}', ${item.quantity - 1})">−</button>
                                        <span class="quantity-value">${item.quantity}</span>
                                        <button class="quantity-btn" onclick="CartPage.updateQty('${item.menuItemId}', ${item.quantity + 1})">+</button>
                                    </div>
                                    <span style="font-weight:700;min-width:60px;text-align:right">৳${item.totalPrice.toFixed(0)}</span>
                                    <button class="btn btn-icon" style="color:var(--danger)" onclick="CartPage.removeItem('${item.menuItemId}')">🗑️</button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-secondary btn-sm" style="margin-top:16px" onclick="if(confirm('Clear entire cart?')){Cart.clear();CartPage.render();}">Clear Cart</button>
                    </div>
                    <div>
                        <div class="order-summary" id="cart-summary">
                            <h3>Order Summary</h3>
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span>৳${subtotal.toFixed(0)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Delivery Fee</span>
                                <span>~৳50</span>
                            </div>
                            <div class="coupon-input">
                                <input type="text" class="form-input" placeholder="Coupon code" id="coupon-code">
                                <button class="btn btn-secondary btn-sm" onclick="CartPage.applyCoupon()">Apply</button>
                            </div>
                            <div id="coupon-result"></div>
                            <div class="summary-row total">
                                <span>Total</span>
                                <span id="cart-total">৳${(subtotal + 50).toFixed(0)}</span>
                            </div>
                            <button class="btn btn-primary btn-block btn-lg" style="margin-top:16px" onclick="App.navigate('checkout')">
                                Proceed to Checkout →
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
                <div style="padding:8px;border-radius:8px;background:rgba(46,213,115,0.1);color:var(--success);font-size:0.85rem;margin-bottom:8px">
                    ✅ ${result.description} — You save ৳${result.discount.toFixed(0)}!
                </div>
            `;
            
            const total = subtotal - result.discount + 50;
            document.getElementById('cart-total').textContent = `৳${total.toFixed(0)}`;
            
            localStorage.setItem('elysian_coupon', JSON.stringify({
                code: result.code,
                discount: result.discount
            }));
            
            showToast('Coupon applied!', 'success');
        } catch (err) {
            document.getElementById('coupon-result').innerHTML = `
                <div style="padding:8px;border-radius:8px;background:rgba(255,71,87,0.1);color:var(--danger);font-size:0.85rem;margin-bottom:8px">
                    ❌ ${err.message}
                </div>
            `;
            localStorage.removeItem('elysian_coupon');
        }
    }
};
