const App = {
    currentPage: null,
    token: 0,
    booted: false,

    routes: {
        'home': () => HomePage.render(),
        'dashboard': () => CustomerDashboard.render(),
        'restaurants': (area, cuisine) => RestaurantListPage.render(area, cuisine),
        'restaurant': (id) => RestaurantMenuPage.render(id),
        'cart': () => CartPage.render(),
        'checkout': () => CheckoutPage.render(),
        'tracking': (orderId) => OrderTrackingPage.render(orderId),
        'owner-dashboard': () => RestaurantDashboardPage.render(),
        'register-restaurant': () => RestaurantRegisterPage.render(),
        'restaurant-orders': (id) => RestaurantOrdersPage.render(id),
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('cart-changed', () => Navbar.updateCartBadge());
        Overlays.init();
        Motion.init();
        this.handleRoute();
    },

    navigate(route) {
        if (window.location.hash.slice(1) === route) { this.handleRoute(); return; }
        window.location.hash = route;
    },

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const [page, ...params] = hash.split('/');

        const protectedPages = ['dashboard', 'cart', 'checkout', 'tracking', 'owner-dashboard', 'register-restaurant', 'restaurant-orders'];
        if (protectedPages.includes(page) && !Session.isLoggedIn()) {
            this.navigate('home');
            setTimeout(() => AuthDrawer.open('login'), 500);
            return;
        }

        const renderer = this.routes[page];
        if (!renderer) { this.navigate('home'); return; }

        const main = document.getElementById('main-content');
        const run = ++this.token;
        const paint = () => {
            if (run !== this.token) return;
            this.currentPage = page;
            main.dataset.page = page;
            Overlays.closeAll();
            Navbar.render();
            window.scrollTo(0, 0);
            Motion.lastY = 0;
            main.classList.remove('is-leaving');
            main.classList.add('is-entering');
            renderer(...params);
            Motion.onScroll();
            setTimeout(() => { main.classList.remove('is-entering'); Motion.progressDone(); }, 700);
        };

        if (!this.booted || Motion.reduced) { this.booted = true; paint(); return; }
        Motion.progressStart();
        main.classList.add('is-leaving');
        setTimeout(paint, 280);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
