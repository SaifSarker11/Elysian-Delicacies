function renderRestaurantCard(restaurant) {
    const photoUrl = restaurant.imageUrl && !restaurant.imageUrl.startsWith('/api/images') 
        ? restaurant.imageUrl 
        : getCuisinePhoto(restaurant.cuisineType);
    const isOpen = restaurant.open || restaurant.isOpen;

    return `
        <div class="restaurant-card" onclick="App.navigate('restaurant/${restaurant.id}')">
            <div class="card-media-wrapper">
                <img class="card-hero-image" src="${photoUrl}" alt="${restaurant.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80'">
                <div class="card-media-badge">${restaurant.cuisineType}</div>
                <div class="card-media-status">
                    <span class="badge ${isOpen ? 'badge-success' : 'badge-danger'}">
                        <span class="status-dot ${isOpen ? 'open' : 'closed'}"></span>
                        ${isOpen ? 'Open Now' : 'Closed'}
                    </span>
                </div>
            </div>
            <div class="card-body">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px">
                    <h3 class="card-title">${restaurant.name}</h3>
                    <div class="rating">
                        <span class="star">★</span> ${restaurant.rating ? restaurant.rating.toFixed(1) : '4.5'}
                    </div>
                </div>
                <p class="card-subtitle">${restaurant.description || 'Artisan cuisine, curated seasonal ingredients, freshly prepared.'}</p>
                <div class="card-meta">
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${restaurant.estimatedDeliveryMinutes || 30} mins
                    </span>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        ৳${restaurant.deliveryFee || 40} fee
                    </span>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${restaurant.address ? restaurant.address.area : 'Dhaka'}
                    </span>
                </div>
            </div>
        </div>
    `;
}
