const API = {
    BASE: '/api',

    async request(method, path, body = null) {
        const opts = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) opts.body = JSON.stringify(body);

        try {
            const res = await fetch(this.BASE + path, opts);
            const data = await res.json();
            if (!res.ok && data.error) {
                throw new Error(data.error);
            }
            return data;
        } catch (err) {
            if (err.message.includes('Failed to fetch')) {
                throw new Error('Server is currently not reachable. Please ensure the backend service is running.');
            }
            throw err;
        }
    },

    get(path) { return this.request('GET', path); },
    post(path, body) { return this.request('POST', path, body); },
    put(path, body) { return this.request('PUT', path, body); },
    del(path) { return this.request('DELETE', path); },

    login(email, password) {
        return this.post('/auth/login', { email, password });
    },
    register(data) {
        return this.post('/auth/register', data);
    },

    getRestaurants(params = {}) {
        const q = new URLSearchParams(params).toString();
        return this.get('/restaurants' + (q ? '?' + q : ''));
    },
    getRestaurant(id) {
        return this.get('/restaurants/' + id);
    },
    createRestaurant(data) {
        return this.post('/restaurants', data);
    },
    updateRestaurant(id, data) {
        return this.put('/restaurants/' + id, data);
    },
    toggleRestaurantStatus(id) {
        return this.put('/restaurants/' + id + '/status', {});
    },

    getMenu(restaurantId) {
        return this.get('/menu?restaurantId=' + restaurantId);
    },
    searchMenu(keyword) {
        return this.get('/menu?search=' + encodeURIComponent(keyword));
    },
    addMenuItem(data) {
        return this.post('/menu', data);
    },
    updateMenuItem(id, data) {
        return this.put('/menu/' + id, data);
    },
    toggleMenuAvailability(id) {
        return this.put('/menu/' + id + '/availability', {});
    },
    deleteMenuItem(id) {
        return this.del('/menu/' + id);
    },

    placeOrder(data) {
        return this.post('/orders', data);
    },
    getOrder(id) {
        return this.get('/orders/' + id);
    },
    getCustomerOrders(customerId) {
        return this.get('/orders?customerId=' + customerId);
    },
    getRestaurantOrders(restaurantId) {
        return this.get('/orders?restaurantId=' + restaurantId);
    },
    updateOrderStatus(id, status) {
        return this.put('/orders/' + id + '/status', { status });
    },

    processPayment(data) {
        return this.post('/payments', data);
    },
    getPayment(orderId) {
        return this.get('/payments/' + orderId);
    },

    getCoupons() {
        return this.get('/coupons');
    },
    validateCoupon(code, orderAmount) {
        return this.post('/coupons/validate', { code, orderAmount });
    }
};

const Cart = {
    KEY: 'elysian_cart',

    getItems() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },

    saveItems(items) {
        localStorage.setItem(this.KEY, JSON.stringify(items));
        this.notifyChange();
    },

    addItem(item) {
        const items = this.getItems();
        const existing = items.find(i => i.menuItemId === item.menuItemId);
        if (existing) {
            existing.quantity += (item.quantity || 1);
            existing.totalPrice = existing.quantity * existing.unitPrice;
        } else {
            items.push(item);
        }
        this.saveItems(items);
    },

    updateQuantity(itemId, quantity) {
        let items = this.getItems();
        if (quantity <= 0) {
            items = items.filter(i => i.menuItemId !== itemId);
        } else {
            const item = items.find(i => i.menuItemId === itemId);
            if (item) {
                item.quantity = quantity;
                item.totalPrice = item.quantity * item.unitPrice;
            }
        }
        this.saveItems(items);
    },

    removeItem(itemId) {
        const items = this.getItems().filter(i => i.menuItemId !== itemId);
        this.saveItems(items);
    },

    clear() {
        localStorage.removeItem(this.KEY);
        localStorage.removeItem('elysian_cart_restaurant');
        this.notifyChange();
    },

    getTotal() {
        return this.getItems().reduce((sum, item) => sum + item.totalPrice, 0);
    },

    getCount() {
        return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
    },

    getRestaurantId() {
        return localStorage.getItem('elysian_cart_restaurant');
    },

    setRestaurantId(id) {
        localStorage.setItem('elysian_cart_restaurant', id);
    },

    notifyChange() {
        window.dispatchEvent(new CustomEvent('cart-changed'));
    }
};

const Session = {
    KEY: 'elysian_user',

    getUser() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : null;
    },

    setUser(user) {
        localStorage.setItem(this.KEY, JSON.stringify(user));
    },

    clear() {
        localStorage.removeItem(this.KEY);
    },

    isLoggedIn() {
        return !!this.getUser();
    },

    isOwner() {
        const user = this.getUser();
        return user && user.role === 'RESTAURANT_OWNER';
    },

    isCustomer() {
        const user = this.getUser();
        return user && user.role === 'CUSTOMER';
    }
};

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else if (type === 'warning') {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else {
        iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c84b31" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `<span style="display:flex;align-items:center">${iconSvg}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.25s ease forwards';
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

// Curated high-resolution photography for real culinary feel
const CUISINE_PHOTOS = {
    'Bengali': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80',
    'Italian': 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=700&q=80',
    'Chinese': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=700&q=80',
    'American': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
    'Japanese': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=80',
    'Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80',
    'Thai': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=700&q=80',
    'Mexican': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=700&q=80',
    'Mediterranean': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
    'default': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80'
};

const FOOD_PHOTOS = {
    'Main Course': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    'Appetizer': 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80',
    'Dessert': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
    'Beverages': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=400&q=80',
    'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=400&q=80',
    'Burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    'Sides': 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80',
    'Sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
    'Rice': 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=400&q=80',
    'Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
    'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
};

function getCuisinePhoto(cuisine) {
    return CUISINE_PHOTOS[cuisine] || CUISINE_PHOTOS['default'];
}

function getFoodPhoto(category, itemName = '') {
    const lower = (itemName + ' ' + category).toLowerCase();
    if (lower.includes('biryani') || lower.includes('biriyani') || lower.includes('rice') || lower.includes('kacchi')) {
        return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('kebab') || lower.includes('grill') || lower.includes('meat') || lower.includes('curry')) {
        return 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('pizza')) {
        return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('burger')) {
        return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('roll') || lower.includes('sushi') || lower.includes('dim sum')) {
        return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('noodle') || lower.includes('chow mein') || lower.includes('pasta')) {
        return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('lassi') || lower.includes('shake') || lower.includes('tea') || lower.includes('juice') || category === 'Beverages') {
        return 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('firni') || lower.includes('pudding') || lower.includes('cake') || category === 'Dessert') {
        return 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80';
    }
    return FOOD_PHOTOS[category] || FOOD_PHOTOS['default'];
}
