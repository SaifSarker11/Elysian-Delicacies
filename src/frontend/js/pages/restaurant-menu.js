const RestaurantMenuPage = {
    restaurant: null,
    menuItems: [],

    async render(restaurantId) {
        const main = document.getElementById('main-content');
        main.innerHTML = '<div class="loading-spinner" style="padding-top:140px"><div class="spinner"></div></div>';

        try {
            const [restData, menuData] = await Promise.all([
                API.getRestaurant(restaurantId),
                API.getMenu(restaurantId)
            ]);

            this.restaurant = restData.restaurant;
            this.menuItems = menuData.menuItems || [];
            const r = this.restaurant;
            const photoUrl = r.imageUrl && !r.imageUrl.startsWith('/api/images') 
                ? r.imageUrl 
                : getCuisinePhoto(r.cuisineType);
            const isOpen = r.open || r.isOpen;
            const categories = [...new Set(this.menuItems.map(m => m.category))];

            main.innerHTML = `
                <div class="container section">
                    <button class="btn btn-outline btn-sm" onclick="history.back()" style="margin-bottom:20px">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Back
                    </button>
                    
                    <div class="card" style="padding:0;overflow:hidden;margin-bottom:32px">
                        <div style="height:240px;position:relative;overflow:hidden;background:var(--bg-surface-soft)">
                            <img src="${photoUrl}" alt="${r.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80'">
                            <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)"></div>
                            <div style="position:absolute;bottom:20px;left:24px;right:24px;color:#ffffff">
                                <span class="badge" style="background:rgba(255,255,255,0.92);color:var(--ink-primary);font-weight:700;margin-bottom:8px">${r.cuisineType}</span>
                                <h1 style="font-family:var(--font-serif);font-size:2.2rem;font-weight:600;color:#ffffff;line-height:1.2">${r.name}</h1>
                            </div>
                        </div>
                        <div style="padding:24px">
                            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px">
                                <p style="color:var(--ink-secondary);font-size:0.95rem;max-width:700px;line-height:1.6">${r.description || 'Specializing in quality culinary traditions, fresh produce, and crafted dishes.'}</p>
                                <div style="display:flex;gap:12px;align-items:center">
                                    <div class="rating" style="font-size:0.92rem;padding:5px 10px"><span class="star">★</span> ${r.rating.toFixed(1)}</div>
                                    <span class="badge ${isOpen ? 'badge-success' : 'badge-danger'}">
                                        <span class="status-dot ${isOpen ? 'open' : 'closed'}"></span>
                                        ${isOpen ? 'Open Now' : 'Closed'}
                                    </span>
                                </div>
                            </div>
                            <div style="display:flex;gap:24px;margin-top:18px;padding-top:16px;border-top:1px solid var(--border-hairline);flex-wrap:wrap;color:var(--ink-secondary);font-size:0.86rem">
                                <span><strong>Service Hours:</strong> ${r.openingTime} – ${r.closingTime}</span>
                                <span><strong>Delivery:</strong> ৳${r.deliveryFee} · ~${r.estimatedDeliveryMinutes} mins</span>
                                <span><strong>Location:</strong> ${r.address ? r.address.street + ', ' + r.address.area + ', ' + r.address.city : 'Dhaka'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="category-pills" style="margin-bottom:24px">
                        <span class="category-pill active" onclick="RestaurantMenuPage.filterCategory(this, '')">Full Menu</span>
                        ${categories.map(c => `<span class="category-pill" onclick="RestaurantMenuPage.filterCategory(this, '${c}')">${c}</span>`).join('')}
                    </div>

                    <div class="two-col-layout">
                        <div>
                            <h3 style="font-family:var(--font-serif);font-size:1.35rem;font-weight:600;margin-bottom:16px">Menu Selection</h3>
                            <div id="menu-items-list">
                                ${this.renderMenuItems(this.menuItems)}
                            </div>
                        </div>
                        <div>
                            <div class="order-summary" style="position:sticky;top:94px">
                                <h3>Your Current Order</h3>
                                <div id="mini-cart">${this.renderMiniCart()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            main.innerHTML = `<div class="container section"><div class="empty-state"><p class="empty-text">${err.message}</p><button class="btn btn-primary" onclick="history.back()">Go Back</button></div></div>`;
        }
    },

    renderMenuItems(items) {
        if (!items || items.length === 0) {
            return '<div class="empty-state"><p class="empty-text">No items found in this section.</p></div>';
        }
        return items.map(item => renderMenuItemCard(item, Session.isLoggedIn())).join('');
    },

    filterCategory(el, category) {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');

        const filtered = category ? this.menuItems.filter(m => m.category === category) : this.menuItems;
        document.getElementById('menu-items-list').innerHTML = this.renderMenuItems(filtered);
    },

    renderMiniCart() {
        const items = Cart.getItems();
        const restaurantId = Cart.getRestaurantId();

        if (items.length === 0 || (this.restaurant && restaurantId !== this.restaurant.id)) {
            return '<p style="color:var(--ink-muted);text-align:center;padding:24px 0;font-size:0.88rem">Select items from the menu to start your order.</p>';
        }

        const total = Cart.getTotal();
        return `
            ${items.map(item => `
                <div class="summary-row">
                    <span>${item.menuItemName} × ${item.quantity}</span>
                    <span style="font-weight:600">৳${item.totalPrice.toFixed(0)}</span>
                </div>
            `).join('')}
            <div class="summary-row total">
                <span>Estimated Subtotal</span>
                <span>৳${total.toFixed(0)}</span>
            </div>
            <button class="btn btn-primary btn-block btn-lg" style="margin-top:18px" onclick="App.navigate('cart')">
                View Order & Checkout
            </button>
        `;
    }
};
