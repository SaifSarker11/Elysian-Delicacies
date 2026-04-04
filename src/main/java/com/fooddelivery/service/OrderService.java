package com.fooddelivery.service;

import com.fooddelivery.model.*;
import com.fooddelivery.storage.XmlDataStore;
import com.fooddelivery.util.IdGenerator;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class OrderService {

    private final XmlDataStore dataStore;
    private final MenuService menuService;

    public OrderService() {
        this.dataStore = XmlDataStore.getInstance();
        this.menuService = new MenuService();
    }

    public Order placeOrder(Order order) {
        order.setId(IdGenerator.generate());
        order.setStatus(Order.Status.PLACED);
        order.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        order.setUpdatedAt(order.getCreatedAt());

        for (OrderItem item : order.getItems()) {
            item.calculateTotal();
        }

        order.calculateTotals();

        Restaurant restaurant = dataStore.getRestaurantById(order.getRestaurantId()).orElse(null);
        if (restaurant != null) {
            order.setRestaurantName(restaurant.getName());
            if (order.getDeliveryFee() == 0) {
                order.setDeliveryFee(restaurant.getDeliveryFee());
            }
            int deliveryMins = restaurant.getEstimatedDeliveryMinutes();
            order.setEstimatedDelivery(
                    LocalDateTime.now().plusMinutes(deliveryMins)
                            .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            order.calculateTotals();
        }

        List<DeliveryRider> availableRiders = dataStore.getAvailableRiders(null);
        if (!availableRiders.isEmpty()) {
            DeliveryRider rider = availableRiders.get(0);
            order.setRiderId(rider.getId());
            order.setRiderName(rider.getName());
            rider.setAvailable(false);
            dataStore.updateRider(rider);
        }

        for (OrderItem item : order.getItems()) {
            dataStore.getMenuItemById(item.getMenuItemId()).ifPresent(menuItem -> {
                menuItem.setQuantity(Math.max(0, menuItem.getQuantity() - item.getQuantity()));
                if (menuItem.getQuantity() == 0)
                    menuItem.setAvailable(false);
                dataStore.updateMenuItem(menuItem);
            });
        }

        return dataStore.addOrder(order);
    }

    public Order getOrderById(String orderId) {
        return dataStore.getOrderById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    }

    public List<Order> getOrdersByCustomer(String customerId) {
        return dataStore.getOrdersByCustomer(customerId);
    }

    public List<Order> getOrdersByRestaurant(String restaurantId) {
        return dataStore.getOrdersByRestaurant(restaurantId);
    }

    public Order updateStatus(String orderId, String newStatus) {
        Order order = getOrderById(orderId);
        Order.Status status = Order.Status.valueOf(newStatus.toUpperCase());
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        // If delivered or cancelled, free up the rider
        if (status == Order.Status.DELIVERED || status == Order.Status.CANCELLED) {
            if (order.getRiderId() != null) {
                dataStore.getRiderById(order.getRiderId()).ifPresent(rider -> {
                    rider.setAvailable(true);
                    dataStore.updateRider(rider);
                });
            }
        }

        return dataStore.updateOrder(order);
    }

    public Order assignRider(String orderId, String riderId) {
        Order order = getOrderById(orderId);
        DeliveryRider rider = dataStore.getRiderById(riderId)
                .orElseThrow(() -> new IllegalArgumentException("Rider not found: " + riderId));

        order.setRiderId(rider.getId());
        order.setRiderName(rider.getName());
        rider.setAvailable(false);
        dataStore.updateRider(rider);

        return dataStore.updateOrder(order);
    }

    public List<Order> getAllOrders() {
        return dataStore.getAllOrders();
    }
}
