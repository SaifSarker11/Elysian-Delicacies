const RestaurantListPage = {
    async render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div class="container section">
                <div style="margin-bottom:28px">
                    <div class="section-eyebrow">Curated Directory</div>
                    <h1 class="section-heading-editorial">All Partner Kitchens</h1>
                    <p class="section-desc-editorial" style="margin-bottom:0">Discover independent restaurants, specialty bakeries, and regional culinary masters in Dhaka.</p>
                </div>
                
                <div style="display:flex;gap:14px;margin-bottom:28px;flex-wrap:wrap">
                    <div class="search-bar" style="flex:1;min-width:240px">
                        <span class="search-icon">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </span>
                        <input type="text" placeholder="Search by restaurant name, food, or area..." id="rest-search"
                               oninput="RestaurantListPage.search()">
                    </div>
                    <select class="form-select" style="width:auto;min-width:180px" id="rest-sort" onchange="RestaurantListPage.search()">
                        <option value="">Sort: Featured</option>
                        <option value="rating">Top Rated</option>
                        <option value="name">Alphabetical</option>
                        <option value="delivery_fee">Lowest Delivery Fee</option>
                        <option value="delivery_time">Fastest ETA</option>
                    </select>
                </div>
                
                <div id="all-restaurants" class="grid-3">
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
            if (!grid) return;
            
            if (!data.restaurants || data.restaurants.length === 0) {
                grid.innerHTML = '<div class="empty-state"><div class="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div><p class="empty-text">No kitchens found matching your filter criteria.</p></div>';
                return;
            }

            grid.innerHTML = data.restaurants.map(r => renderRestaurantCard(r)).join('');
        } catch (err) {
            showToast(err.message, 'error');
        }
    }
};
