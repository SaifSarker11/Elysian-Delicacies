const HomePage = {
    activeTab: 'login',

    render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div class="hero-editorial">
                <div class="container hero-editorial-grid">
                    <div>
                        <div class="hero-kicker">Dhaka's Curated Dining Collective</div>
                        <h1>Exceptional meals from neighborhood kitchens, <span class="em-serif">delivered fresh</span></h1>
                        <p class="hero-lead">From heritage kacchi biryanis in Banani to wood-fired artisan sourdough in Uttara — experience thoughtful cooking delivered promptly to your home.</p>
                        
                        <div class="hero-proof-strip">
                            <div class="proof-item">
                                <span class="proof-number">28 min</span>
                                <span class="proof-label">Average delivery</span>
                            </div>
                            <div class="proof-item">
                                <span class="proof-number">4.8 / 5</span>
                                <span class="proof-label">Kitchen review score</span>
                            </div>
                            <div class="proof-item">
                                <span class="proof-number">100%</span>
                                <span class="proof-label">Inspected packaging</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="auth-panel">
                            <div class="auth-header">
                                <h3>Welcome to Elysian</h3>
                                <p>Sign in to order or manage your kitchen</p>
                            </div>
                            <div class="auth-tabs">
                                <div class="auth-tab ${this.activeTab === 'login' ? 'active' : ''}" onclick="HomePage.switchTab(event, 'login')">Customer / Owner Sign In</div>
                                <div class="auth-tab ${this.activeTab === 'register' ? 'active' : ''}" onclick="HomePage.switchTab(event, 'register')">New Account</div>
                            </div>
                            <div id="auth-form-content">
                                ${this.activeTab === 'login' ? this.loginForm() : this.registerForm()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container curated-story-section">
                <div class="section-eyebrow">The Elysian Difference</div>
                <h2 class="section-heading-editorial">Craft, transparency, and care in every order</h2>
                <p class="section-desc-editorial">We work directly with passionate chefs and family-owned restaurants who never compromise on ingredients or culinary craft.</p>

                <div class="story-grid">
                    <div class="story-card">
                        <div class="story-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <h4>Neighborhood Roots</h4>
                        <p>We source exclusively from established culinary kitchens in Gulshan, Banani, Dhanmondi, and Uttara known for distinct culinary identity.</p>
                    </div>

                    <div class="story-card">
                        <div class="story-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <h4>Dedicated Courier Fleet</h4>
                        <p>Insulated thermal carriers and direct dispatch ensure curries remain piping hot and crispy crusts stay wonderfully crisp upon arrival.</p>
                    </div>

                    <div class="story-card">
                        <div class="story-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </div>
                        <h4>Honest Pricing</h4>
                        <p>Direct menu pricing from restaurant owners with clear delivery tiers, seasonal vouchers, and no hidden service markups.</p>
                    </div>
                </div>
            </div>
        `;
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
