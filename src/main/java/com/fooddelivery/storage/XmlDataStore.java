package com.fooddelivery.storage;

import com.fooddelivery.model.*;
import com.fooddelivery.util.IdGenerator;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Marshaller;
import jakarta.xml.bind.Unmarshaller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * XML-based data storage for all application entities.
 * Uses JAXB for serialization/deserialization.
 * Thread-safe using CopyOnWriteArrayList.
 */
public class XmlDataStore {

    private static XmlDataStore instance;
    private final String dataDir;

    private final List<User> users = new CopyOnWriteArrayList<>();
    private final List<Restaurant> restaurants = new CopyOnWriteArrayList<>();
    private final List<MenuItem> menuItems = new CopyOnWriteArrayList<>();
    private final List<Order> orders = new CopyOnWriteArrayList<>();
    private final List<Payment> payments = new CopyOnWriteArrayList<>();
    private final List<DeliveryRider> riders = new CopyOnWriteArrayList<>();
    private final List<Coupon> coupons = new CopyOnWriteArrayList<>();

    private XmlDataStore(String dataDir) {
        this.dataDir = dataDir;
        initializeDataDirectory();
        loadAllData();
    }

    public static synchronized XmlDataStore getInstance() {
        if (instance == null) {
            instance = new XmlDataStore("data");
        }
        return instance;
    }

    public static synchronized XmlDataStore getInstance(String dataDir) {
        if (instance == null) {
            instance = new XmlDataStore(dataDir);
        }
        return instance;
    }

    private void initializeDataDirectory() {
        try {
            Files.createDirectories(Paths.get(dataDir));
        } catch (Exception e) {
            System.err.println("Failed to create data directory: " + e.getMessage());
        }
    }

    // ==================== USER OPERATIONS ====================

    public List<User> getAllUsers() {
        return Collections.unmodifiableList(users);
    }

    public Optional<User> getUserById(String id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    public Optional<User> getUserByEmail(String email) {
        return users.stream().filter(u -> u.getEmail().equalsIgnoreCase(email)).findFirst();
    }

    public User addUser(User user) {
        if (user.getId() == null || user.getId().isEmpty()) {
            user.setId(IdGenerator.generate());
        }
        users.add(user);
        saveUsers();
        return user;
    }

    public User updateUser(User user) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(user.getId())) {
                users.set(i, user);
                saveUsers();
                return user;
            }
        }
        return null;
    }

    // ==================== RESTAURANT OPERATIONS ====================

    public List<Restaurant> getAllRestaurants() {
        return Collections.unmodifiableList(restaurants);
    }

    public Optional<Restaurant> getRestaurantById(String id) {
        return restaurants.stream().filter(r -> r.getId().equals(id)).findFirst();
    }

    public List<Restaurant> getRestaurantsByArea(String area) {
        return restaurants.stream()
                .filter(r -> r.getAddress() != null &&
                        r.getAddress().getArea().equalsIgnoreCase(area))
                .collect(Collectors.toList());
    }

    public List<Restaurant> getRestaurantsByCuisine(String cuisine) {
        return restaurants.stream()
                .filter(r -> r.getCuisineType().equalsIgnoreCase(cuisine))
                .collect(Collectors.toList());
    }

    public List<Restaurant> getRestaurantsByOwner(String ownerId) {
        return restaurants.stream()
                .filter(r -> r.getOwnerId().equals(ownerId))
                .collect(Collectors.toList());
    }

    public Restaurant addRestaurant(Restaurant restaurant) {
        if (restaurant.getId() == null || restaurant.getId().isEmpty()) {
            restaurant.setId(IdGenerator.generate());
        }
        restaurants.add(restaurant);
        saveRestaurants();
        return restaurant;
    }

    public Restaurant updateRestaurant(Restaurant restaurant) {
        for (int i = 0; i < restaurants.size(); i++) {
            if (restaurants.get(i).getId().equals(restaurant.getId())) {
                restaurants.set(i, restaurant);
                saveRestaurants();
                return restaurant;
            }
        }
        return null;
    }

    // ==================== MENU ITEM OPERATIONS ====================

    public List<MenuItem> getAllMenuItems() {
        return Collections.unmodifiableList(menuItems);
    }

    public List<MenuItem> getMenuByRestaurant(String restaurantId) {
        return menuItems.stream()
                .filter(m -> m.getRestaurantId().equals(restaurantId))
                .collect(Collectors.toList());
    }

    public Optional<MenuItem> getMenuItemById(String id) {
        return menuItems.stream().filter(m -> m.getId().equals(id)).findFirst();
    }

    public List<MenuItem> searchMenuItems(String keyword) {
        String lower = keyword.toLowerCase();
        return menuItems.stream()
                .filter(m -> m.getName().toLowerCase().contains(lower) ||
                        m.getDescription().toLowerCase().contains(lower) ||
                        m.getCategory().toLowerCase().contains(lower))
                .collect(Collectors.toList());
    }

    public MenuItem addMenuItem(MenuItem item) {
        if (item.getId() == null || item.getId().isEmpty()) {
            item.setId(IdGenerator.generate());
        }
        menuItems.add(item);
        saveMenuItems();
        return item;
    }

    public MenuItem updateMenuItem(MenuItem item) {
        for (int i = 0; i < menuItems.size(); i++) {
            if (menuItems.get(i).getId().equals(item.getId())) {
                menuItems.set(i, item);
                saveMenuItems();
                return item;
            }
        }
        return null;
    }

    public boolean deleteMenuItem(String id) {
        boolean removed = menuItems.removeIf(m -> m.getId().equals(id));
        if (removed) saveMenuItems();
        return removed;
    }

    // ==================== ORDER OPERATIONS ====================

    public List<Order> getAllOrders() {
        return Collections.unmodifiableList(orders);
    }

    public Optional<Order> getOrderById(String id) {
        return orders.stream().filter(o -> o.getId().equals(id)).findFirst();
    }

    public List<Order> getOrdersByCustomer(String customerId) {
        return orders.stream()
                .filter(o -> o.getCustomerId().equals(customerId))
                .collect(Collectors.toList());
    }

    public List<Order> getOrdersByRestaurant(String restaurantId) {
        return orders.stream()
                .filter(o -> o.getRestaurantId().equals(restaurantId))
                .collect(Collectors.toList());
    }

    public Order addOrder(Order order) {
        if (order.getId() == null || order.getId().isEmpty()) {
            order.setId(IdGenerator.generate());
        }
        orders.add(order);
        saveOrders();
        return order;
    }

    public Order updateOrder(Order order) {
        for (int i = 0; i < orders.size(); i++) {
            if (orders.get(i).getId().equals(order.getId())) {
                orders.set(i, order);
                saveOrders();
                return order;
            }
        }
        return null;
    }

    // ==================== PAYMENT OPERATIONS ====================

    public List<Payment> getAllPayments() {
        return Collections.unmodifiableList(payments);
    }

    public Optional<Payment> getPaymentByOrderId(String orderId) {
        return payments.stream().filter(p -> p.getOrderId().equals(orderId)).findFirst();
    }

    public Payment addPayment(Payment payment) {
        if (payment.getId() == null || payment.getId().isEmpty()) {
            payment.setId(IdGenerator.generate());
        }
        payments.add(payment);
        savePayments();
        return payment;
    }

    public Payment updatePayment(Payment payment) {
        for (int i = 0; i < payments.size(); i++) {
            if (payments.get(i).getId().equals(payment.getId())) {
                payments.set(i, payment);
                savePayments();
                return payment;
            }
        }
        return null;
    }

    // ==================== RIDER OPERATIONS ====================

    public List<DeliveryRider> getAllRiders() {
        return Collections.unmodifiableList(riders);
    }

    public List<DeliveryRider> getAvailableRiders(String area) {
        return riders.stream()
                .filter(r -> r.isAvailable() &&
                        (area == null || r.getCurrentArea().equalsIgnoreCase(area)))
                .collect(Collectors.toList());
    }

    public Optional<DeliveryRider> getRiderById(String id) {
        return riders.stream().filter(r -> r.getId().equals(id)).findFirst();
    }

    public DeliveryRider addRider(DeliveryRider rider) {
        if (rider.getId() == null || rider.getId().isEmpty()) {
            rider.setId(IdGenerator.generate());
        }
        riders.add(rider);
        saveRiders();
        return rider;
    }

    public DeliveryRider updateRider(DeliveryRider rider) {
        for (int i = 0; i < riders.size(); i++) {
            if (riders.get(i).getId().equals(rider.getId())) {
                riders.set(i, rider);
                saveRiders();
                return rider;
            }
        }
        return null;
    }

    // ==================== COUPON OPERATIONS ====================

    public List<Coupon> getAllCoupons() {
        return Collections.unmodifiableList(coupons);
    }

    public List<Coupon> getActiveCoupons() {
        return coupons.stream().filter(Coupon::isActive).collect(Collectors.toList());
    }

    public Optional<Coupon> getCouponByCode(String code) {
        return coupons.stream()
                .filter(c -> c.getCode().equalsIgnoreCase(code))
                .findFirst();
    }

    public Coupon addCoupon(Coupon coupon) {
        coupons.add(coupon);
        saveCoupons();
        return coupon;
    }

    // ==================== PERSISTENCE ====================

    private void loadAllData() {
        loadUsers();
        loadRestaurants();
        loadMenuItems();
        loadOrders();
        loadPayments();
        loadRiders();
        loadCoupons();
        System.out.println("[DataStore] Loaded: " + users.size() + " users, "
                + restaurants.size() + " restaurants, " + menuItems.size() + " menu items, "
                + orders.size() + " orders, " + riders.size() + " riders, "
                + coupons.size() + " coupons");
    }

    @SuppressWarnings("unchecked")
    private <T> T loadFromXml(String filename, Class<T> clazz) {
        File file = new File(dataDir, filename);
        if (!file.exists()) return null;
        try {
            JAXBContext context = JAXBContext.newInstance(clazz);
            Unmarshaller unmarshaller = context.createUnmarshaller();
            return (T) unmarshaller.unmarshal(file);
        } catch (JAXBException e) {
            System.err.println("Failed to load " + filename + ": " + e.getMessage());
            return null;
        }
    }

    private <T> void saveToXml(String filename, T data, Class<T> clazz) {
        try {
            File file = new File(dataDir, filename);
            JAXBContext context = JAXBContext.newInstance(clazz);
            Marshaller marshaller = context.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            marshaller.marshal(data, file);
        } catch (JAXBException e) {
            System.err.println("Failed to save " + filename + ": " + e.getMessage());
        }
    }

    private void loadUsers() {
        User.UserList list = loadFromXml("users.xml", User.UserList.class);
        if (list != null && list.getUsers() != null) {
            users.addAll(list.getUsers());
        }
    }

    private void saveUsers() {
        saveToXml("users.xml", new User.UserList(new ArrayList<>(users)), User.UserList.class);
    }

    private void loadRestaurants() {
        Restaurant.RestaurantList list = loadFromXml("restaurants.xml", Restaurant.RestaurantList.class);
        if (list != null && list.getRestaurants() != null) {
            restaurants.addAll(list.getRestaurants());
        }
    }

    private void saveRestaurants() {
        saveToXml("restaurants.xml", new Restaurant.RestaurantList(new ArrayList<>(restaurants)), Restaurant.RestaurantList.class);
    }

    private void loadMenuItems() {
        MenuItem.MenuItemList list = loadFromXml("menus.xml", MenuItem.MenuItemList.class);
        if (list != null && list.getMenuItems() != null) {
            menuItems.addAll(list.getMenuItems());
        }
    }

    private void saveMenuItems() {
        saveToXml("menus.xml", new MenuItem.MenuItemList(new ArrayList<>(menuItems)), MenuItem.MenuItemList.class);
    }

    private void loadOrders() {
        Order.OrderList list = loadFromXml("orders.xml", Order.OrderList.class);
        if (list != null && list.getOrders() != null) {
            orders.addAll(list.getOrders());
        }
    }

    private void saveOrders() {
        saveToXml("orders.xml", new Order.OrderList(new ArrayList<>(orders)), Order.OrderList.class);
    }

    private void loadPayments() {
        Payment.PaymentList list = loadFromXml("payments.xml", Payment.PaymentList.class);
        if (list != null && list.getPayments() != null) {
            payments.addAll(list.getPayments());
        }
    }

    private void savePayments() {
        saveToXml("payments.xml", new Payment.PaymentList(new ArrayList<>(payments)), Payment.PaymentList.class);
    }

    private void loadRiders() {
        DeliveryRider.RiderList list = loadFromXml("riders.xml", DeliveryRider.RiderList.class);
        if (list != null && list.getRiders() != null) {
            riders.addAll(list.getRiders());
        }
    }

    private void saveRiders() {
        saveToXml("riders.xml", new DeliveryRider.RiderList(new ArrayList<>(riders)), DeliveryRider.RiderList.class);
    }

    private void loadCoupons() {
        Coupon.CouponList list = loadFromXml("coupons.xml", Coupon.CouponList.class);
        if (list != null && list.getCoupons() != null) {
            coupons.addAll(list.getCoupons());
        }
    }

    private void saveCoupons() {
        saveToXml("coupons.xml", new Coupon.CouponList(new ArrayList<>(coupons)), Coupon.CouponList.class);
    }

    // ==================== SEED DATA ====================

    public void initializeSeedData() {
        if (!users.isEmpty()) {
            System.out.println("[DataStore] Seed data already exists, skipping initialization.");
            return;
        }

        System.out.println("[DataStore] Initializing seed data...");

        // --- Users ---
        User customer1 = new User("cust001", "Ahmed Khan", "ahmed@email.com", hashPassword("password123"),
                "+8801711111111", User.Role.CUSTOMER,
                new Address("Gulshan", "Road 11, House 5", "Dhaka", 23.7925, 90.4078));
        User customer2 = new User("cust002", "Sara Rahman", "sara@email.com", hashPassword("password123"),
                "+8801722222222", User.Role.CUSTOMER,
                new Address("Dhanmondi", "Road 27, Block A", "Dhaka", 23.7461, 90.3742));
        User owner1 = new User("own001", "Karim Ali", "karim@email.com", hashPassword("password123"),
                "+8801733333333", User.Role.RESTAURANT_OWNER,
                new Address("Banani", "Road 11", "Dhaka", 23.7937, 90.4066));
        User owner2 = new User("own002", "Fatima Begum", "fatima@email.com", hashPassword("password123"),
                "+8801744444444", User.Role.RESTAURANT_OWNER,
                new Address("Uttara", "Sector 7", "Dhaka", 23.8759, 90.3795));
        User owner3 = new User("own003", "Rahim Uddin", "rahim@email.com", hashPassword("password123"),
                "+8801755555555", User.Role.RESTAURANT_OWNER,
                new Address("Gulshan", "Road 135", "Dhaka", 23.7930, 90.4150));

        users.addAll(List.of(customer1, customer2, owner1, owner2, owner3));

        // --- Restaurants ---
        Restaurant r1 = new Restaurant("rest001", "own001", "Spice Garden",
                "Authentic Bengali cuisine with a modern twist. Famous for biryanis and kebabs.",
                "Bengali", new Address("Banani", "Road 11, Block F", "Dhaka", 23.7937, 90.4066),
                4.5, "10:00", "23:00");
        r1.setDeliveryFee(40.0);
        r1.setEstimatedDeliveryMinutes(25);
        r1.setImageUrl("/api/images/restaurant1.jpg");

        Restaurant r2 = new Restaurant("rest002", "own002", "Pizza Paradise",
                "Wood-fired pizzas and Italian favorites. Made with imported ingredients.",
                "Italian", new Address("Uttara", "Sector 7, Road 2", "Dhaka", 23.8759, 90.3795),
                4.3, "11:00", "22:30");
        r2.setDeliveryFee(50.0);
        r2.setEstimatedDeliveryMinutes(35);
        r2.setImageUrl("/api/images/restaurant2.jpg");

        Restaurant r3 = new Restaurant("rest003", "own003", "Dragon Wok",
                "Premium Chinese and Thai cuisine. Signature dim sum and noodle dishes.",
                "Chinese", new Address("Gulshan", "Road 135, Circle 2", "Dhaka", 23.7930, 90.4150),
                4.7, "11:30", "22:00");
        r3.setDeliveryFee(45.0);
        r3.setEstimatedDeliveryMinutes(30);
        r3.setImageUrl("/api/images/restaurant3.jpg");

        Restaurant r4 = new Restaurant("rest004", "own001", "Burger Barn",
                "Gourmet burgers, loaded fries, and craft shakes. American comfort food at its best.",
                "American", new Address("Dhanmondi", "Road 27, Block B", "Dhaka", 23.7461, 90.3742),
                4.1, "12:00", "23:30");
        r4.setDeliveryFee(35.0);
        r4.setEstimatedDeliveryMinutes(20);
        r4.setImageUrl("/api/images/restaurant4.jpg");

        Restaurant r5 = new Restaurant("rest005", "own002", "Sushi Sensation",
                "Fresh sushi rolls, sashimi, and Japanese delicacies. Premium dining experience.",
                "Japanese", new Address("Gulshan", "Road 11, House 15", "Dhaka", 23.7925, 90.4078),
                4.8, "12:00", "21:30");
        r5.setDeliveryFee(60.0);
        r5.setEstimatedDeliveryMinutes(40);
        r5.setImageUrl("/api/images/restaurant5.jpg");

        restaurants.addAll(List.of(r1, r2, r3, r4, r5));

        // --- Menu Items for Spice Garden (rest001) ---
        menuItems.addAll(List.of(
            createMenuItem("m001", "rest001", "Kacchi Biriyani", "Aromatic traditional Dhaka-style kacchi with tender goat meat", 350.0, "Main Course", true, 50,
                    List.of(new MenuAddOn("a1", "Extra Meat", 100.0), new MenuAddOn("a2", "Borhani", 30.0))),
            createMenuItem("m002", "rest001", "Chicken Reshmi Kebab", "Smoky grilled chicken kebabs marinated in special spices", 220.0, "Appetizer", true, 40,
                    List.of(new MenuAddOn("a3", "Extra Sauce", 20.0))),
            createMenuItem("m003", "rest001", "Mutton Curry", "Slow-cooked mutton in rich Bengali gravy", 400.0, "Main Course", true, 30,
                    List.of(new MenuAddOn("a4", "Extra Rice", 40.0))),
            createMenuItem("m004", "rest001", "Firni", "Creamy rice pudding with pistachios", 80.0, "Dessert", true, 60, List.of()),
            createMenuItem("m005", "rest001", "Mango Lassi", "Fresh mango yogurt smoothie", 60.0, "Beverages", true, 100, List.of())
        ));

        // --- Menu Items for Pizza Paradise (rest002) ---
        menuItems.addAll(List.of(
            createMenuItem("m006", "rest002", "Margherita Pizza", "Classic pizza with fresh mozzarella and basil", 450.0, "Pizza", true, 30,
                    List.of(new MenuAddOn("a5", "Extra Cheese", 60.0), new MenuAddOn("a6", "Jalapenos", 30.0))),
            createMenuItem("m007", "rest002", "Pepperoni Feast", "Loaded pepperoni pizza with double cheese", 550.0, "Pizza", true, 25,
                    List.of(new MenuAddOn("a7", "Stuffed Crust", 80.0))),
            createMenuItem("m008", "rest002", "Garlic Bread", "Crispy garlic bread with herb butter", 150.0, "Appetizer", true, 50,
                    List.of(new MenuAddOn("a8", "Cheese Dip", 40.0))),
            createMenuItem("m009", "rest002", "Pasta Alfredo", "Creamy fettuccine alfredo with grilled chicken", 380.0, "Pasta", true, 20, List.of()),
            createMenuItem("m010", "rest002", "Tiramisu", "Classic Italian coffee-flavored dessert", 200.0, "Dessert", true, 15, List.of())
        ));

        // --- Menu Items for Dragon Wok (rest003) ---
        menuItems.addAll(List.of(
            createMenuItem("m011", "rest003", "Chicken Fried Rice", "Wok-tossed fried rice with chicken and vegetables", 280.0, "Rice", true, 40,
                    List.of(new MenuAddOn("a9", "Extra Egg", 25.0))),
            createMenuItem("m012", "rest003", "Dim Sum Platter", "Assorted steamed dumplings (8 pcs)", 350.0, "Appetizer", true, 20,
                    List.of(new MenuAddOn("a10", "Soy Chili Sauce", 15.0))),
            createMenuItem("m013", "rest003", "Kung Pao Chicken", "Spicy stir-fried chicken with peanuts", 320.0, "Main Course", true, 35, List.of()),
            createMenuItem("m014", "rest003", "Thai Green Curry", "Coconut green curry with vegetables and chicken", 380.0, "Main Course", true, 25,
                    List.of(new MenuAddOn("a11", "Jasmine Rice", 50.0))),
            createMenuItem("m015", "rest003", "Mango Sticky Rice", "Sweet glutinous rice with fresh mango", 150.0, "Dessert", true, 30, List.of())
        ));

        // --- Menu Items for Burger Barn (rest004) ---
        menuItems.addAll(List.of(
            createMenuItem("m016", "rest004", "Classic Smash Burger", "Double smashed patty with cheese and special sauce", 300.0, "Burgers", true, 50,
                    List.of(new MenuAddOn("a12", "Extra Patty", 120.0), new MenuAddOn("a13", "Bacon", 60.0))),
            createMenuItem("m017", "rest004", "Loaded Fries", "Crispy fries with cheese, jalapenos and sour cream", 180.0, "Sides", true, 60,
                    List.of(new MenuAddOn("a14", "Truffle Oil", 40.0))),
            createMenuItem("m018", "rest004", "BBQ Chicken Burger", "Grilled chicken with BBQ sauce and coleslaw", 280.0, "Burgers", true, 40, List.of()),
            createMenuItem("m019", "rest004", "Oreo Milkshake", "Thick milkshake blended with Oreo cookies", 160.0, "Beverages", true, 45, List.of()),
            createMenuItem("m020", "rest004", "Chicken Wings", "Crispy buffalo wings with ranch dip (6 pcs)", 250.0, "Appetizer", true, 35,
                    List.of(new MenuAddOn("a15", "Extra Ranch", 20.0)))
        ));

        // --- Menu Items for Sushi Sensation (rest005) ---
        menuItems.addAll(List.of(
            createMenuItem("m021", "rest005", "California Roll", "Crab, avocado and cucumber maki (8 pcs)", 420.0, "Sushi", true, 20,
                    List.of(new MenuAddOn("a16", "Extra Wasabi", 10.0))),
            createMenuItem("m022", "rest005", "Salmon Sashimi", "Fresh Norwegian salmon slices (6 pcs)", 580.0, "Sashimi", true, 15, List.of()),
            createMenuItem("m023", "rest005", "Tempura Platter", "Assorted prawn and vegetable tempura", 450.0, "Appetizer", true, 20,
                    List.of(new MenuAddOn("a17", "Tentsuyu Sauce", 25.0))),
            createMenuItem("m024", "rest005", "Ramen Bowl", "Rich tonkotsu ramen with chashu pork", 400.0, "Noodles", true, 25,
                    List.of(new MenuAddOn("a18", "Extra Noodles", 50.0), new MenuAddOn("a19", "Soft Boiled Egg", 30.0))),
            createMenuItem("m025", "rest005", "Matcha Ice Cream", "Traditional Japanese green tea ice cream", 120.0, "Dessert", true, 40, List.of())
        ));

        // --- Riders ---
        riders.addAll(List.of(
            new DeliveryRider("rider001", "r1", "Rashid Hasan", "+8801766666666", "Motorcycle", true, "Gulshan"),
            new DeliveryRider("rider002", "r2", "Imran Ali", "+8801777777777", "Motorcycle", true, "Banani"),
            new DeliveryRider("rider003", "r3", "Jamal Uddin", "+8801788888888", "Bicycle", true, "Dhanmondi"),
            new DeliveryRider("rider004", "r4", "Sumon Ahmed", "+8801799999999", "Motorcycle", true, "Uttara"),
            new DeliveryRider("rider005", "r5", "Kabir Khan", "+8801700000000", "Motorcycle", true, "Gulshan")
        ));

        // --- Coupons ---
        coupons.addAll(List.of(
            new Coupon("WELCOME50", "50% off on your first order!", 50, 200, 100, "2026-12-31"),
            new Coupon("SAVE20", "20% off on orders above 500", 20, 150, 500, "2026-12-31"),
            new Coupon("FREEDEL", "Free delivery on orders above 300", 100, 60, 300, "2026-06-30"),
            new Coupon("FEAST15", "15% off on all orders", 15, 100, 200, "2026-12-31")
        ));

        // Save all seed data
        saveUsers();
        saveRestaurants();
        saveMenuItems();
        saveOrders();
        savePayments();
        saveRiders();
        saveCoupons();

        System.out.println("[DataStore] Seed data initialized successfully!");
    }

    private MenuItem createMenuItem(String id, String restaurantId, String name, String desc,
                                     double price, String category, boolean available, int quantity,
                                     List<MenuAddOn> addOns) {
        MenuItem item = new MenuItem(id, restaurantId, name, desc, price, category, available, quantity);
        item.setAddOns(new ArrayList<>(addOns));
        return item;
    }

    private String hashPassword(String password) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return password;
        }
    }
}
