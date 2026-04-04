package com.fooddelivery.service;

import com.fooddelivery.model.DeliveryRider;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.storage.XmlDataStore;
import com.fooddelivery.util.DistanceCalculator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DeliveryService {

    private final XmlDataStore dataStore;

    public DeliveryService() {
        this.dataStore = XmlDataStore.getInstance();
    }

    public List<DeliveryRider> getAvailableRiders(String area) {
        return dataStore.getAvailableRiders(area);
    }

    public List<DeliveryRider> getAllRiders() {
        return dataStore.getAllRiders();
    }

    public Map<String, Object> getDeliveryEstimate(String restaurantId, double customerLat, double customerLon) {
        Restaurant restaurant = dataStore.getRestaurantById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found: " + restaurantId));

        double distance = DistanceCalculator.calculateDistance(
                restaurant.getAddress().getLatitude(), restaurant.getAddress().getLongitude(),
                customerLat, customerLon);

        double fee = DistanceCalculator.estimateDeliveryFee(distance);
        int timeMinutes = DistanceCalculator.estimateDeliveryTime(distance);

        Map<String, Object> estimate = new HashMap<>();
        estimate.put("distanceKm", Math.round(distance * 100.0) / 100.0);
        estimate.put("deliveryFee", Math.round(fee * 100.0) / 100.0);
        estimate.put("estimatedMinutes", timeMinutes);
        estimate.put("restaurantName", restaurant.getName());

        return estimate;
    }

    public DeliveryRider getRiderById(String riderId) {
        return dataStore.getRiderById(riderId)
                .orElseThrow(() -> new IllegalArgumentException("Rider not found: " + riderId));
    }
}
