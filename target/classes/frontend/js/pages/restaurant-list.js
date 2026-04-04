const RestaurantListPage = {
    async render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div class="container section fade-in">
                <div class="dashboard-header">
                    <h1>🏪 All Restaurants</h1>
                    <p>Browse and discover amazing food near you</p>
                </div>
                
                <div style="display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap">
                    <div class="search-bar" style="flex:1;min-width:200px">
                        <span class="search-icon">🔍</span>
                        <input type="text" placeholder="Search restaurants..." id="rest-search"
                               oninput="RestaurantListPage.search()">
                    </div>
                    <select class="form-select" style="width:auto;min-width:160px" id="rest-sort" onchange="RestaurantListPage.search()">
                        <option value="">Sort by</option>
                        <option value="rating">⭐ Rating</option>
                        <option value="name">🔤 Name</option>
                        <option value="delivery_fee">💰 Delivery Fee</option>
                        <option value="delivery_time">🕐 Delivery Time</option>
                    </select>
                </div>
                
                <div id="all-restaurants" class="grid-3 stagger">
                    <div class="loading-spinner"><div class="spinner"></div></div>
                </div>
            </div>
        `;
        this.search();
    },

    async search() {
        try {
            const searchVal = document.getElementById('rest-search')?.value || '';
            const sortVal = document.getElementById('rest-sort')?.value || '';
            const params = {};
            if (searchVal) params.search = searchVal;
            if (sortVal) params.sortBy = sortVal;

            const data = await API.getRestaurants(params);
            const grid = document.getElementById('all-restaurants');
            
            if (data.restaurants.length === 0) {
                grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🍽️</div><p class="empty-text">No restaurants found</p></div>';
                return;
            }

            grid.innerHTML = data.restaurants.map(r => renderRestaurantCard(r)).join('');
        } catch (err) {
            showToast(err.message, 'error');
        }
    }
};
