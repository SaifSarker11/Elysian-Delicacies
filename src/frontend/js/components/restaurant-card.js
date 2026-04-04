function renderRestaurantCard(restaurant) {
    const emoji = getCuisineEmoji(restaurant.cuisineType);
    return `
        <div class="card restaurant-card" onclick="App.navigate('restaurant/${restaurant.id}')">
            <div class="card-image">
                <div class="card-image-placeholder">${emoji}</div>
            </div>
            <div class="card-body">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                    <h3 class="card-title">${restaurant.name}</h3>
                    <div class="rating">
                        <span class="star">★</span> ${restaurant.rating.toFixed(1)}
                    </div>
                </div>
                <p class="card-subtitle">${restaurant.cuisineType} • ${restaurant.description.substring(0, 60)}...</p>
                <div class="card-meta">
                    <span><span class="status-dot ${restaurant.open || restaurant.isOpen ? 'open' : 'closed'}"></span> ${restaurant.open || restaurant.isOpen ? 'Open' : 'Closed'}</span>
                    <span>🕐 ${restaurant.estimatedDeliveryMinutes} min</span>
                    <span>💰 ৳${restaurant.deliveryFee}</span>
                </div>
            </div>
        </div>
    `;
}
