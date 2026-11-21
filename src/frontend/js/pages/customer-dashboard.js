const CustomerDashboard = {
    async render() {
        const main = document.getElementById('main-content');
        const user = Session.getUser();
        const firstName = user ? user.name.split(' ')[0] : 'Guest';

        main.innerHTML = `
            <div class="container section">
                <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px;flex-wrap:wrap;gap:16px">
                    <div>
                        <div class="section-eyebrow">Personalized Dining</div>
                        <h1 class="section-heading-editorial">Welcome back, ${firstName}</h1>
                        <p class="section-desc-editorial" style="margin-bottom:0">Explore seasonal menus from top neighborhood kitchens near ${user?.address?.area || 'Dhaka'}.</p>
                    </div>
                    <div style="display:flex;gap:10px">
                        <button class="btn btn-secondary btn-sm" onclick="App.navigate('restaurants')">View All Kitchens</button>
                    </div>
                </div>
                
                <div class="search-bar" style="margin-bottom:28px">
                    <span class="search-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span>
                    <input type="text" placeholder="Search by restaurant name, dish (e.g. Biryani, Pizza), or cuisine..." id="dashboard-search" 
                           oninput="CustomerDashboard.handleSearch(this.value)">
                </div>
                
                <div id="search-results" style="display:none;margin-bottom:32px"></div>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
                    <h3 style="font-family:var(--font-serif);font-size:1.4rem;font-weight:600">Explore by Culinary Style</h3>
                </div>
                <div class="category-pills" style="margin-bottom:24px" id="cuisine-filter">
                    <span class="category-pill active" onclick="CustomerDashboard.filterCuisine(this, '')">All Kitchens</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'Bengali')">Bengali Heritage</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'Italian')">Italian & Wood-Fired</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'Chinese')">Cantonese & Dim Sum</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'American')">Craft Burgers & Grill</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'Japanese')">Japanese & Sushi</span>
                </div>
                
                <div id="restaurant-grid" class="grid-3">
                    <div class="loading-spinner"><div class="spinner"></div></div>
                </div>
                
                <div style="margin-top:56px;padding-top:40px;border-top:1px solid var(--border-subtle)">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
                        <div>
                            <h3 style="font-family:var(--font-serif);font-size:1.4rem;font-weight:600">Your Recent Orders</h3>
                            <p style="color:var(--ink-secondary);font-size:0.88rem;margin-top:2px">Track live deliveries or re-order your favorites.</p>
                        </div>
                    </div>
                    <div id="recent-orders" class="grid-3">
                        <div class="loading-spinner"><div class="spinner"></div></div>
                    </div>
                </div>
            </div>
        `;

        this.loadRestaurants();
        this.loadOrders();
    },

    async loadRestaurants(cuisine = '') {
        try {
            const params = {};
            if (cuisine) params.cuisine = cuisine;
            const data = await API.getRestaurants(params);
            const grid = document.getElementById('restaurant-grid');
            if (!grid) return;

            if (!data.restaurants || data.restaurants.length === 0) {
                grid.innerHTML = '<div class="empty-state"><div class="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div><p class="empty-text">No kitchens found in this category.</p></div>';
                return;
            }

            grid.innerHTML = data.restaurants.map(r => renderRestaurantCard(r)).join('');
        } catch (err) {
            showToast(err.message, 'error');
        }
    },

    async loadOrders() {
        try {
            const user = Session.getUser();
            if (!user) return;
            const data = await API.getCustomerOrders(user.id);
            const container = document.getElementById('recent-orders');
            if (!container) return;

            if (!data.orders || data.orders.length === 0) {
                container.innerHTML = '<div class="empty-state" style="padding:24px"><p class="empty-text" style="color:var(--ink-muted)">No orders placed yet. Choose a kitchen above to begin.</p></div>';
                return;
            }

            container.innerHTML = data.orders.slice(0, 6).map(o => renderOrderCard(o)).join('');
        } catch (err) {
            const container = document.getElementById('recent-orders');
            if (container) {
                container.innerHTML = '<div class="empty-state"><p class="empty-text">No active orders</p></div>';
            }
        }
    },

    filterCuisine(el, cuisine) {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        const grid = document.getElementById('restaurant-grid');
        if (grid) {
            grid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
        }
        this.loadRestaurants(cuisine);
    },

    searchTimeout: null,
    async handleSearch(query) {
        clearTimeout(this.searchTimeout);
        const resultsDiv = document.getElementById('search-results');

        if (!query.trim()) {
            resultsDiv.style.display = 'none';
            return;
        }

        this.searchTimeout = setTimeout(async () => {
            try {
                const [restData, menuData] = await Promise.all([
                    API.getRestaurants({ search: query }),
                    API.searchMenu(query)
                ]);

                let html = '<div class="card" style="padding:20px">';
                html += '<h4 style="font-family:var(--font-serif);font-size:1.1rem;margin-bottom:12px">Search Matches</h4>';

                if (restData.restaurants.length === 0 && (!menuData.menuItems || menuData.menuItems.length === 0)) {
                    html += '<p style="color:var(--ink-muted);font-size:0.9rem">No kitchens or dishes match your search.</p>';
                } else {
                    if (restData.restaurants.length > 0) {
                        html += '<div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.04em;font-weight:700;color:var(--ink-muted);margin:8px 0 6px">Kitchens</div>';
                        restData.restaurants.forEach(r => {
                            html += `<div style="padding:8px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;border-bottom:1px solid var(--border-hairline)" onclick="App.navigate('restaurant/${r.id}')">
                                <div><strong>${r.name}</strong> <span style="color:var(--ink-muted);font-size:0.85rem">(${r.cuisineType})</span></div>
                                <span class="rating"><span class="star">★</span> ${r.rating.toFixed(1)}</span>
                            </div>`;
                        });
                    }

                    if (menuData.menuItems && menuData.menuItems.length > 0) {
                        html += '<div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.04em;font-weight:700;color:var(--ink-muted);margin:14px 0 6px">Dishes</div>';
                        menuData.menuItems.slice(0, 5).forEach(m => {
                            html += `<div style="padding:8px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;border-bottom:1px solid var(--border-hairline)" onclick="App.navigate('restaurant/${m.restaurantId}')">
                                <div><strong>${m.name}</strong> <span style="color:var(--ink-muted);font-size:0.85rem">— ${m.description.substring(0, 45)}...</span></div>
                                <span style="font-weight:700;color:var(--ink-primary)">৳${m.price.toFixed(0)}</span>
                            </div>`;
                        });
                    }
                }

                html += '</div>';
                resultsDiv.innerHTML = html;
                resultsDiv.style.display = 'block';
            } catch (err) {
                console.error(err);
            }
        }, 300);
    }
};
