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
            <div class="container section fade-in">
                <div class="dashboard-header">
                    <h1>💳 Checkout</h1>
                    <p>Review your order and place it</p>
                </div>

                <div class="two-col-layout">
                    <div>
                        <div class="card" style="margin-bottom:24px">
                            <h3 style="font-family:var(--font-heading);margin-bottom:16px">📍 Delivery Address</h3>
                            <div class="form-group">
                                <input type="text" class="form-input" id="checkout-area" value="${user.address?.area || ''}" placeholder="Area (e.g., Gulshan)">
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-input" id="checkout-street" value="${user.address?.street || ''}" placeholder="Street address">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <input type="text" class="form-input" id="checkout-city" value="${user.address?.city || 'Dhaka'}" placeholder="City">
                                </div>
                                <div class="form-group">
                                    <input type="tel" class="form-input" id="checkout-phone" value="${user.phone || ''}" placeholder="Phone number">
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <h3 style="font-family:var(--font-heading);margin-bottom:16px">💰 Payment Method</h3>
                            <div class="payment-methods">
                                <div class="payment-method ${this.selectedPayment === 'CASH' ? 'selected' : ''}" onclick="CheckoutPage.selectPayment(event, 'CASH')">
                                    <div class="method-icon">💵</div>
                                    <div class="method-name">Cash</div>
                                </div>
                                <div class="payment-method ${this.selectedPayment === 'CARD' ? 'selected' : ''}" onclick="CheckoutPage.selectPayment(event, 'CARD')">
                                    <div class="method-icon">💳</div>
                                    <div class="method-name">Card</div>
                                </div>
                                <div class="payment-method ${this.selectedPayment === 'MOBILE_WALLET' ? 'selected' : ''}" onclick="CheckoutPage.selectPayment(event, 'MOBILE_WALLET')">
                                    <div class="method-icon">📱</div>
                                    <div class="method-name">Mobile Wallet</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="order-summary">
                            <h3>📋 Order Summary</h3>
                            ${items.map(item => `
                                <div class="summary-row">
                                    <span>${item.menuItemName} × ${item.quantity}</span>
                                    <span>৳${item.totalPrice.toFixed(0)}</span>
                                </div>
                            `).join('')}
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span>৳${subtotal.toFixed(0)}</span>
                            </div>
                            ${discount > 0 ? `
                                <div class="summary-row discount-applied">
                                    <span>🎫 Coupon (${couponData.code})</span>
                                    <span>-৳${discount.toFixed(0)}</span>
                                </div>
                            ` : ''}
                            <div class="summary-row">
                                <span>Delivery Fee</span>
                                <span>৳${deliveryFee}</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total</span>
                                <span>৳${total.toFixed(0)}</span>
                            </div>
                            <button class="btn btn-primary btn-block btn-lg" style="margin-top:20px" onclick="CheckoutPage.placeOrder()" id="place-order-btn">
                                🚀 Place Order — ৳${total.toFixed(0)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    selectPayment(event, method) {
        this.selectedPayment = method;
        document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    },

    async placeOrder() {
        const btn = document.getElementById('place-order-btn');
        btn.disabled = true;
        btn.innerHTML = '⏳ Placing order...';

        try {
            const user = Session.getUser();
            const items = Cart.getItems();
            const restaurantId = Cart.getRestaurantId();
            const couponData = JSON.parse(localStorage.getItem('elysian_coupon') || 'null');

            const orderData = {
                customerId: user.id,
                customerName: user.name,
                restaurantId: restaurantId,
                items: items,
                deliveryAddress: {
                    area: document.getElementById('checkout-area').value,
                    street: document.getElementById('checkout-street').value,
                    city: document.getElementById('checkout-city').value,
                    latitude: user.address?.latitude || 23.7925,
                    longitude: user.address?.longitude || 90.4078
                },
                paymentMethod: this.selectedPayment,
                couponCode: couponData ? couponData.code : null,
                discount: couponData ? couponData.discount : 0,
                deliveryFee: 50
            };

            const result = await API.placeOrder(orderData);

            await API.processPayment({
                orderId: result.order.id,
                amount: result.order.total,
                method: this.selectedPayment
            });

            Cart.clear();
            localStorage.removeItem('elysian_coupon');

            showToast('Order placed successfully! 🎉', 'success');
            App.navigate('tracking/' + result.order.id);
        } catch (err) {
            showToast(err.message, 'error');
            btn.disabled = false;
            btn.innerHTML = '🚀 Place Order';
        }
    }
};
