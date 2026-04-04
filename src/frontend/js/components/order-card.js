function renderOrderCard(order) {
    const statusColors = {
        'PLACED': 'badge-info', 'CONFIRMED': 'badge-info', 'PREPARING': 'badge-warning',
        'READY': 'badge-primary', 'PICKED_UP': 'badge-primary', 'DELIVERED': 'badge-success', 'CANCELLED': 'badge-danger'
    };
    const statusEmojis = {
        'PLACED': '📋', 'CONFIRMED': '✅', 'PREPARING': '👨‍🍳', 'READY': '📦',
        'PICKED_UP': '🏍️', 'DELIVERED': '🎉', 'CANCELLED': '❌'
    };

    return `
        <div class="card" style="cursor:pointer" onclick="App.navigate('tracking/${order.id}')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
                <div>
                    <div style="font-weight:600;font-size:0.9rem">Order #${order.id}</div>
                    <div style="color:var(--text-secondary);font-size:0.8rem">${order.restaurantName || 'Restaurant'}</div>
                </div>
                <span class="badge ${statusColors[order.status] || 'badge-info'}">
                    ${statusEmojis[order.status] || ''} ${order.status}
                </span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="color:var(--text-secondary);font-size:0.85rem">${order.items ? order.items.length : 0} items</span>
                <span style="font-family:var(--font-heading);font-weight:700;color:var(--primary)">৳${order.total ? order.total.toFixed(0) : '0'}</span>
            </div>
            ${order.createdAt ? `<div style="color:var(--text-muted);font-size:0.75rem;margin-top:8px">${new Date(order.createdAt).toLocaleString()}</div>` : ''}
        </div>
    `;
}
