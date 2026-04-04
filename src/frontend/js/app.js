
const App = {
    currentPage: null,

    routes: {
        'home': () => HomePage.render(),
        'dashboard': () => CustomerDashboard.render(),
        'restaurants': () => RestaurantListPage.render(),
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
        this.handleRoute();
    },

    navigate(route) {
        window.location.hash = route;
    },

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const [page, ...params] = hash.split('/');

        const protectedPages = ['dashboard', 'cart', 'checkout', 'tracking', 'owner-dashboard', 'register-restaurant', 'restaurant-orders'];
        if (protectedPages.includes(page) && !Session.isLoggedIn()) {
            this.navigate('home');
            return;
        }

        const renderer = this.routes[page];
        if (renderer) {
            this.currentPage = page;
            Navbar.render();
            renderer(...params);
        } else {
            this.navigate('home');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
