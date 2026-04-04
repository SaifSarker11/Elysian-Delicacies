const RestaurantMenuPage = {
    restaurant: null,
    menuItems: [],

    async render(restaurantId) {
        const main = document.getElementById('main-content');
        main.innerHTML = '<div class="loading-spinner" style="padding-top:200px"><div class="spinner"></div></div>';

        try {
            const [restData, menuData] = await Promise.all([
                API.getRestaurant(restaurantId),
                API.getMenu(restaurantId)
            ]);

            this.restaurant = restData.restaurant;
            this.menuItems = menuData.menuItems || [];
            const r = this.restaurant;
            const emoji = getCuisineEmoji(r.cuisineType);

            const categories = [...new Set(this.menuItems.map(m => m.category))];

            main.innerHTML = `
                <div class="container section fade-in">
                    <button class="btn btn-secondary btn-sm" onclick="history.back()" style="margin-bottom:24px">← Back</button>
                    
                    <div class="card" style="padding:0;overflow:hidden;margin-bottom:32px">
                        <div style="height:200px;display:flex;align-items:center;justify-content:center;font-size:5rem;background:linear-gradient(135deg,#1a1040,#0f0f2e)">${emoji}</div>
                        <div style="padding:24px">
                            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
                                <div>
                                    <h1 style="font-family:var(--font-heading);font-size:1.8rem;font-weight:800">${r.name}</h1>
                                    <p style="color:var(--text-secondary);margin-top:4px">${r.description}</p>
                                </div>
                                <div style="display:flex;gap:12px;align-items:center">
                                    <div class="rating" style="font-size:1.1rem">★ ${r.rating.toFixed(1)}</div>
                                    <span class="badge ${r.open || r.isOpen ? 'badge-success' : 'badge-danger'}">
                                        ${r.open || r.isOpen ? '🟢 Open' : '🔴 Closed'}
                                    </span>
                                </div>
                            </div>
                            <div style="display:flex;gap:24px;margin-top:16px;flex-wrap:wrap;color:var(--text-secondary);font-size:0.9rem">
                                <span>🍽️ ${r.cuisineType}</span>
                                <span>🕐 ${r.openingTime} - ${r.closingTime}</span>
                                <span>🚚 ৳${r.deliveryFee} delivery • ${r.estimatedDeliveryMinutes} min</span>
                                <span>📍 ${r.address ? r.address.area + ', ' + r.address.city : 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="category-pills" style="margin-bottom:24px">
                        <span class="category-pill active" onclick="RestaurantMenuPage.filterCategory(this, '')">All</span>
                        ${categories.map(c => `<span class="category-pill" onclick="RestaurantMenuPage.filterCategory(this, '${c}')">${getFoodEmoji(c)} ${c}</span>`).join('')}
                    </div>

                    <div class="two-col-layout">
                        <div>
                            <h2 style="font-family:var(--font-heading);font-weight:700;margin-bottom:16px">📋 Menu</h2>
                            <div id="menu-items-list">
                                ${this.renderMenuItems(this.menuItems)}
                            </div>
                        </div>
                        <div>
                            <div class="order-summary" style="position:sticky;top:90px">
                                <h3>🛒 Your Cart</h3>
                                <div id="mini-cart">${this.renderMiniCart()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            main.innerHTML = `<div class="container section"><div class="empty-state"><div class="empty-icon">😥</div><p class="empty-text">${err.message}</p><button class="btn btn-primary" onclick="history.back()">Go Back</button></div></div>`;
        }
    },

    renderMenuItems(items) {
        if (items.length === 0) {
            return '<div class="empty-state"><p class="empty-text">No items in this category</p></div>';
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
            return '<p style="color:var(--text-muted);text-align:center;padding:24px 0">Your cart is empty</p>';
        }

        const total = Cart.getTotal();
        return `
            ${items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.menuItemName}</div>
                        <div class="cart-item-price">৳${item.unitPrice} × ${item.quantity}</div>
                    </div>
                    <span style="font-weight:600">৳${item.totalPrice.toFixed(0)}</span>
                </div>
            `).join('')}
            <div class="summary-row total">
                <span>Subtotal</span>
                <span>৳${total.toFixed(0)}</span>
            </div>
            <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="App.navigate('cart')">View Cart →</button>
        `;
    }
};

const _originalAddToCart = addToCart;
addToCart = function (itemId, itemName, price, restaurantId) {
    _originalAddToCart(itemId, itemName, price, restaurantId);
    const miniCart = document.getElementById('mini-cart');
    if (miniCart) {
        miniCart.innerHTML = RestaurantMenuPage.renderMiniCart();
    }
};
