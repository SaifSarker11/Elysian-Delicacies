const OrderTrackingPage = {
    async render(orderId) {
        const main = document.getElementById('main-content');
        main.innerHTML = '<div class="loading-spinner" style="padding-top:200px"><div class="spinner"></div></div>';

        try {
            const data = await API.getOrder(orderId);
            const order = data.order;

            const steps = [
                { status: 'PLACED', label: 'Order Placed', icon: '📋', desc: 'Your order has been received' },
                { status: 'CONFIRMED', label: 'Confirmed', icon: '✅', desc: 'Restaurant confirmed your order' },
                { status: 'PREPARING', label: 'Preparing', icon: '👨‍🍳', desc: 'Your food is being prepared' },
                { status: 'READY', label: 'Ready', icon: '📦', desc: 'Order is ready for pickup' },
                { status: 'PICKED_UP', label: 'On the Way', icon: '🏍️', desc: 'Rider is delivering your food' },
                { status: 'DELIVERED', label: 'Delivered', icon: '🎉', desc: 'Enjoy your meal!' }
            ];

            const statusOrder = steps.map(s => s.status);
            const currentIndex = statusOrder.indexOf(order.status);
            const isCancelled = order.status === 'CANCELLED';

            main.innerHTML = `
                <div class="container section fade-in">
                    <button class="btn btn-secondary btn-sm" onclick="App.navigate('dashboard')" style="margin-bottom:24px">← Back to Dashboard</button>
                    
                    <div class="dashboard-header">
                        <h1>${isCancelled ? '❌ Order Cancelled' : '📍 Track Your Order'}</h1>
                        <p>Order #${order.id}${order.restaurantName ? ' from ' + order.restaurantName : ''}</p>
                    </div>

                    <div class="two-col-layout">
                        <div>
                            ${!isCancelled ? `
                                <div class="card" style="margin-bottom:24px">
                                    <div class="tracking-timeline">
                                        ${steps.map((step, i) => {
                                            let cls = '';
                                            if (i < currentIndex) cls = 'completed';
                                            else if (i === currentIndex) cls = 'active';
                                            return `
                                                <div class="timeline-step ${cls}">
                                                    <div class="timeline-dot">${i < currentIndex ? '✓' : step.icon}</div>
                                                    <div class="timeline-content">
                                                        <h4>${step.label}</h4>
                                                        <p>${step.desc}</p>
                                                        ${i === currentIndex ? '<div class="time">Current status</div>' : ''}
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div class="card">
                                <h3 style="font-family:var(--font-heading);margin-bottom:16px">📦 Order Items</h3>
                                ${order.items.map(item => `
                                    <div class="summary-row" style="padding:8px 0">
                                        <span>${item.menuItemName} × ${item.quantity}</span>
                                        <span>৳${item.totalPrice ? item.totalPrice.toFixed(0) : (item.unitPrice * item.quantity).toFixed(0)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div>
                            <div class="order-summary">
                                <h3>📋 Order Details</h3>
                                <div class="summary-row"><span>Status</span><span class="badge ${this.getStatusBadge(order.status)}">${order.status}</span></div>
                                <div class="summary-row"><span>Rider</span><span>${order.riderName || 'Not assigned'}</span></div>
                                ${order.estimatedDelivery ? `<div class="summary-row"><span>ETA</span><span>${new Date(order.estimatedDelivery).toLocaleTimeString()}</span></div>` : ''}
                                <div class="summary-row"><span>Subtotal</span><span>৳${order.subtotal ? order.subtotal.toFixed(0) : '0'}</span></div>
                                ${order.discount > 0 ? `<div class="summary-row discount-applied"><span>Discount</span><span>-৳${order.discount.toFixed(0)}</span></div>` : ''}
                                <div class="summary-row"><span>Delivery</span><span>৳${order.deliveryFee ? order.deliveryFee.toFixed(0) : '50'}</span></div>
                                <div class="summary-row total"><span>Total</span><span>৳${order.total ? order.total.toFixed(0) : '0'}</span></div>
                                
                                ${order.deliveryAddress ? `
                                    <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
                                        <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:4px">📍 Delivery Address</div>
                                        <div style="font-size:0.9rem">${order.deliveryAddress.street ? order.deliveryAddress.street + ', ' : ''}${order.deliveryAddress.area || ''}, ${order.deliveryAddress.city || ''}</div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            main.innerHTML = `<div class="container section"><div class="empty-state"><div class="empty-icon">😥</div><p class="empty-text">${err.message}</p><button class="btn btn-primary" onclick="App.navigate('dashboard')">Go to Dashboard</button></div></div>`;
        }
    },

    getStatusBadge(status) {
        const map = { 'PLACED': 'badge-info', 'CONFIRMED': 'badge-info', 'PREPARING': 'badge-warning', 'READY': 'badge-primary', 'PICKED_UP': 'badge-primary', 'DELIVERED': 'badge-success', 'CANCELLED': 'badge-danger' };
        return map[status] || 'badge-info';
    }
};
