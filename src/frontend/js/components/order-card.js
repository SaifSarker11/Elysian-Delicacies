function renderOrderCard(order) {
    const statusBadges = {
        'PLACED': 'badge-neutral',
        'CONFIRMED': 'badge-info',
        'PREPARING': 'badge-warning',
        'READY': 'badge-primary',
        'PICKED_UP': 'badge-info',
        'DELIVERED': 'badge-success',
        'CANCELLED': 'badge-danger'
    };

    const statusLabels = {
        'PLACED': 'Order Received',
        'CONFIRMED': 'Kitchen Confirmed',
        'PREPARING': 'Preparing Food',
        'READY': 'Ready for Pickup',
        'PICKED_UP': 'Out for Delivery',
        'DELIVERED': 'Delivered',
        'CANCELLED': 'Cancelled'
    };

    return `
        <div class="card" style="cursor:pointer;padding:16px 20px" onclick="App.navigate('tracking/${order.id}')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
                <div>
                    <div style="font-weight:700;font-size:0.95rem;color:var(--ink-primary)">Order #${order.id}</div>
                    <div style="color:var(--ink-secondary);font-size:0.84rem;margin-top:2px">${order.restaurantName || 'Kitchen partner'}</div>
                </div>
                <span class="badge ${statusBadges[order.status] || 'badge-neutral'}">
                    ${statusLabels[order.status] || order.status}
                </span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid var(--border-hairline)">
                <span style="color:var(--ink-muted);font-size:0.84rem">${order.items ? order.items.length : 0} item${order.items && order.items.length === 1 ? '' : 's'}</span>
                <span style="font-weight:700;color:var(--ink-primary)">৳${order.total ? order.total.toFixed(0) : '0'}</span>
            </div>
            ${order.createdAt ? `<div style="color:var(--ink-muted);font-size:0.75rem;margin-top:6px">${new Date(order.createdAt).toLocaleDateString([], {month:'short', day:'numeric'})} at ${new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>` : ''}
        </div>
    `;
}
