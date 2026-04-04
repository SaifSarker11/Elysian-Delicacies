const HomePage = {
    activeTab: 'login',

    render() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            <div class="hero">
                <div class="hero-content fade-in">
                    <h1>Delicious Food,<br><span class="highlight">Delivered Fast</span></h1>
                    <p>Order from the best local restaurants with easy-to-use food delivery service. Track your order in real-time.</p>
                    
                    <div class="auth-container">
                        <div class="auth-card slide-up">
                            <div class="auth-tabs">
                                <div class="auth-tab ${this.activeTab === 'login' ? 'active' : ''}" onclick="HomePage.switchTab(event, 'login')">Sign In</div>
                                <div class="auth-tab ${this.activeTab === 'register' ? 'active' : ''}" onclick="HomePage.switchTab(event, 'register')">Sign Up</div>
                            </div>
                            <div id="auth-form-content">
                                ${this.activeTab === 'login' ? this.loginForm() : this.registerForm()}
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top:32px;display:flex;gap:32px;justify-content:center">
                        <div style="text-align:center">
                            <div style="font-family:var(--font-heading);font-size:1.8rem;font-weight:800;color:var(--primary)">5+</div>
                            <div style="font-size:0.85rem;color:var(--text-secondary)">Restaurants</div>
                        </div>
                        <div style="text-align:center">
                            <div style="font-family:var(--font-heading);font-size:1.8rem;font-weight:800;color:var(--primary)">25+</div>
                            <div style="font-size:0.85rem;color:var(--text-secondary)">Menu Items</div>
                        </div>
                        <div style="text-align:center">
                            <div style="font-family:var(--font-heading);font-size:1.8rem;font-weight:800;color:var(--primary)">24/7</div>
                            <div style="font-size:0.85rem;color:var(--text-secondary)">Support</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    switchTab(event, tab) {
        this.activeTab = tab;
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('auth-form-content').innerHTML = tab === 'login' ? this.loginForm() : this.registerForm();
    },

    loginForm() {
        return `
            <form onsubmit="HomePage.handleLogin(event)" id="login-form">
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" id="login-email" placeholder="Enter your email" required value="ahmed@email.com">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-input" id="login-password" placeholder="Enter your password" required value="password123">
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-btn">Sign In →</button>
                <p style="text-align:center;margin-top:16px;color:var(--text-muted);font-size:0.85rem">
                    Demo: ahmed@email.com / password123 (Customer)<br>
                    karim@email.com / password123 (Owner)
                </p>
            </form>
        `;
    },

    registerForm() {
        return `
            <form onsubmit="HomePage.handleRegister(event)" id="register-form">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="reg-name" placeholder="Enter your name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" id="reg-email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-input" id="reg-password" placeholder="Create a password" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-input" id="reg-phone" placeholder="+880171xxxxxxx">
                </div>
                <div class="form-group">
                    <label class="form-label">Role</label>
                    <div class="role-selector">
                        <div class="role-option active" onclick="HomePage.selectRole(this, 'CUSTOMER')">🛍️ Customer</div>
                        <div class="role-option" onclick="HomePage.selectRole(this, 'RESTAURANT_OWNER')">🏪 Restaurant Owner</div>
                    </div>
                    <input type="hidden" id="reg-role" value="CUSTOMER">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Area</label>
                        <input type="text" class="form-input" id="reg-area" placeholder="e.g., Gulshan">
                    </div>
                    <div class="form-group">
                        <label class="form-label">City</label>
                        <input type="text" class="form-input" id="reg-city" placeholder="e.g., Dhaka" value="Dhaka">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg" id="reg-btn">Create Account →</button>
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
        btn.textContent = 'Signing in...';

        try {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const result = await API.login(email, password);
            Session.setUser(result.user);
            showToast(`Welcome back, ${result.user.name}!`, 'success');

            if (result.user.role === 'RESTAURANT_OWNER') {
                App.navigate('owner-dashboard');
            } else {
                App.navigate('dashboard');
            }
        } catch (err) {
            showToast(err.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Sign In →';
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
            showToast('Account created successfully!', 'success');

            if (result.user.role === 'RESTAURANT_OWNER') {
                App.navigate('owner-dashboard');
            } else {
                App.navigate('dashboard');
            }
        } catch (err) {
            showToast(err.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Create Account →';
        }
    }
};
