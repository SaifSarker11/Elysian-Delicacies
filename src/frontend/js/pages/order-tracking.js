const OrderTrackingPage = {
    pollInterval: null,
    currentOrderId: null,

    async render(orderId) {
        this.currentOrderId = orderId;
        clearInterval(this.pollInterval);

        const main = document.getElementById('main-content');
        main.innerHTML = '<div class="loading-spinner" style="padding-top:140px"><div class="spinner"></div></div>';

        await this.loadOrderData(orderId, true);

        // Auto-refresh order status in the background every 8 seconds
        this.pollInterval = setInterval(() => {
            if (App.currentPage && App.currentPage.startsWith('tracking')) {
                this.loadOrderData(this.currentOrderId, false);
            } else {
                clearInterval(this.pollInterval);
            }
        }, 8000);
    },

    async loadOrderData(orderId, isInitialLoad = false) {
        try {
            const data = await API.getOrder(orderId);
            const order = data.order;

            const steps = [
                { status: 'PLACED', label: 'Order Received', desc: 'Order details sent to kitchen', actionLabel: 'Kitchen: Confirm Order' },
                { status: 'CONFIRMED', label: 'Kitchen Confirmed', desc: 'Chef accepted the order', actionLabel: 'Kitchen: Start Cooking' },
                { status: 'PREPARING', label: 'Food in Preparation', desc: 'Dishes are being cooked fresh', actionLabel: 'Kitchen: Finish Packaging' },
                { status: 'READY', label: 'Packaging Complete', desc: 'Thermal sealing and inspection', actionLabel: 'Dispatch: Hand to Courier' },
                { status: 'PICKED_UP', label: 'Courier On The Way', desc: 'Assigned rider has picked up parcel', actionLabel: 'Courier: Confirm Delivery' },
                { status: 'DELIVERED', label: 'Delivered', desc: 'Arrived at your location', actionLabel: null }
            ];

            const statusOrder = steps.map(s => s.status);
            const currentIndex = statusOrder.indexOf(order.status);
            const isCancelled = order.status === 'CANCELLED';
            const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

            const main = document.getElementById('main-content');
            if (!main) return;

            main.innerHTML = `
                <div class="container section">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
                        <button class="btn btn-outline btn-sm" onclick="OrderTrackingPage.cleanup(); App.navigate('dashboard')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                            Back to Dashboard
                        </button>

                        <!-- Live Dispatch Simulation Bar: Progress Steps 2 through 6 -->
                        <div style="display:flex;align-items:center;gap:10px;background:var(--bg-surface-soft);padding:6px 14px;border-radius:var(--radius-full);border:1px solid var(--border-subtle)">
                            <span style="display:inline-flex;align-items:center;gap:6px;font-size:0.8rem;font-weight:700;color:var(--ink-secondary)">
                                <span class="status-dot open" style="width:8px;height:8px"></span>
                                Live Dispatch Flow
                            </span>
                            ${nextStep ? `
                                <button class="btn btn-primary btn-sm" style="padding:4px 12px;font-size:0.78rem" onclick="OrderTrackingPage.advanceStatus('${order.id}', '${nextStep.status}')">
                                    Simulate Next Step: ${nextStep.label} →
                                </button>
                            ` : `
                                <span class="badge badge-success" style="font-size:0.75rem">Order Completed</span>
                            `}
                        </div>
                    </div>
                    
                    <div style="margin-bottom:28px">
                        <div class="section-eyebrow">Real-Time Dispatch Tracker</div>
                        <h1 class="section-heading-editorial">${isCancelled ? 'Order Cancelled' : 'Live Delivery Status'}</h1>
                        <p class="section-desc-editorial" style="margin-bottom:0">Order #${order.id} ${order.restaurantName ? '· ' + order.restaurantName : ''}</p>
                    </div>

                    <div class="two-col-layout">
                        <div>
                            ${!isCancelled ? `
                                <div class="card" style="margin-bottom:24px;padding:24px">
                                    <div class="tracking-timeline">
                                        ${steps.map((step, i) => {
                                            let cls = '';
                                            let dotContent = i + 1;
                                            if (i < currentIndex) {
                                                cls = 'completed';
                                                dotContent = '✓';
                                            } else if (i === currentIndex) {
                                                cls = 'active';
                                            }
                                            return `
                                                <div class="timeline-step ${cls}">
                                                    <div class="timeline-dot">${dotContent}</div>
                                                    <div class="timeline-content">
                                                        <div style="display:flex;justify-content:space-between;align-items:center">
                                                            <h4>${step.label}</h4>
                                                            ${i === currentIndex && nextStep ? `
                                                                <button class="btn btn-outline btn-sm" style="font-size:0.75rem;padding:3px 9px" onclick="OrderTrackingPage.advanceStatus('${order.id}', '${nextStep.status}')">
                                                                    Advance Step →
                                                                </button>
                                                            ` : ''}
                                                        </div>
                                                        <p>${step.desc}</p>
                                                        ${i === currentIndex ? '<div class="time">Currently in progress</div>' : ''}
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div class="card">
                                <h3 style="font-family:var(--font-serif);font-size:1.2rem;font-weight:600;margin-bottom:16px">Order Items</h3>
                                ${order.items.map(item => `
                                    <div class="summary-row" style="padding:10px 0;border-bottom:1px solid var(--border-hairline)">
                                        <span>${item.menuItemName} × ${item.quantity}</span>
                                        <span style="font-weight:600">৳${item.totalPrice ? item.totalPrice.toFixed(0) : (item.unitPrice * item.quantity).toFixed(0)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div>
                            <div class="order-summary">
                                <h3>Delivery Details</h3>
                                <div class="summary-row"><span>Status</span><span class="badge ${this.getStatusBadge(order.status)}">${order.status}</span></div>
                                <div class="summary-row"><span>Courier Partner</span><span>${order.riderName || 'Assigning nearest courier'}</span></div>
                                ${order.estimatedDelivery ? `<div class="summary-row"><span>Estimated Arrival</span><span>${new Date(order.estimatedDelivery).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></div>` : ''}
                                <div class="summary-row"><span>Subtotal</span><span>৳${order.subtotal ? order.subtotal.toFixed(0) : '0'}</span></div>
                                ${order.discount > 0 ? `<div class="summary-row discount-applied"><span>Voucher</span><span>-৳${order.discount.toFixed(0)}</span></div>` : ''}
                                <div class="summary-row"><span>Courier Fee</span><span>৳${order.deliveryFee ? order.deliveryFee.toFixed(0) : '50'}</span></div>
                                <div class="summary-row total"><span>Total Paid</span><span>৳${order.total ? order.total.toFixed(0) : '0'}</span></div>
                                
                                ${order.deliveryAddress ? `
                                    <div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--border-hairline)">
                                        <div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.04em;font-weight:700;color:var(--ink-muted);margin-bottom:4px">Destination</div>
                                        <div style="font-size:0.88rem;color:var(--ink-primary);line-height:1.4">${order.deliveryAddress.street ? order.deliveryAddress.street + ', ' : ''}${order.deliveryAddress.area || ''}, ${order.deliveryAddress.city || ''}</div>
                                    </div>
                                ` : ''}

                                <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border-hairline);display:flex;flex-direction:column;gap:8px">
                                    <button class="btn btn-secondary btn-block btn-sm" onclick="OrderTrackingPage.loadOrderData('${order.id}', false)">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                                        Check Live Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            const main = document.getElementById('main-content');
            if (main) {
                main.innerHTML = `<div class="container section"><div class="empty-state"><p class="empty-text">${err.message}</p><button class="btn btn-primary" onclick="App.navigate('dashboard')">Go to Dashboard</button></div></div>`;
            }
        }
    },

    async advanceStatus(orderId, newStatus) {
        try {
            await API.updateOrderStatus(orderId, newStatus);
            showToast(`Order status updated to: ${newStatus}`, 'success');
            await this.loadOrderData(orderId, false);
        } catch (err) {
            showToast(err.message, 'error');
        }
    },

    cleanup() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    },

    getStatusBadge(status) {
        const map = { 
            'PLACED': 'badge-neutral', 
            'CONFIRMED': 'badge-info', 
            'PREPARING': 'badge-warning', 
            'READY': 'badge-primary', 
            'PICKED_UP': 'badge-info', 
            'DELIVERED': 'badge-success', 
            'CANCELLED': 'badge-danger' 
        };
        return map[status] || 'badge-neutral';
    }
};
