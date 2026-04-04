const Navbar = {
    render() {
        const nav = document.getElementById('navbar');
        const user = Session.getUser();
        const cartCount = Cart.getCount();

        nav.innerHTML = `
            <div class="navbar-inner">
                <div class="navbar-brand" onclick="App.navigate('${user ? (Session.isOwner() ? 'owner-dashboard' : 'dashboard') : 'home'}')">
                    <span class="brand-icon">🚀</span>
                    <span class="brand-text">Elysian Delicacies</span>
                </div>
                ${user ? this.getLoggedInNav(user, cartCount) : this.getGuestNav()}
            </div>
        `;
    },

    getGuestNav() {
        return `
            <div class="navbar-links">
                <span class="navbar-link" onclick="App.navigate('home')">Home</span>
                <span class="navbar-link" onclick="App.navigate('restaurants')">Restaurants</span>
            </div>
        `;
    },

    getLoggedInNav(user, cartCount) {
        if (Session.isOwner()) {
            return `
                <div class="navbar-links">
                    <span class="navbar-link ${App.currentPage === 'owner-dashboard' ? 'active' : ''}" onclick="App.navigate('owner-dashboard')">Dashboard</span>
                    <span class="navbar-link ${App.currentPage === 'register-restaurant' ? 'active' : ''}" onclick="App.navigate('register-restaurant')">Add Restaurant</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                    <div class="navbar-user" onclick="Session.clear(); App.navigate('home'); showToast('Logged out', 'info');">
                        <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                        <span class="user-name">${user.name}</span>
                        <span style="color:var(--text-muted);font-size:0.8rem">↪</span>
                    </div>
                </div>
            `;
        }
        return `
            <div class="navbar-links">
                <span class="navbar-link ${App.currentPage === 'dashboard' ? 'active' : ''}" onclick="App.navigate('dashboard')">Home</span>
                <span class="navbar-link ${App.currentPage === 'restaurants' ? 'active' : ''}" onclick="App.navigate('restaurants')">Restaurants</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px">
                <div class="cart-badge" onclick="App.navigate('cart')" id="cart-nav-badge">
                    🛒
                    ${cartCount > 0 ? `<span class="count">${cartCount}</span>` : ''}
                </div>
                <div class="navbar-user" onclick="Session.clear(); Cart.clear(); App.navigate('home'); showToast('Logged out', 'info');">
                    <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                    <span class="user-name">${user.name}</span>
                    <span style="color:var(--text-muted);font-size:0.8rem">↪</span>
                </div>
            </div>
        `;
    },

    updateCartBadge() {
        const badge = document.getElementById('cart-nav-badge');
        if (!badge) return;
        const count = Cart.getCount();
        const countEl = badge.querySelector('.count');
        if (count > 0) {
            if (countEl) {
                countEl.textContent = count;
            } else {
                badge.insertAdjacentHTML('beforeend', `<span class="count">${count}</span>`);
            }
        } else if (countEl) {
            countEl.remove();
        }
    }
};
