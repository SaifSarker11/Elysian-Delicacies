const RestaurantOrdersPage = {
    async render(restaurantId) {
        const main = document.getElementById('main-content');
        main.innerHTML = '<div class="loading-spinner" style="padding-top:140px"><div class="spinner"></div></div>';

        try {
            const [restData, orderData] = await Promise.all([
                API.getRestaurant(restaurantId),
                API.getRestaurantOrders(restaurantId)
            ]);

            const restaurant = restData.restaurant;
            const orders = orderData.orders || [];

            const pending = orders.filter(o => ['PLACED', 'CONFIRMED'].includes(o.status));
            const preparing = orders.filter(o => o.status === 'PREPARING');
            const ready = orders.filter(o => ['READY', 'PICKED_UP'].includes(o.status));
            const completed = orders.filter(o => o.status === 'DELIVERED');

            main.innerHTML = `
                <div class="container section">
                    <button class="btn btn-outline btn-sm" onclick="App.navigate('owner-dashboard')" style="margin-bottom:20px">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Dashboard
                    </button>
                    
                    <div style="margin-bottom:28px">
                        <div class="section-eyebrow">Order Queue</div>
                        <h1 class="section-heading-editorial">${restaurant.name}</h1>
                        <p class="section-desc-editorial" style="margin-bottom:0">${orders.length} total orders across service history</p>
                    </div>

                    <div class="stats-grid" style="margin-bottom:32px">
                        <div class="stat-card">
                            <div class="stat-value" style="color:var(--brand)">${pending.length}</div>
                            <div class="stat-label">New Orders</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" style="color:var(--saffron)">${preparing.length}</div>
                            <div class="stat-label">In Kitchen Prep</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${ready.length}</div>
                            <div class="stat-label">Ready / Dispatched</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" style="color:var(--forest)">${completed.length}</div>
                            <div class="stat-label">Completed</div>
                        </div>
                    </div>

                    <div class="tab-nav" id="order-tabs">
                        <div class="tab-item active" onclick="RestaurantOrdersPage.switchTab(event, 'all', '${restaurantId}')">All Orders (${orders.length})</div>
                        <div class="tab-item" onclick="RestaurantOrdersPage.switchTab(event, 'pending', '${restaurantId}')">New (${pending.length})</div>
                        <div class="tab-item" onclick="RestaurantOrdersPage.switchTab(event, 'preparing', '${restaurantId}')">Preparing (${preparing.length})</div>
                        <div class="tab-item" onclick="RestaurantOrdersPage.switchTab(event, 'ready', '${restaurantId}')">Ready for Pickup (${ready.length})</div>
                        <div class="tab-item" onclick="RestaurantOrdersPage.switchTab(event, 'completed', '${restaurantId}')">Delivered (${completed.length})</div>
                    </div>

                    <div id="orders-list" class="card" style="padding:16px 24px">
                        ${this.renderOrders(orders, restaurantId)}
                    </div>
                </div>
            `;

            this.allOrders = { all: orders, pending, preparing, ready, completed };
            this.currentRestaurantId = restaurantId;
        } catch (err) {
            main.innerHTML = `<div class="container section"><div class="empty-state"><p class="empty-text">${err.message}</p></div></div>`;
        }
    },

    allOrders: {},
    currentRestaurantId: null,

    switchTab(event, tab) {
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        const orders = this.allOrders[tab] || [];
        document.getElementById('orders-list').innerHTML = this.renderOrders(orders, this.currentRestaurantId);
    },

    renderOrders(orders, restaurantId) {
        if (!orders || orders.length === 0) {
            return '<div class="empty-state" style="padding:36px"><p class="empty-text">No orders under this filter.</p></div>';
        }

        return orders.map(order => `
            <div class="order-dashboard-card">
                <div class="order-info">
                    <div class="order-id">#${order.id}</div>
                    <div class="order-details">
                        ${order.customerName || 'Customer'} · ${order.items ? order.items.length : 0} items · ৳${order.total ? order.total.toFixed(0) : '0'}
                        ${order.createdAt ? ' · ' + new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}
                    </div>
                </div>
                <div class="order-actions">
                    <span class="badge ${OrderTrackingPage.getStatusBadge(order.status)}">${order.status}</span>
                    ${this.getActionButton(order, restaurantId)}
                </div>
            </div>
        `).join('');
    },

    getActionButton(order, restaurantId) {
        if (order.status === 'PLACED') {
            return `<button class="btn btn-primary btn-sm" onclick="RestaurantOrdersPage.updateStatus('${order.id}', 'CONFIRMED', '${restaurantId}')">Accept Order</button>`;
        }
        if (order.status === 'CONFIRMED') {
            return `<button class="btn btn-primary btn-sm" onclick="RestaurantOrdersPage.updateStatus('${order.id}', 'PREPARING', '${restaurantId}')">Start Cooking</button>`;
        }
        if (order.status === 'PREPARING') {
            return `<button class="btn btn-primary btn-sm" onclick="RestaurantOrdersPage.updateStatus('${order.id}', 'READY', '${restaurantId}')">Ready for Dispatch</button>`;
        }
        if (order.status === 'READY') {
            return `<button class="btn btn-secondary btn-sm" onclick="RestaurantOrdersPage.updateStatus('${order.id}', 'PICKED_UP', '${restaurantId}')">Hand to Courier</button>`;
        }
        if (order.status === 'PICKED_UP') {
            return `<button class="btn btn-secondary btn-sm" onclick="RestaurantOrdersPage.updateStatus('${order.id}', 'DELIVERED', '${restaurantId}')">Mark Delivered</button>`;
        }
        return '';
    },

    async updateStatus(orderId, status, restaurantId) {
        try {
            await API.updateOrderStatus(orderId, status);
            showToast(`Order status updated to ${status}`, 'success');
            this.render(restaurantId);
        } catch (err) {
            showToast(err.message, 'error');
        }
    }
};
