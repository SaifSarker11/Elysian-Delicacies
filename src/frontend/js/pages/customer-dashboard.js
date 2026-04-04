const CustomerDashboard = {
    async render() {
        const main = document.getElementById('main-content');
        const user = Session.getUser();

        main.innerHTML = `
            <div class="container section fade-in">
                <div class="dashboard-header">
                    <h1>Hey ${user.name.split(' ')[0]} 👋</h1>
                    <p>What would you like to eat today?</p>
                </div>
                
                <div class="search-bar" style="margin-bottom:32px">
                    <span class="search-icon">🔍</span>
                    <input type="text" placeholder="Search restaurants or dishes..." id="dashboard-search" 
                           oninput="CustomerDashboard.handleSearch(this.value)">
                </div>
                
                <div id="search-results" style="display:none;margin-bottom:32px"></div>

                <h2 style="font-family:var(--font-heading);font-weight:700;margin-bottom:16px">🏪 Nearby Restaurants</h2>
                <div class="category-pills" style="margin-bottom:24px" id="cuisine-filter">
                    <span class="category-pill active" onclick="CustomerDashboard.filterCuisine(this, '')">All</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'Bengali')">🍛 Bengali</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'Italian')">🍕 Italian</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'Chinese')">🥡 Chinese</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'American')">🍔 American</span>
                    <span class="category-pill" onclick="CustomerDashboard.filterCuisine(this, 'Japanese')">🍣 Japanese</span>
                </div>
                
                <div id="restaurant-grid" class="grid-3 stagger">
                    <div class="loading-spinner"><div class="spinner"></div></div>
                </div>
                
                <div style="margin-top:48px">
                    <h2 style="font-family:var(--font-heading);font-weight:700;margin-bottom:16px">📋 Your Recent Orders</h2>
                    <div id="recent-orders" class="grid-3 stagger">
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

            if (data.restaurants.length === 0) {
                grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🍽️</div><p class="empty-text">No restaurants found</p></div>';
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
            const data = await API.getCustomerOrders(user.id);
            const container = document.getElementById('recent-orders');

            if (data.orders.length === 0) {
                container.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><p class="empty-text">No orders yet. Start ordering!</p></div>';
                return;
            }

            container.innerHTML = data.orders.slice(0, 6).map(o => renderOrderCard(o)).join('');
        } catch (err) {
            document.getElementById('recent-orders').innerHTML = '<div class="empty-state"><p class="empty-text">No orders yet</p></div>';
        }
    },

    filterCuisine(el, cuisine) {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('restaurant-grid').innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
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
                const data = await API.searchMenu(query);
                resultsDiv.style.display = 'block';

                if (data.menuItems.length === 0) {
                    resultsDiv.innerHTML = '<p style="color:var(--text-secondary)">No dishes found for "' + query + '"</p>';
                    return;
                }

                resultsDiv.innerHTML = `
                    <h3 style="font-family:var(--font-heading);margin-bottom:12px">🔍 Search Results</h3>
                    <div class="grid-2">${data.menuItems.slice(0, 6).map(item => renderMenuItemCard(item)).join('')}</div>
                `;
            } catch (err) {
                resultsDiv.innerHTML = '';
            }
        }, 300);
    }
};
