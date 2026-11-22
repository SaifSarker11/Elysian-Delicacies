const HomePage = {
    activeTab: 'login',
    slideTimer: null,
    HERO: [
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=2000&q=80'
    ],
    HOODS: [
        ['Gulshan', 'Chinese'], ['Banani', 'Bengali'], ['Dhanmondi', 'American'], ['Uttara', 'Italian'], ['Mirpur', 'Thai']
    ],

    render() {
        const main = document.getElementById('main-content');
        const cuisines = Object.keys(CUISINE_PHOTOS_LIST());
        const arrow = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></svg>';
        const big = (u, w) => u.replace(/w=\d+/, 'w=' + w);

        main.innerHTML = `
            <section class="hero" id="hero">
                ${this.HERO.map((u, i) => `<div class="hero-slide ${i === 0 ? 'on' : ''}"><img src="${u}" alt=""></div>`).join('')}
                <div class="container hero-content">
                    <span class="eyebrow">The Dhaka guide to independent kitchens</span>
                    <h1><span class="mask-line" style="--i:0"><span>Where Dhaka’s</span></span><span class="mask-line" style="--i:1"><span>finest kitchens</span></span><span class="mask-line" style="--i:2"><span><em>meet your table.</em></span></span></h1>
                    <p class="hero-lead" data-reveal style="--i:4">From heritage kacchi biryanis in Banani to wood-fired sourdough in Uttara, thoughtful cooking delivered promptly to your door.</p>
                    <form class="finder" data-reveal style="--i:5" onsubmit="HomePage.find(event)">
                        <label><span>Cuisine</span><select id="f-cuisine"><option value="all">All cuisines</option>${cuisines.map(c => `<option>${c}</option>`).join('')}</select></label>
                        <label><span>Neighbourhood</span><select id="f-area"><option value="all">Anywhere in Dhaka</option>${this.HOODS.map(h => `<option>${h[0]}</option>`).join('')}</select></label>
                        <button type="submit">Find a kitchen</button>
                    </form>
                    <div class="hero-foot">
                        <div class="hero-dots">${this.HERO.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</div>
                        <div class="scroll-cue">Scroll</div>
                    </div>
                </div>
            </section>

            <section class="block">
                <div class="container intro-grid">
                    <p class="intro-text" data-reveal>Every kitchen in our collection is independent, <em>owner-led</em> and chosen for its point of view. We simply make sure the food arrives the way the chef intended.</p>
                    <div class="facts">
                        <div class="fact" data-reveal style="--i:1"><b data-count="28" data-suffix=" min">0</b><span>Average delivery</span></div>
                        <div class="fact" data-reveal style="--i:2"><b data-count="4.8" data-suffix=" / 5">0</b><span>Kitchen review score</span></div>
                        <div class="fact" data-reveal style="--i:3"><b data-count="100" data-suffix="%">0</b><span>Inspected packaging</span></div>
                    </div>
                </div>
            </section>

            <section class="block soft" style="padding-left:0;padding-right:0">
                <div class="container block-head">
                    <div data-reveal><span class="eyebrow">Our selection</span><h2 class="section-heading-editorial">Kitchens worth ordering from</h2></div>
                    <div class="arrows" data-reveal>
                        <button class="arrow-btn" id="rail-prev" aria-label="Previous" onclick="HomePage.rail(-1)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="20" y1="12" x2="4" y2="12"/><polyline points="10 6 4 12 10 18"/></svg></button>
                        <button class="arrow-btn" id="rail-next" aria-label="Next" onclick="HomePage.rail(1)">${arrow}</button>
                    </div>
                </div>
                <div class="rail" id="featured-rail">${[1, 2, 3].map(() => '<div class="rc"><div class="rc-media skeleton"></div><div class="rc-body"><div class="skeleton" style="height:18px;width:60%"></div></div></div>').join('')}</div>
                <div class="container"><div class="rail-progress"><i id="rail-bar"></i></div></div>
            </section>

            <section class="block">
                <div class="container">
                    <div class="block-head"><div data-reveal><span class="eyebrow">Explore</span><h2 class="section-heading-editorial">By neighbourhood</h2></div>
                    <a class="clear-link" style="font-size:.8rem" onclick="App.navigate('restaurants')" data-reveal>View all kitchens</a></div>
                    <div class="hoods">
                        ${this.HOODS.map(([a, c], i) => `<div class="hood" data-reveal style="--i:${i}" onclick="App.navigate('restaurants/${a}')"><img src="${big(getCuisinePhoto(c), 700)}" alt="${a}" loading="lazy"><div class="hood-info"><h3>${a}</h3><span>Explore ${arrow}</span></div></div>`).join('')}
                    </div>
                </div>
            </section>

            <section class="block soft">
                <div class="container split">
                    <div class="split-media" data-reveal="fade"><img data-parallax src="${big(getCuisinePhoto('Japanese'), 1100)}" alt="Chef plating a dish" loading="lazy"></div>
                    <div>
                        <span class="eyebrow" data-reveal>The Elysian difference</span>
                        <h2 class="section-heading-editorial" data-reveal style="--i:1">Craft, transparency and care in every order</h2>
                        <div class="principles">
                            <div class="principle" data-reveal><span>01</span><div><h4>Neighbourhood roots</h4><p>We work only with established kitchens in Gulshan, Banani, Dhanmondi, Uttara and Mirpur, each known for a distinct culinary identity.</p></div></div>
                            <div class="principle" data-reveal><span>02</span><div><h4>A dedicated courier fleet</h4><p>Insulated thermal carriers and direct dispatch keep curries piping hot and crusts wonderfully crisp on arrival.</p></div></div>
                            <div class="principle" data-reveal><span>03</span><div><h4>Honest pricing</h4><p>Menu prices come straight from the restaurant, with clear delivery tiers, seasonal vouchers and no hidden service mark-ups.</p></div></div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="cta-band">
                <div class="container">
                    <span class="eyebrow" data-reveal>For kitchen owners</span>
                    <h2 data-reveal style="--i:1">Run a kitchen in Dhaka? Join the guide.</h2>
                    <button class="btn btn-outline" data-reveal style="--i:2" onclick="App.navigate('register-restaurant')">Add your restaurant</button>
                </div>
            </section>`;

        this.startSlides();
        this.loadFeatured();
        const rail = document.getElementById('featured-rail');
        rail.addEventListener('scroll', () => this.railState(), { passive: true });
    },

    startSlides() {
        clearInterval(this.slideTimer);
        let i = 0;
        const next = () => {
            const slides = document.querySelectorAll('.hero-slide');
            if (!slides.length) return clearInterval(this.slideTimer);
            const dots = document.querySelectorAll('.hero-dots i');
            slides[i].classList.remove('on'); dots[i].classList.remove('on');
            i = (i + 1) % slides.length;
            slides[i].classList.add('on'); void dots[i].offsetWidth; dots[i].classList.add('on');
        };
        this.slideTimer = setInterval(next, 6000);
    },

    async loadFeatured() {
        try {
            const data = await API.getRestaurants({ sortBy: 'rating' });
            const rail = document.getElementById('featured-rail');
            if (!rail) return;
            rail.innerHTML = (data.restaurants || []).slice(0, 8).map((r, i) => renderRestaurantCard(r, i)).join('');
            this.railState();
        } catch (err) { showToast(err.message, 'error'); }
    },

    rail(dir) { const r = document.getElementById('featured-rail'); if (r) r.scrollBy({ left: dir * (r.clientWidth * 0.6), behavior: 'smooth' }); },
    railState() {
        const r = document.getElementById('featured-rail'), bar = document.getElementById('rail-bar');
        if (!r || !bar) return;
        const max = r.scrollWidth - r.clientWidth, w = Math.min(100, (r.clientWidth / r.scrollWidth) * 100);
        bar.style.width = w + '%';
        bar.style.left = (max > 0 ? (r.scrollLeft / max) * (100 - w) : 0) + '%';
        document.getElementById('rail-prev').disabled = r.scrollLeft < 4;
        document.getElementById('rail-next').disabled = r.scrollLeft > max - 4;
    },

    find(e) {
        e.preventDefault();
        const area = document.getElementById('f-area').value, cuisine = document.getElementById('f-cuisine').value;
        App.navigate(`restaurants/${encodeURIComponent(area)}/${encodeURIComponent(cuisine)}`);
    },

    switchTab(event, tab) {
        this.activeTab = tab;
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        if (event && event.target) {
            event.target.classList.add('active');
        }
        const container = document.getElementById('auth-form-content');
        if (container) {
            container.innerHTML = tab === 'login' ? this.loginForm() : this.registerForm();
        }
    },

    loginForm() {
        return `
            <form onsubmit="HomePage.handleLogin(event)" id="login-form">
                <div class="form-group">
                    <label class="form-label">Email address</label>
                    <input type="email" class="form-input" id="login-email" placeholder="name@domain.com" required value="ahmed@email.com">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-input" id="login-password" placeholder="Enter password" required value="password123">
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-btn">Sign In</button>
                <div class="demo-credentials-box">
                    <strong>Pre-configured Accounts:</strong><br>
                    Customer: <code>ahmed@email.com</code> / <code>password123</code><br>
                    Kitchen Owner: <code>karim@email.com</code> / <code>password123</code>
                </div>
            </form>
        `;
    },

    registerForm() {
        return `
            <form onsubmit="HomePage.handleRegister(event)" id="register-form">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="reg-name" placeholder="e.g. Ahmed Tahsin" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-input" id="reg-email" placeholder="name@domain.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-input" id="reg-password" placeholder="Create a secure password" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Contact Number</label>
                    <input type="tel" class="form-input" id="reg-phone" placeholder="+880 1712 345678">
                </div>
                <div class="form-group">
                    <label class="form-label">Account Purpose</label>
                    <div class="role-selector">
                        <div class="role-option active" onclick="HomePage.selectRole(this, 'CUSTOMER')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            Order Food
                        </div>
                        <div class="role-option" onclick="HomePage.selectRole(this, 'RESTAURANT_OWNER')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            Kitchen Partner
                        </div>
                    </div>
                    <input type="hidden" id="reg-role" value="CUSTOMER">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Neighborhood / Area</label>
                        <input type="text" class="form-input" id="reg-area" placeholder="e.g. Gulshan, Banani">
                    </div>
                    <div class="form-group">
                        <label class="form-label">City</label>
                        <input type="text" class="form-input" id="reg-city" placeholder="Dhaka" value="Dhaka">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg" id="reg-btn">Create Free Account</button>
            </form>
        `;
    },

    selectRole(el, role) {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('reg-role').value = role;
    },

    async handleLogin(e) {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        btn.disabled = true;
        btn.textContent = 'Authenticating...';

        try {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const result = await API.login(email, password);
            Session.setUser(result.user);
            AuthDrawer.close();
            showToast(`Welcome back, ${result.user.name}`, 'success');

            if (result.user.role === 'RESTAURANT_OWNER') {
                App.navigate('owner-dashboard');
            } else {
                App.navigate('dashboard');
            }
        } catch (err) {
            showToast(err.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Sign In';
        }
    },

    async handleRegister(e) {
        e.preventDefault();
        const btn = document.getElementById('reg-btn');
        btn.disabled = true;
        btn.textContent = 'Creating account...';

        try {
            const data = {
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value,
                password: document.getElementById('reg-password').value,
                phone: document.getElementById('reg-phone').value,
                role: document.getElementById('reg-role').value,
                address: {
                    area: document.getElementById('reg-area').value,
                    city: document.getElementById('reg-city').value,
                    street: '',
                    latitude: 23.7925,
                    longitude: 90.4078
                }
            };

            const result = await API.register(data);
            Session.setUser(result.user);
            AuthDrawer.close();
            showToast('Account registered successfully', 'success');

            if (result.user.role === 'RESTAURANT_OWNER') {
                App.navigate('owner-dashboard');
            } else {
                App.navigate('dashboard');
            }
        } catch (err) {
            showToast(err.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Create Free Account';
        }
    }
};
