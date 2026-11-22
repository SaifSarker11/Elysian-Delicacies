const RestaurantListPage = {
    state: { q: '', cuisine: '', area: '', tier: '', open: false, saved: false, sort: '', view: 'list' },
    pendingSearch: '',
    data: [],
    facets: { cuisines: [], areas: [] },
    map: null,
    markers: {},
    timer: null,

    async render(area, cuisine) {
        const dec = v => (v && v !== 'all' ? decodeURIComponent(v) : '');
        this.state = { q: this.pendingSearch || '', cuisine: dec(cuisine), area: dec(area), tier: '', open: false, saved: false, sort: '', view: 'list' };
        this.pendingSearch = '';
        if (this.map) { this.map.remove(); this.map = null; }
        this.markers = {};

        const main = document.getElementById('main-content');
        const s = this.state;
        main.innerHTML = `
            <div class="container page-head">
                <div class="crumbs"><a onclick="App.navigate('home')">Home</a> &nbsp;/&nbsp; Kitchens</div>
                <h1 data-reveal>Kitchens in Dhaka</h1>
            </div>
            <div class="filters"><div class="container filters-in">
                <div class="f-search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input id="rl-q" type="text" placeholder="Name, dish or neighbourhood" value="${s.q.replace(/"/g, '&quot;')}" oninput="RestaurantListPage.onType(this.value)">
                </div>
                <select class="f-select" id="rl-cuisine" onchange="RestaurantListPage.set('cuisine', this.value)"><option value="">Cuisine</option></select>
                <select class="f-select" id="rl-area" onchange="RestaurantListPage.set('area', this.value)"><option value="">Neighbourhood</option></select>
                <select class="f-select" id="rl-tier" onchange="RestaurantListPage.set('tier', this.value)">
                    <option value="">Distinction</option><option value="4.7">Exceptional</option><option value="4.5">Highly Recommended +</option><option value="4.3">Recommended +</option>
                </select>
                <button class="f-toggle" id="rl-open" onclick="RestaurantListPage.toggle('open')">Open now</button>
                <button class="f-toggle" id="rl-saved" onclick="RestaurantListPage.toggle('saved')">Saved</button>
                <select class="f-select" id="rl-sort" onchange="RestaurantListPage.set('sort', this.value)">
                    <option value="">Sort: Featured</option><option value="rating">Top rated</option><option value="name">A – Z</option><option value="fee">Lowest delivery fee</option><option value="eta">Fastest</option>
                </select>
                <button class="f-toggle view-toggle" id="rl-view" onclick="RestaurantListPage.toggleView()">Map</button>
            </div></div>
            <div class="container">
                <div class="results-bar"><span class="results-count" id="rl-count">Loading…</span><span class="clear-link" id="rl-clear" style="display:none" onclick="RestaurantListPage.clear()">Clear all filters</span></div>
                <div class="rl-wrap" id="rl-wrap" data-view="list">
                    <div class="rl-list"><div class="rc-grid" id="all-restaurants">${[1, 2, 3, 4].map(() => '<div class="rc sk-card"><div class="sk-img skeleton"></div><div class="sk-l skeleton"></div><div class="sk-l s skeleton"></div></div>').join('')}</div></div>
                    <div class="rl-map-col"><div id="rl-map"></div></div>
                </div>
            </div>`;
        await this.fetch(true);
    },

    async fetch(first) {
        try {
            const q = this.state.q.trim();
            const res = await API.getRestaurants(q ? { search: q } : {});
            this.data = res.restaurants || [];
            if (first) {
                const all = q ? (await API.getRestaurants({})).restaurants || [] : this.data;
                this.facets.cuisines = [...new Set(all.map(r => r.cuisineType))].sort();
                this.facets.areas = [...new Set(all.map(r => r.address && r.address.area).filter(Boolean))].sort();
                const cs = document.getElementById('rl-cuisine'), as = document.getElementById('rl-area');
                this.facets.cuisines.forEach(c => cs.insertAdjacentHTML('beforeend', `<option ${c === this.state.cuisine ? 'selected' : ''}>${c}</option>`));
                this.facets.areas.forEach(a => as.insertAdjacentHTML('beforeend', `<option ${a === this.state.area ? 'selected' : ''}>${a}</option>`));
            }
            this.apply();
        } catch (err) { showToast(err.message, 'error'); }
    },

    onType(v) { this.state.q = v; clearTimeout(this.timer); this.timer = setTimeout(() => this.fetch(false), 260); },
    set(k, v) { this.state[k] = v; this.apply(); },
    toggle(k) { this.state[k] = !this.state[k]; this.apply(); },
    toggleView() { this.state.view = this.state.view === 'list' ? 'map' : 'list'; this.apply(); },
    clear() {
        Object.assign(this.state, { cuisine: '', area: '', tier: '', open: false, saved: false, sort: '' });
        ['rl-cuisine', 'rl-area', 'rl-tier', 'rl-sort'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        this.apply();
    },

    filtered() {
        const s = this.state;
        let list = this.data.filter(r =>
            (!s.cuisine || r.cuisineType === s.cuisine) &&
            (!s.area || (r.address && r.address.area === s.area)) &&
            (!s.tier || r.rating >= parseFloat(s.tier)) &&
            (!s.open || r.open || r.isOpen) &&
            (!s.saved || Saved.has(r.id)));
        const sorters = {
            rating: (a, b) => b.rating - a.rating, name: (a, b) => a.name.localeCompare(b.name),
            fee: (a, b) => a.deliveryFee - b.deliveryFee, eta: (a, b) => a.estimatedDeliveryMinutes - b.estimatedDeliveryMinutes
        };
        if (sorters[s.sort]) list = [...list].sort(sorters[s.sort]);
        return list;
    },

    apply() {
        const s = this.state, list = this.filtered(), grid = document.getElementById('all-restaurants');
        if (!grid) return;
        const flag = (id, on) => document.getElementById(id)?.classList.toggle('on', on);
        flag('rl-open', s.open); flag('rl-saved', s.saved);
        document.getElementById('rl-view').textContent = s.view === 'list' ? 'Map' : 'List';
        document.getElementById('rl-wrap').dataset.view = s.view;
        ['rl-cuisine', 'rl-area', 'rl-tier', 'rl-sort'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.toggle('set', !!el.value); });
        const active = s.cuisine || s.area || s.tier || s.open || s.saved;
        document.getElementById('rl-clear').style.display = active ? 'inline' : 'none';
        document.getElementById('rl-count').textContent = `${list.length} ${list.length === 1 ? 'kitchen' : 'kitchens'}`;

        grid.innerHTML = list.length
            ? list.map((r, i) => renderRestaurantCard(r, i)).join('')
            : '<div class="empty-state"><h3 style="font-size:1.6rem;margin-bottom:8px">No kitchens found</h3><p style="color:var(--ink-muted);margin-bottom:20px">Try removing a filter or searching for something else.</p><button class="btn btn-outline" onclick="RestaurantListPage.clear()">Clear filters</button></div>';
        grid.querySelectorAll('.rc').forEach(c => {
            c.addEventListener('mouseenter', () => this.hot(c.dataset.id, true));
            c.addEventListener('mouseleave', () => this.hot(c.dataset.id, false));
        });
        this.drawMap(list);
    },

    hot(id, on) { const m = this.markers[id]; if (m && m.getElement()) m.getElement().firstElementChild?.classList.toggle('hot', on); },

    drawMap(list) {
        const el = document.getElementById('rl-map');
        if (!el || typeof L === 'undefined') { document.querySelector('.rl-map-col')?.remove(); document.getElementById('rl-wrap')?.setAttribute('style', 'grid-template-columns:1fr'); return; }
        if (!this.map) {
            this.map = L.map(el, { zoomControl: false, scrollWheelZoom: false }).setView([23.81, 90.4], 11);
            L.control.zoom({ position: 'bottomright' }).addTo(this.map);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap contributors © CARTO', maxZoom: 18 }).addTo(this.map);
            this.map.on('focus', () => this.map.scrollWheelZoom.enable());
            this.map.on('blur', () => this.map.scrollWheelZoom.disable());
        }
        Object.values(this.markers).forEach(m => m.remove());
        this.markers = {};
        const pts = [];
        list.forEach(r => {
            if (!r.address || !r.address.latitude) return;
            const ll = [r.address.latitude, r.address.longitude];
            pts.push(ll);
            const icon = L.divIcon({ className: '', iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -30], html: `<div class="pin"><span>${(r.rating || 0).toFixed(1)}</span></div>` });
            const m = L.marker(ll, { icon }).addTo(this.map).bindPopup(`<div class="pop-card"><img src="${restaurantPhoto(r)}" alt=""><div><h4>${r.name}</h4><p>${r.cuisineType} · ${r.address.area}</p><a onclick="App.navigate('restaurant/${r.id}')">View kitchen →</a></div></div>`, { closeButton: false });
            m.on('click', () => {
                const card = document.querySelector(`.rc[data-id="${r.id}"]`);
                if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); card.classList.add('flash'); setTimeout(() => card.classList.remove('flash'), 1600); }
            });
            this.markers[r.id] = m;
        });
        setTimeout(() => {
            if (!this.map) return;
            this.map.invalidateSize();
            if (pts.length > 1) this.map.flyToBounds(pts, { padding: [50, 50], maxZoom: 13, duration: 0.8 });
            else if (pts.length === 1) this.map.flyTo(pts[0], 13, { duration: 0.8 });
        }, 60);
    }
};
