const RestaurantOrdersPage = {
    async render(restaurantId) {
        const main = document.getElementById('main-content');
        main.innerHTML = '<div class="loading-spinner" style="padding-top:200px"><div class="spinner"></div></div>';

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
                <div class="container section fade-in">
                    <button class="btn btn-secondary btn-sm" onclick="App.navigate('owner-dashboard')" style="margin-bottom:24px">← Back to Dashboard</button>
                    
                    <div class="dashboard-header">
                        <h1>📋 Orders — ${restaurant.name}</h1>
                        <p>${orders.length} total orders</p>
                    </div>

                    <div class="stats-grid stagger" style="margin-bottom:32px">
                        <div class="stat-card">
                            <div class="stat-value">${pending.length}</div>
                            <div class="stat-label">🆕 New</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${preparing.length}</div>
                            <div class="stat-label">👨‍🍳 Preparing</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${ready.length}</div>
                            <div class="stat-label">📦 Ready</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${completed.length}</div>
                            <div class="stat-label">✅ Delivered</div>
                        </div>
                    </div>

                    <div class="tab-nav" id="order-tabs">
                        <div class="tab-item active" onclick="RestaurantOrdersPage.switchTab(event, 'all', '${restaurantId}')">All (${orders.length})</div>
                        <div class="tab-item" onclick="RestaurantOrdersPage.switchTab(event, 'pending', '${restaurantId}')">New (${pending.length})</div>
                        <div class="tab-item" onclick="RestaurantOrdersPage.switchTab(event, 'preparing', '${restaurantId}')">Preparing (${preparing.length})</div>
                        <div class="tab-item" onclick="RestaurantOrdersPage.switchTab(event, 'ready', '${restaurantId}')">Ready (${ready.length})</div>
                        <div class="tab-item" onclick="RestaurantOrdersPage.switchTab(event, 'completed', '${restaurantId}')">Delivered (${completed.length})</div>
                    </div>

                    <div id="orders-list" class="card">
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
        if (orders.length === 0) {
            return '<div class="empty-state" style="padding:48px"><p class="empty-text">No orders in this category</p></div>';
        }

        return orders.map(order => `
            <div class="order-dashboard-card">
                <div class="order-info">
                    <div class="order-id">#${order.id}</div>
                    <div class="order-details">
                        ${order.customerName || 'Customer'} • ${order.items ? order.items.length : 0} items • ৳${order.total ? order.total.toFixed(0) : '0'}
                        ${order.createdAt ? ' • ' + new Date(order.createdAt).toLocaleString() : ''}
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
        const nextStatus = {
            'PLACED': 'CONFIRMED',
            'CONFIRMED': 'PREPARING',
            'PREPARING': 'READY',
            'READY': 'PICKED_UP',
            'PICKED_UP': 'DELIVERED'
        };

        const next = nextStatus[order.status];
        if (!next) return '';

        const labels = {
            'CONFIRMED': 'Confirm',
            'PREPARING': 'Start Cooking',
            'READY': 'Mark Ready',
            'PICKED_UP': 'Picked Up',
            'DELIVERED': 'Delivered'
        };

        return `<button class="btn btn-primary btn-sm" onclick="RestaurantOrdersPage.updateStatus('${order.id}', '${next}', '${restaurantId}')">${labels[next]}</button>`;
    },

    async updateStatus(orderId, newStatus, restaurantId) {
        try {
            await API.updateOrderStatus(orderId, newStatus);
            showToast(`Order updated to ${newStatus}`, 'success');
            this.render(restaurantId);
        } catch (err) {
            showToast(err.message, 'error');
        }
    }
};
