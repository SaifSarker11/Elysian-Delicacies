const CheckoutPage = {
    selectedPayment: 'CASH',

    render() {
        const main = document.getElementById('main-content');
        const items = Cart.getItems();
        const user = Session.getUser();

        if (items.length === 0) {
            App.navigate('cart');
            return;
        }

        const subtotal = Cart.getTotal();
        const couponData = JSON.parse(localStorage.getItem('elysian_coupon') || 'null');
        const discount = couponData ? couponData.discount : 0;
        const deliveryFee = 50;
        const total = subtotal - discount + deliveryFee;

        main.innerHTML = `
            <div class="container section">
                <div style="margin-bottom:28px">
                    <div class="section-eyebrow">Final Step</div>
                    <h1 class="section-heading-editorial">Confirm Order & Delivery</h1>
                    <p class="section-desc-editorial" style="margin-bottom:0">Please verify delivery instructions and preferred payment method.</p>
                </div>

                <div class="two-col-layout">
                    <div>
                        <div class="card" style="margin-bottom:24px">
                            <h3 style="font-family:var(--font-serif);font-size:1.25rem;font-weight:600;margin-bottom:16px">Delivery Address</h3>
                            <div class="form-group">
                                <label class="form-label">Neighborhood / Area</label>
                                <input type="text" class="form-input" id="checkout-area" value="${user.address?.area || ''}" placeholder="e.g. Gulshan 2, Banani, Uttara">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Street Address & Apartment</label>
                                <input type="text" class="form-input" id="checkout-street" value="${user.address?.street || ''}" placeholder="House, Road, Apartment #">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">City</label>
                                    <input type="text" class="form-input" id="checkout-city" value="${user.address?.city || 'Dhaka'}" placeholder="City">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Contact Number for Rider</label>
                                    <input type="tel" class="form-input" id="checkout-phone" value="${user.phone || ''}" placeholder="+8801...">
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <h3 style="font-family:var(--font-serif);font-size:1.25rem;font-weight:600;margin-bottom:16px">Payment Option</h3>
                            <div class="payment-methods">
                                <div class="payment-method ${this.selectedPayment === 'CASH' ? 'selected' : ''}" onclick="CheckoutPage.selectPayment(event, 'CASH')">
                                    <div class="method-icon">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                                    </div>
                                    <div class="method-name">Cash on Delivery</div>
                                </div>
                                <div class="payment-method ${this.selectedPayment === 'CARD' ? 'selected' : ''}" onclick="CheckoutPage.selectPayment(event, 'CARD')">
                                    <div class="method-icon">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                    </div>
                                    <div class="method-name">Credit / Debit Card</div>
                                </div>
                                <div class="payment-method ${this.selectedPayment === 'MOBILE_WALLET' ? 'selected' : ''}" onclick="CheckoutPage.selectPayment(event, 'MOBILE_WALLET')">
                                    <div class="method-icon">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                                    </div>
                                    <div class="method-name">bKash / Nagad</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="order-summary">
                            <h3>Order Overview</h3>
                            ${items.map(item => `
                                <div class="summary-row">
                                    <span>${item.menuItemName} × ${item.quantity}</span>
                                    <span>৳${item.totalPrice.toFixed(0)}</span>
                                </div>
                            `).join('')}
                            <div class="summary-row" style="margin-top:8px;border-top:1px solid var(--border-hairline)">
                                <span>Subtotal</span>
                                <span>৳${subtotal.toFixed(0)}</span>
                            </div>
                            ${discount > 0 ? `
                                <div class="summary-row discount-applied">
                                    <span>Voucher (${couponData.code})</span>
                                    <span>-৳${discount.toFixed(0)}</span>
                                </div>
                            ` : ''}
                            <div class="summary-row">
                                <span>Courier Delivery Fee</span>
                                <span>৳${deliveryFee}</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total Payable</span>
                                <span>৳${total.toFixed(0)}</span>
                            </div>
                            <button class="btn btn-primary btn-block btn-lg" style="margin-top:20px" onclick="CheckoutPage.placeOrder()" id="place-order-btn">
                                Complete Order — ৳${total.toFixed(0)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    selectPayment(event, method) {
        this.selectedPayment = method;
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    },

    async placeOrder() {
        const btn = document.getElementById('place-order-btn');
        btn.disabled = true;
        btn.textContent = 'Processing your order...';

        try {
            const user = Session.getUser();
            const items = Cart.getItems();
            const restaurantId = Cart.getRestaurantId();
            const subtotal = Cart.getTotal();
            const couponData = JSON.parse(localStorage.getItem('elysian_coupon') || 'null');
            const discount = couponData ? couponData.discount : 0;
            const deliveryFee = 50;
            const total = subtotal - discount + deliveryFee;

            const orderData = {
                customerId: user.id,
                restaurantId: restaurantId,
                items: items,
                subtotal: subtotal,
                discount: discount,
                deliveryFee: deliveryFee,
                total: total,
                status: 'PLACED',
                couponCode: couponData ? couponData.code : null,
                deliveryAddress: {
                    area: document.getElementById('checkout-area').value,
                    street: document.getElementById('checkout-street').value,
                    city: document.getElementById('checkout-city').value,
                    latitude: 23.7925,
                    longitude: 90.4078
                }
            };

            const result = await API.placeOrder(orderData);
            const order = result.order;

            // Process payment
            await API.processPayment({
                orderId: order.id,
                amount: total,
                paymentMethod: this.selectedPayment
            });

            Cart.clear();
            localStorage.removeItem('elysian_coupon');
            showToast('Order confirmed successfully!', 'success');
            App.navigate('tracking/' + order.id);
        } catch (err) {
            showToast(err.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Complete Order';
        }
    }
};
