const RestaurantDashboardPage = {
    async render() {
        const main = document.getElementById('main-content');
        const user = Session.getUser();

        main.innerHTML = `
            <div class="container section fade-in">
                <div class="dashboard-header">
                    <h1>🏪 Restaurant Dashboard</h1>
                    <p>Welcome back, ${user.name}</p>
                </div>

                <div id="owner-restaurants">
                    <div class="loading-spinner"><div class="spinner"></div></div>
                </div>
            </div>
        `;

        try {
            const data = await API.getRestaurants({ ownerId: user.id });
            const restaurants = data.restaurants;
            const container = document.getElementById('owner-restaurants');

            if (restaurants.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🏪</div>
                        <p class="empty-text">You haven't registered any restaurants yet</p>
                        <button class="btn btn-primary btn-lg" onclick="App.navigate('register-restaurant')">+ Register Restaurant</button>
                    </div>
                `;
                return;
            }

            // Load orders for all restaurants
            let totalOrders = 0;
            let totalRevenue = 0;
            let pendingOrders = 0;
            let allOrders = [];

            for (const r of restaurants) {
                try {
                    const orderData = await API.getRestaurantOrders(r.id);
                    allOrders = allOrders.concat(orderData.orders.map(o => ({...o, restaurantName: r.name})));
                    totalOrders += orderData.orders.length;
                    totalRevenue += orderData.orders.reduce((sum, o) => sum + (o.total || 0), 0);
                    pendingOrders += orderData.orders.filter(o => ['PLACED', 'CONFIRMED', 'PREPARING'].includes(o.status)).length;
                } catch (e) {}
            }

            container.innerHTML = `
                <div class="stats-grid stagger">
                    <div class="stat-card">
                        <div class="stat-value">${restaurants.length}</div>
                        <div class="stat-label">Restaurants</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${totalOrders}</div>
                        <div class="stat-label">Total Orders</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${pendingOrders}</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">৳${totalRevenue.toFixed(0)}</div>
                        <div class="stat-label">Revenue</div>
                    </div>
                </div>

                <h2 style="font-family:var(--font-heading);font-weight:700;margin:32px 0 16px">Your Restaurants</h2>
                <div class="grid-3 stagger">
                    ${restaurants.map(r => `
                        <div class="card" style="cursor:pointer">
                            <div class="card-image">
                                <div class="card-image-placeholder">${getCuisineEmoji(r.cuisineType)}</div>
                            </div>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                                <h3 style="font-family:var(--font-heading);font-weight:700">${r.name}</h3>
                                <div class="toggle-switch ${r.open || r.isOpen ? 'active' : ''}" 
                                     onclick="event.stopPropagation();RestaurantDashboardPage.toggleStatus('${r.id}')" 
                                     title="${r.open || r.isOpen ? 'Click to close' : 'Click to open'}"></div>
                            </div>
                            <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:12px">${r.cuisineType} • Rating: ${r.rating.toFixed(1)}</p>
                            <div style="display:flex;gap:8px">
                                <button class="btn btn-secondary btn-sm" onclick="App.navigate('restaurant/${r.id}')">View Menu</button>
                                <button class="btn btn-primary btn-sm" onclick="App.navigate('restaurant-orders/${r.id}')">Orders</button>
                                <button class="btn btn-secondary btn-sm" onclick="RestaurantDashboardPage.manageMenu('${r.id}')">⚙️</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${allOrders.length > 0 ? `
                    <h2 style="font-family:var(--font-heading);font-weight:700;margin:32px 0 16px">📋 Recent Orders</h2>
                    <div class="card">
                        ${allOrders.slice(0, 10).map(order => `
                            <div class="order-dashboard-card">
                                <div class="order-info">
                                    <div class="order-id">#${order.id} — ${order.restaurantName}</div>
                                    <div class="order-details">${order.customerName || 'Customer'} • ${order.items ? order.items.length : 0} items • ৳${order.total ? order.total.toFixed(0) : '0'}</div>
                                </div>
                                <div class="order-actions">
                                    <span class="badge ${OrderTrackingPage.getStatusBadge(order.status)}">${order.status}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            `;
        } catch (err) {
            showToast(err.message, 'error');
        }
    },

    async toggleStatus(restaurantId) {
        try {
            const result = await API.toggleRestaurantStatus(restaurantId);
            showToast(result.message, 'success');
            this.render();
        } catch (err) {
            showToast(err.message, 'error');
        }
    },

    async manageMenu(restaurantId) {
        try {
            const menuData = await API.getMenu(restaurantId);
            const items = menuData.menuItems || [];

            Modal.show('📋 Manage Menu', `
                <div style="max-height:400px;overflow-y:auto">
                    ${items.length === 0 ? '<p style="color:var(--text-secondary);text-align:center;padding:24px">No menu items</p>' : ''}
                    ${items.map(item => `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)">
                            <div>
                                <div style="font-weight:600">${item.name}</div>
                                <div style="font-size:0.8rem;color:var(--text-secondary)">৳${item.price} • ${item.category} • Qty: ${item.quantity}</div>
                            </div>
                            <div style="display:flex;gap:8px;align-items:center">
                                <div class="toggle-switch ${item.available ? 'active' : ''}" 
                                     onclick="RestaurantDashboardPage.toggleItemAvailability('${item.id}')"
                                     title="${item.available ? 'Available' : 'Unavailable'}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="RestaurantDashboardPage.showAddItemForm('${restaurantId}')">+ Add Menu Item</button>
            `);
        } catch (err) {
            showToast(err.message, 'error');
        }
    },

    async toggleItemAvailability(itemId) {
        try {
            const result = await API.toggleMenuAvailability(itemId);
            showToast(result.message, 'success');
            Modal.close();
        } catch (err) {
            showToast(err.message, 'error');
        }
    },

    showAddItemForm(restaurantId) {
        Modal.show('➕ Add Menu Item', `
            <form onsubmit="RestaurantDashboardPage.addMenuItem(event, '${restaurantId}')">
                <div class="form-group">
                    <label class="form-label">Item Name</label>
                    <input type="text" class="form-input" id="new-item-name" required placeholder="e.g., Chicken Biryani">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" class="form-input" id="new-item-desc" required placeholder="Brief description">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Price (৳)</label>
                        <input type="number" class="form-input" id="new-item-price" required min="1" placeholder="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Quantity</label>
                        <input type="number" class="form-input" id="new-item-qty" required min="1" value="50" placeholder="Stock">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select class="form-select" id="new-item-category">
                        <option value="Main Course">Main Course</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Sides">Sides</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Add Item</button>
            </form>
        `);
    },

    async addMenuItem(e, restaurantId) {
        e.preventDefault();
        try {
            await API.addMenuItem({
                restaurantId: restaurantId,
                name: document.getElementById('new-item-name').value,
                description: document.getElementById('new-item-desc').value,
                price: parseFloat(document.getElementById('new-item-price').value),
                quantity: parseInt(document.getElementById('new-item-qty').value),
                category: document.getElementById('new-item-category').value,
                available: true,
                addOns: []
            });
            showToast('Menu item added!', 'success');
            Modal.close();
        } catch (err) {
            showToast(err.message, 'error');
        }
    }
};
