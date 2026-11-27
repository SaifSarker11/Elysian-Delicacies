function renderMenuItemCard(item, showAddButton = true) {
    const photoUrl = item.imageUrl && !item.imageUrl.startsWith('/api/images') 
        ? item.imageUrl 
        : getFoodPhoto(item.category, item.name);

    const addOnsHtml = item.addOns && item.addOns.length > 0
        ? `<div class="add-ons-list">${item.addOns.map(a => `<span class="add-on-tag">+${a.name} · ৳${a.price}</span>`).join('')}</div>`
        : '';

    return `
        <div class="menu-item-card ${!item.available ? 'unavailable' : ''}">
            <div class="item-thumb">
                <img src="${photoUrl}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'">
            </div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-desc">${item.description || 'Prepared to order using locally sourced fresh ingredients.'}</div>
                ${addOnsHtml}
                <div class="item-bottom">
                    <span class="item-price">৳${item.price.toFixed(0)}</span>
                    <div style="display:flex;align-items:center;gap:8px">
                        ${!item.available ? '<span class="badge badge-danger">Sold out today</span>' : ''}
                        ${item.available && item.quantity <= 5 ? `<span class="badge badge-warning">Only ${item.quantity} portions left</span>` : ''}
                        ${showAddButton && item.available ? `
                            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart('${item.id}', '${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.restaurantId}')">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add to Order
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addToCart(itemId, itemName, price, restaurantId) {
    const currentRestaurant = Cart.getRestaurantId();
    if (currentRestaurant && currentRestaurant !== restaurantId && Cart.getCount() > 0) {
        if (!confirm('Your order currently contains items from another kitchen. Would you like to start a fresh order from this kitchen?')) {
            return;
        }
        Cart.clear();
    }

    Cart.setRestaurantId(restaurantId);
    Cart.addItem({
        menuItemId: itemId,
        menuItemName: itemName,
        unitPrice: price,
        quantity: 1,
        totalPrice: price,
        selectedAddOns: [],
        specialInstructions: ''
    });

    showToast(`${itemName} added to your order`, 'success');
}
