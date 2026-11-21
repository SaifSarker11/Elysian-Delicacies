const RestaurantDashboardPage = {
    async render() {
        const main = document.getElementById('main-content');
        const user = Session.getUser();

        main.innerHTML = `
            <div class="container section">
                <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px;flex-wrap:wrap;gap:16px">
                    <div>
                        <div class="section-eyebrow">Partner Operations</div>
                        <h1 class="section-heading-editorial">Kitchen Operations</h1>
                        <p class="section-desc-editorial" style="margin-bottom:0">Manage active kitchen listings, menu items, and customer order fulfilment.</p>
                    </div>
                    <div>
                        <button class="btn btn-primary btn-sm" onclick="App.navigate('register-restaurant')">+ Register New Kitchen</button>
                    </div>
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

            if (!restaurants || restaurants.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        </div>
                        <h2 style="font-family:var(--font-serif);font-size:1.5rem;font-weight:600;margin-bottom:8px">No kitchens registered</h2>
                        <p class="empty-text">List your restaurant to start accepting online orders from customers across Dhaka.</p>
                        <button class="btn btn-primary btn-lg" onclick="App.navigate('register-restaurant')">Add Your Kitchen</button>
                    </div>
                `;
                return;
            }

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
                <div class="stats-grid" style="margin-bottom:32px">
                    <div class="stat-card">
                        <div class="stat-value">${restaurants.length}</div>
                        <div class="stat-label">Active Kitchens</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${totalOrders}</div>
                        <div class="stat-label">Total Orders</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" style="color:var(--brand)">${pendingOrders}</div>
                        <div class="stat-label">Orders to Fulfill</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">৳${totalRevenue.toFixed(0)}</div>
                        <div class="stat-label">Gross Revenue</div>
                    </div>
                </div>

                <h3 style="font-family:var(--font-serif);font-size:1.35rem;font-weight:600;margin-bottom:16px">Your Kitchen Locations</h3>
                <div class="grid-3" style="margin-bottom:40px">
                    ${restaurants.map(r => `
                        <div class="card" style="padding:0;overflow:hidden">
                            <div style="height:120px;position:relative;background:var(--bg-surface-soft)">
                                <img src="${getCuisinePhoto(r.cuisineType)}" alt="${r.name}" style="width:100%;height:100%;object-fit:cover">
                                <span class="badge" style="position:absolute;top:10px;left:10px;background:rgba(255,255,255,0.95);font-weight:700">${r.cuisineType}</span>
                            </div>
                            <div style="padding:16px">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                                    <h4 style="font-family:var(--font-serif);font-weight:600;font-size:1.15rem">${r.name}</h4>
                                    <div class="toggle-switch ${r.open || r.isOpen ? 'active' : ''}" 
                                         onclick="event.stopPropagation();RestaurantDashboardPage.toggleStatus('${r.id}')" 
                                         title="${r.open || r.isOpen ? 'Click to close kitchen' : 'Click to open kitchen'}"></div>
                                </div>
                                <p style="color:var(--ink-secondary);font-size:0.84rem;margin-bottom:14px">Rating: ★ ${r.rating.toFixed(1)} · ${r.address?.area || 'Dhaka'}</p>
                                <div style="display:flex;gap:8px">
                                    <button class="btn btn-outline btn-sm" onclick="App.navigate('restaurant/${r.id}')">Customer View</button>
                                    <button class="btn btn-primary btn-sm" onclick="App.navigate('restaurant-orders/${r.id}')">Order Queue</button>
                                    <button class="btn btn-secondary btn-sm" onclick="RestaurantDashboardPage.manageMenu('${r.id}')">Edit Menu</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${allOrders.length > 0 ? `
                    <h3 style="font-family:var(--font-serif);font-size:1.35rem;font-weight:600;margin-bottom:16px">Recent Order Activity</h3>
                    <div class="card">
                        ${allOrders.slice(0, 10).map(order => `
                            <div class="order-dashboard-card">
                                <div class="order-info">
                                    <div class="order-id">#${order.id} — ${order.restaurantName}</div>
                                    <div class="order-details">${order.customerName || 'Customer'} · ${order.items ? order.items.length : 0} items · ৳${order.total ? order.total.toFixed(0) : '0'}</div>
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
            showToast(result.message || 'Kitchen status updated', 'success');
            this.render();
        } catch (err) {
            showToast(err.message, 'error');
        }
    },

    async manageMenu(restaurantId) {
        try {
            const menuData = await API.getMenu(restaurantId);
            const items = menuData.menuItems || [];

            Modal.show('Kitchen Menu Inventory', `
                <div style="max-height:400px;overflow-y:auto">
                    ${items.length === 0 ? '<p style="color:var(--ink-muted);text-align:center;padding:24px">No menu items created yet.</p>' : ''}
                    ${items.map(item => `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border-hairline)">
                            <div>
                                <div style="font-weight:600;font-size:0.95rem">${item.name}</div>
                                <div style="font-size:0.8rem;color:var(--ink-secondary)">৳${item.price} · ${item.category} · In stock: ${item.quantity}</div>
                            </div>
                            <div style="display:flex;gap:8px;align-items:center">
                                <div class="toggle-switch ${item.available ? 'active' : ''}" 
                                     onclick="RestaurantDashboardPage.toggleItemAvailability('${item.id}')"
                                     title="${item.available ? 'Available' : 'Sold out'}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary btn-block" style="margin-top:18px" onclick="RestaurantDashboardPage.showAddItemForm('${restaurantId}')">+ Add Dish to Menu</button>
            `);
        } catch (err) {
            showToast(err.message, 'error');
        }
    },

    async toggleItemAvailability(itemId) {
        try {
            const result = await API.toggleMenuAvailability(itemId);
            showToast(result.message || 'Item availability updated', 'success');
            Modal.close();
        } catch (err) {
            showToast(err.message, 'error');
        }
    },

    showAddItemForm(restaurantId) {
        Modal.show('New Menu Item', `
            <form onsubmit="RestaurantDashboardPage.addMenuItem(event, '${restaurantId}')">
                <div class="form-group">
                    <label class="form-label">Dish Name</label>
                    <input type="text" class="form-input" id="new-item-name" required placeholder="e.g. Saffron Mutton Kacchi">
                </div>
                <div class="form-group">
                    <label class="form-label">Description & Ingredients</label>
                    <input type="text" class="form-input" id="new-item-desc" required placeholder="Description of flavors, spices, portions">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Price (৳)</label>
                        <input type="number" class="form-input" id="new-item-price" required min="1" placeholder="350">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Daily Available Stock</label>
                        <input type="number" class="form-input" id="new-item-qty" required min="1" value="40" placeholder="Qty">
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
                <button type="submit" class="btn btn-primary btn-block">Add to Kitchen Menu</button>
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
            showToast('New dish added to menu', 'success');
            Modal.close();
        } catch (err) {
            showToast(err.message, 'error');
        }
    }
};
