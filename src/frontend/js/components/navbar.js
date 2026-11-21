const Navbar = {
    render() {
        const nav = document.getElementById('navbar');
        const user = Session.getUser();
        const cartCount = Cart.getCount();

        nav.innerHTML = `
            <div class="navbar-inner">
                <div class="navbar-brand" onclick="App.navigate('${user ? (Session.isOwner() ? 'owner-dashboard' : 'dashboard') : 'home'}')">
                    <span class="brand-mark">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                    </span>
                    <span class="brand-text">Elysian Delicacies</span>
                </div>
                ${user ? this.getLoggedInNav(user, cartCount) : this.getGuestNav()}
            </div>
        `;
    },

    getGuestNav() {
        return `
            <div class="navbar-links">
                <span class="navbar-link ${App.currentPage === 'home' ? 'active' : ''}" onclick="App.navigate('home')">Home</span>
                <span class="navbar-link ${App.currentPage === 'restaurants' ? 'active' : ''}" onclick="App.navigate('restaurants')">Kitchens</span>
                <span class="navbar-link nav-cta-link" onclick="App.navigate('home')">Sign In / Register</span>
            </div>
        `;
    },

    getLoggedInNav(user, cartCount) {
        if (Session.isOwner()) {
            return `
                <div class="navbar-links">
                    <span class="navbar-link ${App.currentPage === 'owner-dashboard' ? 'active' : ''}" onclick="App.navigate('owner-dashboard')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        Dashboard
                    </span>
                    <span class="navbar-link ${App.currentPage === 'register-restaurant' ? 'active' : ''}" onclick="App.navigate('register-restaurant')">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Kitchen
                    </span>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                    <div class="navbar-user" onclick="Session.clear(); App.navigate('home'); showToast('Signed out successfully', 'info');" title="Click to Sign Out">
                        <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                        <span class="user-name">${user.name}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    </div>
                </div>
            `;
        }
        return `
            <div class="navbar-links">
                <span class="navbar-link ${App.currentPage === 'dashboard' ? 'active' : ''}" onclick="App.navigate('dashboard')">Home</span>
                <span class="navbar-link ${App.currentPage === 'restaurants' ? 'active' : ''}" onclick="App.navigate('restaurants')">Kitchens</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px">
                <div class="cart-badge" onclick="App.navigate('cart')" id="cart-nav-badge">
                    <span class="cart-icon">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    </span>
                    <span>Cart</span>
                    ${cartCount > 0 ? `<span class="count">${cartCount}</span>` : ''}
                </div>
                <div class="navbar-user" onclick="Session.clear(); Cart.clear(); App.navigate('home'); showToast('Signed out successfully', 'info');" title="Click to Sign Out">
                    <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                    <span class="user-name">${user.name}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
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
