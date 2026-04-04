package com.fooddelivery.service;

import com.fooddelivery.model.Restaurant;
import com.fooddelivery.storage.XmlDataStore;
import com.fooddelivery.util.IdGenerator;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class RestaurantService {

    private final XmlDataStore dataStore;

    public RestaurantService() {
        this.dataStore = XmlDataStore.getInstance();
    }

    public Restaurant registerRestaurant(Restaurant restaurant) {
        if (restaurant.getId() == null || restaurant.getId().isEmpty()) {
            restaurant.setId(IdGenerator.generate());
        }
        if (restaurant.getRating() == 0)
            restaurant.setRating(4.0);
        restaurant.setOpen(true);
        return dataStore.addRestaurant(restaurant);
    }

    public List<Restaurant> getRestaurants(String area, String cuisine, String sortBy, String search) {
        List<Restaurant> result = dataStore.getAllRestaurants().stream().collect(Collectors.toList());

        if (area != null && !area.isEmpty()) {
            result = result.stream()
                    .filter(r -> r.getAddress() != null &&
                            r.getAddress().getArea().equalsIgnoreCase(area))
                    .collect(Collectors.toList());
        }

        if (cuisine != null && !cuisine.isEmpty()) {
            result = result.stream()
                    .filter(r -> r.getCuisineType().equalsIgnoreCase(cuisine))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isEmpty()) {
            String lower = search.toLowerCase();
            result = result.stream()
                    .filter(r -> r.getName().toLowerCase().contains(lower) ||
                            r.getDescription().toLowerCase().contains(lower) ||
                            r.getCuisineType().toLowerCase().contains(lower))
                    .collect(Collectors.toList());
        }

        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "rating" -> result.sort(Comparator.comparingDouble(Restaurant::getRating).reversed());
                case "name" -> result.sort(Comparator.comparing(Restaurant::getName));
                case "delivery_fee" -> result.sort(Comparator.comparingDouble(Restaurant::getDeliveryFee));
                case "delivery_time" -> result.sort(Comparator.comparingInt(Restaurant::getEstimatedDeliveryMinutes));
            }
        }

        return result;
    }

    public Restaurant getRestaurantById(String id) {
        return dataStore.getRestaurantById(id)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found: " + id));
    }

    public List<Restaurant> getRestaurantsByOwner(String ownerId) {
        return dataStore.getRestaurantsByOwner(ownerId);
    }

    public Restaurant updateRestaurant(Restaurant restaurant) {
        return dataStore.updateRestaurant(restaurant);
    }

    public Restaurant toggleStatus(String restaurantId) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        restaurant.setOpen(!restaurant.isOpen());
        return dataStore.updateRestaurant(restaurant);
    }

    public List<Restaurant> searchByArea(String area) {
        return dataStore.getRestaurantsByArea(area);
    }

    public List<Restaurant> searchByCuisine(String cuisine) {
        return dataStore.getRestaurantsByCuisine(cuisine);
    }
}
