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
                throw new Error('Server is not reachable. Please make sure the backend is running.');
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
    },

    getAvailableRiders(area) {
        return this.get('/delivery/riders' + (area ? '?area=' + encodeURIComponent(area) : ''));
    },
    getDeliveryEstimate(restaurantId, lat, lon) {
        return this.get(`/delivery/estimate?restaurantId=${restaurantId}&lat=${lat}&lon=${lon}`);
    }
};

const Cart = {
    KEY: 'elysian_cart',

    getItems() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },

    addItem(item) {
        const items = this.getItems();
        const existing = items.find(i => i.menuItemId === item.menuItemId);
        if (existing) {
            existing.quantity += item.quantity;
            existing.totalPrice = existing.unitPrice * existing.quantity;
        } else {
            items.push(item);
        }
        localStorage.setItem(this.KEY, JSON.stringify(items));
        this.notifyChange();
    },

    updateQuantity(menuItemId, quantity) {
        let items = this.getItems();
        if (quantity <= 0) {
            items = items.filter(i => i.menuItemId !== menuItemId);
        } else {
            const item = items.find(i => i.menuItemId === menuItemId);
            if (item) {
                item.quantity = quantity;
                item.totalPrice = item.unitPrice * quantity;
            }
        }
        localStorage.setItem(this.KEY, JSON.stringify(items));
        this.notifyChange();
    },

    removeItem(menuItemId) {
        const items = this.getItems().filter(i => i.menuItemId !== menuItemId);
        localStorage.setItem(this.KEY, JSON.stringify(items));
        this.notifyChange();
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
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const CUISINE_EMOJIS = {
    'Bengali': '🍛', 'Italian': '🍕', 'Chinese': '🥡', 'Japanese': '🍣',
    'American': '🍔', 'Indian': '🍛', 'Thai': '🍜', 'Mexican': '🌮',
    'Korean': '🥘', 'Mediterranean': '🥗', 'default': '🍽️'
};

function getCuisineEmoji(cuisine) {
    return CUISINE_EMOJIS[cuisine] || CUISINE_EMOJIS['default'];
}

const FOOD_EMOJIS = {
    'Main Course': '🍖', 'Appetizer': '🥗', 'Dessert': '🍰', 'Beverages': '🥤',
    'Pizza': '🍕', 'Pasta': '🍝', 'Burgers': '🍔', 'Sides': '🍟',
    'Sushi': '🍣', 'Sashimi': '🐟', 'Noodles': '🍜', 'Rice': '🍚',
    'default': '🍽️'
};

function getFoodEmoji(category) {
    return FOOD_EMOJIS[category] || FOOD_EMOJIS['default'];
}
