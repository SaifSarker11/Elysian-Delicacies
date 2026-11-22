const RestaurantMenuPage = {
    restaurant: null,
    menuItems: [],
    spy: null,

    async render(restaurantId) {
        const main = document.getElementById('main-content');
        main.innerHTML = '<div style="height:100vh;background:#111"><div class="skeleton" style="height:100%;opacity:.12"></div></div>';

        try {
            const [restData, menuData] = await Promise.all([API.getRestaurant(restaurantId), API.getMenu(restaurantId)]);
            this.restaurant = restData.restaurant;
            this.menuItems = menuData.menuItems || [];
            const r = this.restaurant;
            const isOpen = r.open || r.isOpen;
            const categories = [...new Set(this.menuItems.map(m => m.category))];
            const area = r.address ? r.address.area : 'Dhaka';
            const address = r.address ? `${r.address.street}, ${r.address.area}, ${r.address.city}` : 'Dhaka';

            main.innerHTML = `
                <section class="r-hero">
                    <img data-parallax src="${restaurantPhoto(r).replace(/w=\d+/, 'w=2000')}" alt="${r.name}" onerror="this.onerror=null;this.src='${FALLBACK_PHOTO}'">
                    <div class="container r-hero-in">
                        <div class="crumbs"><a onclick="App.navigate('home')">Home</a> &nbsp;/&nbsp; <a onclick="App.navigate('restaurants')">Kitchens</a> &nbsp;/&nbsp; ${area}</div>
                        <h1><span class="mask-line"><span>${r.name}</span></span></h1>
                        ${renderDistinction(r.rating)}
                        <div class="r-hero-sub">${r.cuisineType} · ${area} · ★ ${r.rating.toFixed(1)}</div>
                    </div>
                </section>
                <section class="r-bar"><div class="container r-bar-in">
                    <div><h6>Status</h6><p>${isOpen ? 'Open now' : 'Closed'}</p></div>
                    <div><h6>Service hours</h6><p>${r.openingTime} – ${r.closingTime}</p></div>
                    <div><h6>Delivery</h6><p>৳${r.deliveryFee} · ~${r.estimatedDeliveryMinutes} min</p></div>
                    <div><h6>Location</h6><p>${area}, ${r.address ? r.address.city : 'Dhaka'}</p></div>
                    <div style="display:flex;gap:10px">
                        <button class="btn btn-outline" onclick="Saved.onClick(event, '${r.id}')" data-save="${r.id}" style="padding:12px 18px">Save</button>
                        <button class="btn btn-primary" onclick="RestaurantMenuPage.go('menu')" style="padding:12px 22px">Order</button>
                    </div>
                </div></section>
                <nav class="subnav"><div class="container subnav-in">
                    <a class="active" data-target="overview" onclick="RestaurantMenuPage.go('overview')">Overview</a>
                    <a data-target="menu" onclick="RestaurantMenuPage.go('menu')">Menu</a>
                    <a data-target="details" onclick="RestaurantMenuPage.go('details')">Details</a>
                </div></nav>
                <section id="overview" class="container r-overview">
                    <p class="r-lead" data-reveal>${r.description || 'Specialising in quality culinary traditions, fresh produce and carefully crafted dishes.'}</p>
                    <div class="r-facts" data-reveal style="--i:1"><dl>
                        <dt>Cuisine</dt><dd>${r.cuisineType}</dd>
                        <dt>Guest rating</dt><dd>${r.rating.toFixed(1)} / 5</dd>
                        <dt>Hours</dt><dd>${r.openingTime} – ${r.closingTime}</dd>
                        <dt>Delivery</dt><dd>৳${r.deliveryFee}, about ${r.estimatedDeliveryMinutes} minutes</dd>
                    </dl></div>
                </section>
                <section id="menu" class="container r-menu">
                    <div class="category-pills">
                        <span class="category-pill active" onclick="RestaurantMenuPage.filterCategory(this, '')">Full menu</span>
                        ${categories.map(c => `<span class="category-pill" onclick="RestaurantMenuPage.filterCategory(this, '${c}')">${c}</span>`).join('')}
                    </div>
                    <div class="two-col-layout" style="margin-top:8px">
                        <div><h2>Menu</h2><div id="menu-items-list">${this.renderMenuItems(this.menuItems)}</div></div>
                        <div><div class="order-summary" style="position:sticky;top:150px"><h3>Your order</h3><div id="mini-cart">${this.renderMiniCart()}</div></div></div>
                    </div>
                </section>
                <section id="details" class="container" style="padding-bottom:96px;scroll-margin-top:140px">
                    <div class="r-facts" data-reveal><h2 style="font-size:2rem;margin-bottom:24px">Details</h2><dl>
                        <dt>Address</dt><dd>${address}</dd><dt>Hours</dt><dd>${r.openingTime} – ${r.closingTime}</dd>
                    </dl></div>
                </section>`;

            const saveBtn = main.querySelector('.r-bar [data-save]');
            if (saveBtn) saveBtn.textContent = Saved.has(r.id) ? 'Saved ✓' : 'Save';
            this.watch();
        } catch (err) {
            main.innerHTML = `<div class="container section"><div class="empty-state"><p class="empty-text">${err.message}</p><button class="btn btn-primary" onclick="history.back()">Go back</button></div></div>`;
        }
    },

    go(id) {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' });
    },

    watch() {
        if (this.spyHandler) window.removeEventListener('scroll', this.spyHandler);
        if (this.cartHandler) window.removeEventListener('cart-changed', this.cartHandler);
        this.spyHandler = () => {
            const links = document.querySelectorAll('.subnav a');
            if (!links.length) return;
            let current = 'overview';
            ['overview', 'menu', 'details'].forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 180) current = id; });
            links.forEach(a => a.classList.toggle('active', a.dataset.target === current));
        };
        this.cartHandler = () => { const mc = document.getElementById('mini-cart'); if (mc) mc.innerHTML = this.renderMiniCart(); };
        window.addEventListener('scroll', this.spyHandler, { passive: true });
        window.addEventListener('cart-changed', this.cartHandler);
    },

    renderMenuItems(items) {
        if (!items || items.length === 0) {
            return '<div class="empty-state"><p class="empty-text">No items found in this section.</p></div>';
        }
        return items.map(item => renderMenuItemCard(item, Session.isLoggedIn())).join('');
    },

    filterCategory(el, category) {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');

        const filtered = category ? this.menuItems.filter(m => m.category === category) : this.menuItems;
        document.getElementById('menu-items-list').innerHTML = this.renderMenuItems(filtered);
    },

    renderMiniCart() {
        const items = Cart.getItems();
        const restaurantId = Cart.getRestaurantId();

        if (items.length === 0 || (this.restaurant && restaurantId !== this.restaurant.id)) {
            return '<p style="color:var(--ink-muted);text-align:center;padding:24px 0;font-size:0.88rem">Select items from the menu to start your order.</p>';
        }

        const total = Cart.getTotal();
        return `
            ${items.map(item => `
                <div class="summary-row">
                    <span>${item.menuItemName} × ${item.quantity}</span>
                    <span style="font-weight:600">৳${item.totalPrice.toFixed(0)}</span>
                </div>
            `).join('')}
            <div class="summary-row total">
                <span>Estimated Subtotal</span>
                <span>৳${total.toFixed(0)}</span>
            </div>
            <button class="btn btn-primary btn-block btn-lg" style="margin-top:18px" onclick="App.navigate('cart')">
                View Order & Checkout
            </button>
        `;
    }
};
