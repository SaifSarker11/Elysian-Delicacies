function renderMenuItemCard(item, showAddButton = true) {
    const emoji = getFoodEmoji(item.category);
    const addOnsHtml = item.addOns && item.addOns.length > 0
        ? `<div class="add-ons-list">${item.addOns.map(a => `<span class="add-on-tag">+${a.name} ৳${a.price}</span>`).join('')}</div>`
        : '';

    return `
        <div class="card menu-item-card ${!item.available ? 'unavailable' : ''}">
            <div class="item-image">
                <div class="item-image-placeholder">${emoji}</div>
            </div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-desc">${item.description}</div>
                ${addOnsHtml}
                <div class="item-bottom">
                    <span class="item-price">৳${item.price.toFixed(0)}</span>
                    <div style="display:flex;align-items:center;gap:8px">
                        ${!item.available ? '<span class="badge badge-danger">Out of stock</span>' : ''}
                        ${item.available && item.quantity <= 5 ? `<span class="badge badge-warning">Only ${item.quantity} left</span>` : ''}
                        ${showAddButton && item.available ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart('${item.id}', '${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.restaurantId}')">+ Add</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addToCart(itemId, itemName, price, restaurantId) {
    const currentRestaurant = Cart.getRestaurantId();
    if (currentRestaurant && currentRestaurant !== restaurantId && Cart.getCount() > 0) {
        if (!confirm('Your cart has items from another restaurant. Clear cart and add this item?')) {
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

    showToast(`${itemName} added to cart!`, 'success');
}
