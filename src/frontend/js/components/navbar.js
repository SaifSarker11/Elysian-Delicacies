const EMBLEM = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.7 6.6 4.4 10.3 12 12-7.6 1.7-11.3 5.4-12 12-.7-6.6-4.4-10.3-12-12 7.6-1.7 11.3-5.4 12-12z"/></svg>';
const ICON_SEARCH = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
const ICON_CART = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
const ICON_CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

const Navbar = {
    links() {
        if (!Session.isLoggedIn()) return [['home', 'Home'], ['restaurants', 'Kitchens'], ['register-restaurant', 'Become a Partner']];
        if (Session.isOwner()) return [['owner-dashboard', 'Dashboard'], ['register-restaurant', 'Add Kitchen']];
        return [['dashboard', 'Home'], ['restaurants', 'Kitchens']];
    },

    render() {
        const nav = document.getElementById('navbar');
        const user = Session.getUser();
        const count = Cart.getCount();
        const homeRoute = user ? (Session.isOwner() ? 'owner-dashboard' : 'dashboard') : 'home';
        const customer = user && !Session.isOwner();

        nav.innerHTML = `
            <div class="hdr-inner">
                <div class="hdr-brand" onclick="App.navigate('${homeRoute}')">
                    <span class="hdr-emblem">${EMBLEM}</span>
                    <span class="hdr-wordmark">Elysian Delicacies</span>
                </div>
                <div class="hdr-links">
                    ${this.links().map(([r, t]) => `<span class="hdr-link ${App.currentPage === r ? 'active' : ''}" onclick="App.navigate('${r}')">${t}</span>`).join('')}
                </div>
                <div class="hdr-actions">
                    <button class="hdr-btn" aria-label="Search kitchens" onclick="SearchOverlay.open()">${ICON_SEARCH}</button>
                    ${customer ? `<button class="hdr-btn cart-badge-new" id="cart-nav-badge" aria-label="Order" onclick="App.navigate('cart')">${ICON_CART}${count > 0 ? `<span class="count">${count}</span>` : ''}</button>` : ''}
                    ${user
                        ? `<button class="hdr-btn hide-sm" title="Sign out" onclick="Session.clear(); Cart.clear(); App.navigate('home'); showToast('Signed out successfully', 'info');"><span class="hdr-avatar">${user.name.charAt(0).toUpperCase()}</span><span class="hide-md">Sign out</span></button>`
                        : `<button class="hdr-btn hide-sm" onclick="AuthDrawer.open('login')">Sign in</button>`}
                    <button class="hdr-burger" aria-label="Open menu" onclick="MenuOverlay.open()"><i></i><i></i></button>
                </div>
            </div>`;
        Motion.onScroll();
    },

    updateCartBadge() {
        const badge = document.getElementById('cart-nav-badge');
        if (!badge) return;
        const count = Cart.getCount();
        let el = badge.querySelector('.count');
        if (count > 0) {
            if (!el) { badge.insertAdjacentHTML('beforeend', `<span class="count">${count}</span>`); el = badge.querySelector('.count'); }
            el.textContent = count;
        } else if (el) el.remove();
    }
};

const MenuOverlay = {
    open() {
        const el = document.getElementById('menu-overlay');
        const user = Session.getUser();
        const items = Navbar.links().map(([r, t]) => [`App.navigate('${r}')`, t]);
        if (Session.isLoggedIn() && !Session.isOwner()) items.push(["App.navigate('cart')", 'Your Order']);
        items.push(user ? ["Session.clear(); Cart.clear(); App.navigate('home'); showToast('Signed out successfully','info')", 'Sign out'] : ["MenuOverlay.close(); AuthDrawer.open('login')", 'Sign in']);
        el.innerHTML = `
            <div class="menu-top">
                <div class="hdr-brand"><span class="hdr-emblem">${EMBLEM}</span><span class="hdr-wordmark">Elysian Delicacies</span></div>
                <button class="menu-close" onclick="MenuOverlay.close()">Close ${ICON_CLOSE}</button>
            </div>
            <div class="menu-body">
                <nav class="menu-nav">${items.map(([fn, t], i) => `<span onclick="${fn}"><b style="--i:${i}">${t}</b></span>`).join('')}</nav>
                <aside class="menu-side">
                    <div><h5>Neighbourhoods</h5>${['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Mirpur'].map(a => `<a style="cursor:pointer;display:block" onclick="App.navigate('restaurants/${a}')">${a}</a>`).join('')}</div>
                    <div><h5>Customer care</h5>9:00 AM – 11:30 PM<br>support@elysiandelicacies.com</div>
                </aside>
            </div>`;
        Overlays.lock(true);
        requestAnimationFrame(() => el.classList.add('open'));
    },
    close() { document.getElementById('menu-overlay').classList.remove('open'); Overlays.lock(false); }
};

const SearchOverlay = {
    timer: null,
    open() {
        const el = document.getElementById('search-overlay');
        const cuisines = Object.keys(CUISINE_PHOTOS_LIST());
        el.innerHTML = `
            <div class="search-sheet" onclick="event.stopPropagation()">
                <div class="search-sheet-in">
                    <div class="search-row">
                        ${ICON_SEARCH}
                        <input id="so-input" type="text" placeholder="Search kitchens, cuisines, dishes" autocomplete="off" oninput="SearchOverlay.type(this.value)" onkeydown="if(event.key==='Enter')SearchOverlay.submit(this.value)">
                        <button aria-label="Close search" onclick="SearchOverlay.close()">${ICON_CLOSE}</button>
                    </div>
                    <div class="search-suggest" id="so-body">${this.suggestions(cuisines)}</div>
                </div>
            </div>`;
        el.onclick = () => this.close();
        Overlays.lock(true);
        requestAnimationFrame(() => { el.classList.add('open'); setTimeout(() => document.getElementById('so-input')?.focus(), 350); });
    },
    suggestions(cuisines) {
        return `<h6>Cuisines</h6>${cuisines.map(c => `<span class="chip" onclick="SearchOverlay.go('restaurants/all/${c}')">${c}</span>`).join('')}
                <h6>Neighbourhoods</h6>${['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Mirpur'].map(a => `<span class="chip" onclick="SearchOverlay.go('restaurants/${a}')">${a}</span>`).join('')}`;
    },
    go(route) { this.close(); App.navigate(route); },
    submit(q) { if (!q.trim()) return; RestaurantListPage.pendingSearch = q.trim(); this.close(); App.navigate('restaurants'); },
    type(q) {
        clearTimeout(this.timer);
        const body = document.getElementById('so-body');
        if (!q.trim()) { body.innerHTML = this.suggestions(Object.keys(CUISINE_PHOTOS_LIST())); return; }
        this.timer = setTimeout(async () => {
            try {
                const data = await API.getRestaurants({ search: q.trim() });
                const list = data.restaurants || [];
                body.innerHTML = list.length
                    ? list.map(r => `<div class="search-hit" onclick="SearchOverlay.go('restaurant/${r.id}')"><img src="${restaurantPhoto(r)}" alt=""><div><h4>${r.name}</h4><p>${r.cuisineType} · ${r.address ? r.address.area : 'Dhaka'}</p></div></div>`).join('')
                    : `<p style="color:var(--ink-muted);padding:18px 0">No kitchens match “${q.replace(/</g, '&lt;')}”.</p>`;
            } catch (e) { body.innerHTML = `<p style="padding:18px 0">${e.message}</p>`; }
        }, 220);
    },
    close() { document.getElementById('search-overlay').classList.remove('open'); Overlays.lock(false); }
};

function CUISINE_PHOTOS_LIST() {
    return { Bengali: 1, Italian: 1, Chinese: 1, American: 1, Japanese: 1, Indian: 1, Thai: 1, Mexican: 1, Mediterranean: 1 };
}

const AuthDrawer = {
    open(tab = 'login') {
        HomePage.activeTab = tab;
        const el = document.getElementById('auth-drawer');
        el.innerHTML = `
            <div class="drawer" onclick="event.stopPropagation()">
                <button class="drawer-close" aria-label="Close" onclick="AuthDrawer.close()">${ICON_CLOSE}</button>
                <div class="auth-header"><span class="eyebrow">Welcome</span><h3>Join the table</h3><p>Sign in to order, or manage your kitchen.</p></div>
                <div class="auth-tabs">
                    <div class="auth-tab ${tab === 'login' ? 'active' : ''}" onclick="HomePage.switchTab(event, 'login')">Sign in</div>
                    <div class="auth-tab ${tab === 'register' ? 'active' : ''}" onclick="HomePage.switchTab(event, 'register')">New account</div>
                </div>
                <div id="auth-form-content">${tab === 'login' ? HomePage.loginForm() : HomePage.registerForm()}</div>
            </div>`;
        el.onclick = () => this.close();
        Overlays.closeAll(true);
        Overlays.lock(true);
        requestAnimationFrame(() => el.classList.add('open'));
    },
    close() { document.getElementById('auth-drawer').classList.remove('open'); Overlays.lock(false); }
};

const Overlays = {
    init() {
        document.body.insertAdjacentHTML('beforeend', '<div id="menu-overlay" class="menu-overlay"></div><div id="search-overlay" class="search-overlay"></div><div id="auth-drawer" class="drawer-backdrop"></div>');
        document.addEventListener('keydown', e => { if (e.key === 'Escape') this.closeAll(); });
    },
    lock(on) { document.body.classList.toggle('no-scroll', on); Motion.onScroll(); },
    closeAll(keepLock) {
        ['menu-overlay', 'search-overlay', 'auth-drawer'].forEach(id => document.getElementById(id)?.classList.remove('open'));
        if (!keepLock) this.lock(false);
    }
};
